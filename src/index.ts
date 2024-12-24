import {
    Plugin,
    showMessage,
    confirm,
    Dialog,
    Menu,
    openTab,
    adaptHotkey,
    getFrontend,
    getBackend,
    Setting,
    fetchPost,
    Protyle,
    openWindow,
    IOperation,
    Constants,
    openMobileFileById,
    lockScreen,
    ICard,
    ICardData,
    Custom, exitSiYuan, getModelByDockType, getAllEditor, Files, platformUtils
} from "siyuan";
import "./index.scss";
import { IMenuItem } from "siyuan/types";
import * as api from "./api";

export default class FormatHelper extends Plugin {

    private custom: () => Custom;
    private isMobile: boolean;
    private appId = this.app.appId;

    // 加载完成
    onload() {
        this.eventBus.on("click-blockicon", this.addTextBlockItem.bind(this));
        console.log(this.i18n.helloPlugin);
    }

    // 界面显示完成
    onLayoutReady() {
        // console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);
    }

    // 插件取消加载
    onunload() {
        this.eventBus.off("click-blockicon", this.addTextBlockItem.bind(this));
        console.log(this.i18n.byePlugin);
    }

    // 插件卸载或停用
    uninstall() {
        this.eventBus.off("click-blockicon", this.addTextBlockItem.bind(this));
        console.log(this.i18n.uninstallPlugin);
    }

    // SECTION 添加点击菜单====================>
    // NOTE - 添加内容块菜单
    private addTextBlockItem({ detail }: any) {
        let menu: Menu = detail.menu;
        let submenu = [];
        let protyle: HTMLElement = detail.blockElements[0];
        let blockId = protyle.getAttribute('data-node-id');
        let children = detail.blockElements[0].childNodes;
        // 判断选中块类型，目前只能快速分辨代码块
        if (Array.from(children).some(child => (child as HTMLElement).classList.contains('hljs'))) {
            submenu.push({
                icon: "iconInfo",
                label: this.i18n.codeBlockAdjIndex,
                click: () => {
                    this.handleCodeBlock(blockId, "indent");
                }
            })
        } else {
            submenu.push({
                icon: "iconEdit",
                label: this.i18n.textBlockRmWhiteSpace,
                click: () => {
                    this.handleTextBlock(blockId, detail.protyle, "remove");
                }
            });
            submenu.push({
                icon: "iconEdit",
                label: this.i18n.textBlockKeepWhiteSpace,
                click: () => {
                    this.handleTextBlock(blockId, detail.protyle, "keep");
                }
            });
            submenu.push({
                icon: "iconEdit",
                label: this.i18n.textBlockAddSpace,
                click: () => {
                    this.handleTextBlock(blockId, detail.protyle, "space");
                }
            })
        }
        if (submenu.length != 0) {
            menu.addItem({
                icon: "iconFormat",
                label: this.i18n.title,
                type: "submenu",
                submenu: submenu
            })
        }
    }
    // !SECTION 添加点击菜单====================<

    // SECTION 处理文本操作====================>
    // NOTE - 处理内容块菜单点击事件
    private async handleTextBlock(blockId: string, protyle: Protyle["protyle"], type: string) {
        // 获取块
        let dom: { dom: string, id: string } = await api.getDom(blockId);
        let origin = { dom: "", id: "" };
        origin.dom = dom.dom;
        origin.id = dom.id;
        // console.log(dom);
        // 如果未获取到块
        if (dom == null || dom == undefined) {
            showMessage(this.i18n.noParaFound, undefined, "error");
            return
        }
        // 如果获取到的块id不对(看似不可能发生)
        if (blockId != dom.id) {
            showMessage(this.i18n.idWrong, undefined, "error");
            return
        }
        let updated;
        // 移除所有空格
        if (type == "remove")
            updated = this.removeWriteSpace(dom, 0);
        // 保留一个空格
        else if (type == "keep")
            updated = this.removeWriteSpace(dom, 1);
        // 为数字和英文添加空格
        else if (type == "space")
            updated = this.addSpace(dom);
        if (updated == null || updated == undefined || updated.dom === origin.dom && updated.id === origin.id) {
            showMessage(this.i18n.nothingChange);
        } else {
            protyle.getInstance().updateTransaction(blockId, updated.dom, origin.dom);
            let startTime = Date.now();
            while (Date.now() - startTime < 1000) {
                continue;
            }
            protyle.getInstance().reload(true);
            showMessage(this.i18n.needRefresh);
        }
    }

