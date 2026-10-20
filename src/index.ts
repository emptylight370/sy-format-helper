import { Plugin, showMessage, Menu } from 'siyuan';
import './index.scss';
import { IProtyle } from 'siyuan/types';
import * as api from './api';

export default class FormatHelper extends Plugin {
    private appId = this.app.appId;
    // 存储固定引用：bind 每次会生成新函数，off 必须传入与 on 相同的引用才能移除监听器
    private readonly onBlockIcon = this.addTextBlockItem.bind(this);
    // 防止重复点击：上一次批量处理未结束时忽略新的触发
    private processing = false;

    // 加载完成
    onload() {
        this.eventBus.on('click-blockicon', this.onBlockIcon);
        console.log(this.i18n.helloPlugin);
    }

    // 界面显示完成
    onLayoutReady() {
        // console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    // 插件取消加载
    onunload() {
        this.eventBus.off('click-blockicon', this.onBlockIcon);
        console.log(this.i18n.byePlugin);
    }

    // 插件卸载或停用
    uninstall() {
        this.eventBus.off('click-blockicon', this.onBlockIcon);
        console.log(this.i18n.uninstallPlugin);
    }

    // SECTION 添加点击菜单====================>
    // NOTE - 添加内容块菜单
    private addTextBlockItem({ detail }: any) {
        const menu: Menu = detail.menu;
        const submenu = [];
        const blockElements: HTMLElement[] = detail.blockElements;
        const protyle = detail.protyle as IProtyle;
        const children = detail.blockElements[0].childNodes;
        // 判断选中块类型，目前只能快速分辨代码块
        if (Array.from(children).some((child) => (child as HTMLElement).classList.contains('hljs'))) {
            submenu.push({
                icon: 'iconInfo',
                label: this.i18n.codeBlockAdjIndex,
                click: async () => {
                    showMessage(this.i18n.codeBlockOnlyFirst);
                    const blockId = blockElements[0].getAttribute('data-node-id');
                    await this.handleCodeBlock(blockId, 'indent');
                },
            });
            submenu.push({
                icon: 'iconInfo',
                label: this.i18n.codeBlockRmIndex,
                click: async () => {
                    showMessage(this.i18n.codeBlockOnlyFirst);
                    const blockId = blockElements[0].getAttribute('data-node-id');
                    await this.handleCodeBlock(blockId, 'rindent');
                },
            });
        } else {
            // 文本块操作菜单：数据驱动，统一入口为 processTextBlocks
            const textItems: Array<{ label: string; type: string }> = [
                { label: this.i18n.textBlockRmWhiteSpace, type: 'remove' },
                { label: this.i18n.textBlockAddSpace, type: 'space' },
                { label: this.i18n.textBlockUpperCase, type: 'upper' },
                { label: this.i18n.textBlockLowerCase, type: 'lower' },
                { label: this.i18n.textBlockFullToHalf, type: 'fullToHalf' },
                { label: this.i18n.textBlockHalfToFull, type: 'halfToFull' },
                { label: this.i18n.lawAddSpace, type: 'law' },
                { label: this.i18n.CNtoEN, type: 'CNtoEN' },
                { label: this.i18n.ENtoCN, type: 'ENtoCN' },
            ];
            textItems.forEach((item) => {
                submenu.push({
                    icon: 'iconEdit',
                    label: item.label,
                    click: () => this.processTextBlocks(blockElements, protyle, item.type),
                });
            });
        }
        if (submenu.length != 0) {
            menu.addItem({
                icon: 'iconFormat',
                label: this.i18n.title,
                type: 'submenu',
                submenu: submenu,
            });
        }
    }
    // !SECTION 添加点击菜单====================<

    // SECTION 处理文本操作====================>
    // NOTE - 批量处理选中文本块：重复点击防护、逐块容错、聚合提示
    private async processTextBlocks(blockElements: HTMLElement[], protyle: IProtyle, type: string) {
        if (this.processing) {
            return;
        }
        this.processing = true;
        try {
            let changedCount = 0;
            let failedCount = 0;
            for (const blockElement of blockElements) {
                const blockId = blockElement.getAttribute('data-node-id');
                if (!blockId) {
                    continue;
                }
                try {
                    if (await this.handleTextBlock(blockId, protyle, type)) {
                        changedCount++;
                    }
                } catch (error) {
                    failedCount++;
                    console.error(`format block ${blockId} failed:`, error);
                }
            }
            if (failedCount > 0) {
                showMessage(this.i18n.noParaFound, undefined, 'error');
            } else if (changedCount === 0) {
                showMessage(this.i18n.nothingChange);
            } else if (type === 'law') {
                showMessage(this.i18n.lawIncludeFullSpace);
            }
        } finally {
            this.processing = false;
        }
    }

    // NOTE - 处理单个文本块，返回是否发生修改并提交
    private async handleTextBlock(blockId: string, protyle: IProtyle, type: string): Promise<boolean> {
        // 获取块（接口异常时 request 返回 null，必须先判空再取属性）
        const dom: { dom: string; id: string } | null = await api.getDom(blockId);
        if (!dom || !dom.dom) {
            throw new Error(`getBlockDOM failed: ${blockId}`);
        }
        const originDom = dom.dom;
        // 如果获取到的块id不对(看似不可能发生)
        if (blockId !== dom.id) {
            showMessage(this.i18n.idWrong, undefined, 'error');
            return false;
        }
        // 仅解析一次内核 HTML，后续直接操作文档树，避免字符串的多次序列化/解析往返
        const doc = new DOMParser().parseFromString(originDom, 'text/html');
        if (!this.applyTextTransform(doc, type)) {
            return false;
        }
        const newBlockElement = doc.body.firstElementChild;
        if (!newBlockElement) {
            return false;
        }
        const newElement = document.importNode(newBlockElement, true) as HTMLElement;
        this.commitUpdatedBlock(protyle, blockId, newElement, originDom);
        return true;
    }

    // NOTE - 将修改后的块元素替换进编辑器真实 DOM，并提交事务
    private commitUpdatedBlock(protyle: IProtyle, blockId: string, newElement: HTMLElement, oldHTML: string) {
        const oldElement = protyle.wysiwyg?.element.querySelector(`[data-node-id="${blockId}"]`);
        if (!oldElement) {
            showMessage(this.i18n.noParaFound, undefined, 'error');
            return;
        }
        oldElement.replaceWith(newElement);
        // updateTransactionElement 定义在 Protyle 类实例上，而非内部 IProtyle 对象上，
        // 必须通过 getInstance() 获取类实例后调用，否则事务不会被提交
        try {
            protyle.getInstance().updateTransactionElement(newElement, oldHTML);
        } catch (error) {
            // 提交失败时 DOM 已被替换，提示用户刷新核对，避免误以为已保存
            console.error('submit transaction failed:', error);
            showMessage(this.i18n.transactionFailed, undefined, 'error');
        }
    }

    // NOTE - 各文本变换规则：对块内每个文本节点应用一次映射
    private readonly textMappers: Record<string, (text: string) => string> = {
        // 智能移除空格（保留换行符）
        remove: (text) =>
            text
                .replace(/(?<![a-zA-Z0-9])[ \t\f\v]+(?![a-zA-Z0-9])/g, '')
                .replace(/[ ]{2,}/g, ' ')
                .trim(),
        // 为数字和英文添加空格
        space: (text) =>
            text
                .replace(/([^0-9a-zA-Z \t\f\v])([0-9a-zA-Z]+)/g, '$1 $2')
                .replace(/([0-9a-zA-Z]+)([^0-9a-zA-Z \t\f\v])/g, '$1 $2')
                .trim(),
        // 全字母大写
        upper: (text) => text.toUpperCase(),
        // 全字母小写
        lower: (text) => text.toLowerCase(),
        // 全角字符转半角字符
        fullToHalf: (text) =>
            text
                .replace(/[\uff01-\uff5e]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0xfee0))
                .replace(/\u3000/g, ' '),
        // 半角字符转全角字符
        halfToFull: (text) =>
            text
                .replace(/[\u0021-\u007e]/g, (match) => String.fromCharCode(match.charCodeAt(0) + 0xfee0))
                .replace(/ /g, '\u3000'),
        // 法律法规（章、节、条）后添加空格
        law: (text) =>
            text
                .replace(/\u3000/g, ' ')
                .replace(/(第.*?[编章节条])(?!\s)/g, '$1 ')
                .trim(),
        // 英文符号转中文符号
        ENtoCN: (text) =>
            text
                .replace(/,/g, '，')
                .replace(/\./g, '。')
                .replace(/\(/g, '（')
                .replace(/\)/g, '）')
                .replace(/\[/g, '【')
                .replace(/\]/g, '】')
                .replace(/:/g, '：')
                .replace(/;/g, '；')
                .replace(/!/g, '！')
                .replace(/\?/g, '？'),
        // 中文符号转英文符号
        CNtoEN: (text) =>
            text
                .replace(/，/g, ',')
                .replace(/。/g, '.')
                .replace(/（/g, '(')
                .replace(/）/g, ')')
                .replace(/【/g, '[')
                .replace(/】/g, ']')
                .replace(/：/g, ':')
                .replace(/；/g, ';')
                .replace(/！/g, '!')
                .replace(/？/g, '?'),
    };

