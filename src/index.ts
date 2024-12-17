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
    private removeWriteSpace(kramdown: string): string {
        // 正则表达式用于匹配文本部分
        const textPattern = /(?<=$\([^\s"]*\s")([^"]*)(?="$)/g;

        // 替换函数，用于去除匹配到的文本中的多余空格
        function replaceSpaces(match: string): string {
            return match.trim().replace(/\s+/g, '');
        }

        // 对所有匹配到的文本部分应用替换函数
        let result = kramdown.replace(textPattern, replaceSpaces);

        // 处理不在 ((...)) 内部的纯文本部分
        // 使用负向前瞻和后瞻断言来确保不匹配标志部分
        const outsidePattern = /(?<!$\()[^"\{\}\($]+(?!\)\))/g;
        result = result.replace(outsidePattern, replaceSpaces);

        return result;
    }

    // 移除不需要的属性
    private removeAttributes(karmdown: string, attrsToRemove: string[]): string {
        // 正则表达式用于匹配一对花括号内的所有内容
        const fullAttributePattern = /{\:[\s\S]*}/g;

        // 遍历并检查每一对花括号内的内容
        return karmdown.replace(fullAttributePattern, (match) => {
            let shouldRemove = false;
            attrsToRemove.forEach(attr => {
                if (new RegExp(`\\b${attr}="[^"]+"`, 'g').test(match)) {
                    shouldRemove = true;
                }
            });

            // 如果匹配到任何一个要移除的属性，则移除整个花括号内的内容
            return shouldRemove ? '' : match;
        });
    }

    // 移除和开头相同的字符
    private removeEndSimilar(karmdown: string) {
        // 如果长度为0直接返回
        if (karmdown.length == 0) {
            return karmdown;
        }
        // 获取第一个字符
        let firstChar = karmdown.charAt(0);
        // 获取最后一个字符
        let lastChar = karmdown.charAt(karmdown.length - 1);
        // 检测字符是否一样
        if (firstChar == lastChar) {
            // 去除最后一个字符
            return karmdown.slice(0, -1);
        }
        // 返回原字符串
        return karmdown;
    }

    // 添加内容块菜单
    private addTextBlockItem({ detail }: any) {
        let menu: Menu = detail.menu;
        let protype: HTMLElement = detail.blockElements[0];
        let blockId = protype.getAttribute('data-node-id');
        menu.addItem({
            icon: "iconInfo",
            label: this.i18n.textBlock,
            click: () => {
                // console.log(detail);
                // console.log(blockId);
                this.handleTextBlock(blockId);
            }
        })
    }

    // 处理内容块菜单点击事件
    private async handleTextBlock(blockId: string) {
        let kramdown = await api.getKramdown(blockId);
        // console.log(kramdown);
        kramdown = kramdown["kramdown"];
        // console.log(kramdown);
        if (kramdown.startsWith("*") || kramdown.startsWith("1.")) {
            api.sendError("不能处理列表，数据会丢失！");
            return;
        } else if (kramdown.startsWith("#")) {
            api.sendMessage("处理标题还没有把空格加回来，请自行按一下空格重新变成标题！");
        }
        kramdown = this.removeWriteSpace(kramdown);
        kramdown = this.removeAttributes(kramdown, ['updated', 'id']);
        kramdown = this.removeEndSimilar(kramdown);
        await api.updateBlock(blockId, kramdown);
    }
}