    // NOTE - 移除空格
    private removeWriteSpace(dom: { dom: string, id: string }, keep: 0 | 1) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(dom.dom, "text/html");
        let blockElements = doc.querySelectorAll('[data-node-id]');
        // console.log(blockElements);
        if (blockElements.length === 0) {
            console.warn("No block elements found.");
            showMessage(this.i18n.noTextFound, undefined, "error");
            return dom;
        }

        blockElements.forEach(blockElement => {
            let editable = blockElement.querySelector('div[contenteditable=true]');
            if (editable) {
                let walker = document.createTreeWalker(editable, NodeFilter.SHOW_TEXT, null);
                let node;
                while (node = walker.nextNode()) {
                    let innerText = node.nodeValue;
                    let skip = false;
                    // 跳过tag
                    if ((node.parentNode as HTMLElement).getAttribute('data-type') == 'tag') {
                        skip = true;
                    }
                    // console.log(innerText);
                    // 去除文本中的多余空格，但保留换行符
                    if (innerText && !skip) {
                        if (keep == 0)
                            innerText = innerText.replace(/[ \t\f\v]+/g, '').trim();
                        else if (keep == 1)
                            innerText = innerText.replace(/[ \t\f\v]+/g, ' ').trim();
                        // console.log(innerText);
                        node.nodeValue = innerText;
                    }
                }
            }
        });

        dom.dom = doc.body.innerHTML;
        // console.log(dom);

        // 返回修改后的整个 DOM 文档
        return dom;
    }

    // NOTE - 对数字英文添加空格
    private addSpace(dom: { dom: string, id: string }) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(dom.dom, "text/html");
        let blockElements = doc.querySelectorAll('[data-node-id]');
        if (blockElements.length === 0) {
            console.warn("No block elements found.");
            showMessage(this.i18n.noTextFound, undefined, "error");
            return dom;
        }
        blockElements.forEach(blockElement => {
            let editable = blockElement.querySelector('div[contenteditable=true]');
            if (editable) {
                let walker = document.createTreeWalker(editable, NodeFilter.SHOW_TEXT, null);
                let node;
                while (node = walker.nextNode()) {
                    let innerText = node.nodeValue;
                    let skip = false;
                    // 跳过tag
                    if ((node.parentNode as HTMLElement).getAttribute('data-type') == 'tag') {
                        skip = true;
                    }
                    // 匹配数字和英文，添加空格
                    if (innerText && !skip) {
                        innerText = innerText.replace(/([^0-9a-zA-Z \t\f\v])([0-9a-zA-Z]+)/g, '$1 $2').trim();
                        innerText = innerText.replace(/([0-9a-zA-Z]+)([^0-9a-zA-Z \t\f\v])/g, '$1 $2').trim();
                        node.nodeValue = innerText;
                    }
                }
            }
        });
        dom.dom = doc.body.innerHTML;
        return dom;
    }
    // !SECTION 处理文本操作====================<

    // SECTION 处理代码块操作====================>
    // NOTE - 处理代码块菜单点击事件
    private async handleCodeBlock(blockId: string, type: string) {
        // 获取块
        let dom: { dom: string, id: string } = await api.getDom(blockId);
        let id = dom.id;
        // console.log(dom);
        // 如果未获取到块
        if (dom == null || dom == undefined) {
            showMessage(this.i18n.noParaFound, undefined, "error");
            return
        }
        // 如果获取到的块id不对(看似不可能发生)
        if (blockId != id) {
            showMessage(this.i18n.idWrong, undefined, "error");
            return
        }
        if (type == "indent") {
            var newDom = this.codeBlockDecline(dom);
            newDom = this.codeBlockRise(newDom);
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
    private codeBlockDecline(dom: { dom: string, id: string }) {
        console.log(dom);
        let parser = new DOMParser();
        let doc = parser.parseFromString(dom.dom, "text/html");
        var hljs = doc.querySelector('div.hljs');
        var editable = hljs.querySelector("[contenteditable=true]");
        var innerHTML = editable.innerHTML.replace(/^[ \t]+/gm, "");
        editable.innerHTML = innerHTML;
        dom.dom = doc.body.innerHTML;
        console.log(dom);
        return dom;
    }

    // NOTE - 添加代码块缩进
    private codeBlockRise(dom: { dom: string, id: string }) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(dom.dom, "text/html");
        var hljs = doc.querySelector('div.hljs');
        var editable = hljs.querySelector("[contenteditable=true]");
        var innerHTML = editable.innerHTML;
        return dom;
    }
    // !SECTION 处理代码块操作====================<
}