    // NOTE - 对解析后的块 DOM 应用文本变换，返回是否实际发生修改
    private applyTextTransform(doc: Document, type: string): boolean {
        const mapper = this.textMappers[type];
        if (!mapper) {
            return false;
        }
        const blockElements = doc.querySelectorAll('[data-node-id]');
        if (blockElements.length === 0) {
            console.warn('No block elements found.');
            showMessage(this.i18n.noTextFound, undefined, 'error');
            return false;
        }
        let changed = false;
        blockElements.forEach((blockElement) => {
            const editable = blockElement.querySelector('div[contenteditable=true]');
            if (!editable) {
                return;
            }
            const walker = document.createTreeWalker(editable, NodeFilter.SHOW_TEXT, null);
            let node;
            while ((node = walker.nextNode())) {
                const innerText = node.nodeValue;
                // 跳过tag
                if (!innerText || (node.parentNode as HTMLElement).getAttribute('data-type') == 'tag') {
                    continue;
                }
                const mapped = mapper(innerText);
                if (mapped !== innerText) {
                    node.nodeValue = mapped;
                    changed = true;
                }
            }
        });
        return changed;
    }
    // !SECTION 处理文本操作====================<

    // SECTION 处理代码块操作====================>
    // NOTE - 处理代码块菜单点击事件
    private async handleCodeBlock(blockId: string, type: string) {
        // 获取块
        const dom: { dom: string; id: string } = await api.getDom(blockId);
        const id = dom.id;
        // console.log(dom);
        // 如果未获取到块
        if (dom == null || dom == undefined) {
            showMessage(this.i18n.noParaFound, undefined, 'error');
            return;
        }
        // 如果获取到的块id不对(看似不可能发生)
        if (blockId != id) {
            showMessage(this.i18n.idWrong, undefined, 'error');
            return;
        }
        if (type == 'indent') {
            var newDom = this.codeBlockDecline(dom);
            newDom = this.codeBlockRise(newDom);
        } else if (type == 'rindent') {
            var newDom = this.codeBlockDecline(dom);
        }
        // 暂时抑制代码块操作
        newDom = null;
        if (newDom == null || newDom == undefined || newDom === dom) {
            showMessage(this.i18n.nothingChange);
        } else {
            await api.updateBlockTransactions(blockId, this.appId, dom.dom, newDom.dom);
        }
    }

    // NOTE - 移除代码块缩进
    private codeBlockDecline(dom: { dom: string; id: string }) {
        console.log(dom);
        const parser = new DOMParser();
        const doc = parser.parseFromString(dom.dom, 'text/html');
        const hljs = doc.querySelector('div.hljs');
        const editable = hljs.querySelector('[contenteditable=true]');
        const innerHTML = editable.innerHTML.replace(/^[ \t]+/gm, '');
        editable.innerHTML = innerHTML;
        dom.dom = doc.body.innerHTML;
        console.log(dom);
        return dom;
    }

    // NOTE - 添加代码块缩进
    private codeBlockRise(dom: { dom: string; id: string }) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(dom.dom, 'text/html');
        const hljs = doc.querySelector('div.hljs');
        const editable = hljs.querySelector('[contenteditable=true]');
        const innerHTML = editable.innerHTML;
        return dom;
    }
    // !SECTION 处理代码块操作====================<
}
