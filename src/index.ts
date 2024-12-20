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
        console.log(this.i18n.uninstallPlugin);
    }

    // 移除空格
    private removeWriteSpace(dom: { dom: string, id: string }, keep: 0 | 1) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(dom.dom, "text/html");
        let blockElements = doc.querySelectorAll('[data-node-id]');
        // console.log(blockElements);
        if (blockElements.length === 0) {
            console.warn("No block elements found.");
            api.sendError(this.i18n.noTextFound);
            return dom;
        }

        blockElements.forEach(blockElement => {
            let editable = blockElement.querySelector('div[contenteditable=true]');
            if (editable) {
                let walker = document.createTreeWalker(editable, NodeFilter.SHOW_TEXT, null);
                let node;
                while (node = walker.nextNode()) {
                    let innerText = node.nodeValue;
                    // console.log(innerText);
                    // 去除文本中的多余空格，但保留换行符
                    if (innerText) {
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

    // 对结果进行后处理
    private postRecover(dom: { dom: string, id: string }) {
        return dom;
    }

    // 添加内容块菜单
    private addTextBlockItem({ detail }: any) {
        let menu: Menu = detail.menu;
        let submenu = [];
        let protyle: HTMLElement = detail.blockElements[0];
        let blockId = protyle.getAttribute('data-node-id');
        submenu.push({
            icon: "iconInfo",
            label: this.i18n.textBlockRmWhiteSpace,
            click: () => {
                // console.log(detail);
                // console.log(blockId);
                this.handleTextBlock(blockId, "remove");
            }
        });
        submenu.push({
            icon: "iconInfo",
            label: this.i18n.textBlockKeepWhiteSpace,
            click: () => {
                this.handleTextBlock(blockId, "keep");
            }
        })
        menu.addItem({
            icon: "iconInfo",
            label: this.i18n.title,
            type: "submenu",
            submenu: submenu
        })
    }

    // 处理内容块菜单点击事件
    private async handleTextBlock(blockId: string, type: string) {
        // 获取块
        let dom: { dom: string, id: string } = await api.getDom(blockId);
        let id = dom.id;
        // console.log(dom);
        // console.log(dom.dom);
        // 如果未获取到块
        if (dom == null || dom == undefined) {
            api.sendError(this.i18n.noParaFound);
            return
        }
        // 如果获取到的块id不对(看似不可能发生)
        if (blockId != id) {
            api.sendError(this.i18n.idWrong);
            return
        }
        // 移除所有空格
        if (type == "remove")
            var newDom = this.removeWriteSpace(dom, 0);
        // 保留一个空格
        else if (type == "keep")
            newDom = this.removeWriteSpace(dom, 1);
        // console.log(kramdown);
        // 后处理结果，例如加回标题的空格，加回块引用后分隔的空格
        // newDom = this.postRecover(newDom);
        // await api.updateBlock(blockId, kramdown);
        await api.updateBlockTransactions(blockId, this.appId, dom.dom, newDom.dom);
    }
}
