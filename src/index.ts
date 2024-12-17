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
        // 正则表达式用于匹配 ((...)) 内的 "" 内的文本部分
        const textPattern = /(?<=\(\([^\s"]*\s")([^"]*)(?="\)\))/g;

        // 替换函数，用于去除匹配到的文本中的多余空格
        function replaceSpaces(match: string): string {
            return match.trim().replace(/[ \t\f\v]+/g, '');
        }

        // 提取花括号内的内容
        const attributePattern = /{[^}]*}/g;
        const attributes = kramdown.match(attributePattern) || [];
        kramdown = kramdown.replace(attributePattern, 'PLACEHOLDER');

        // 对所有匹配到的文本部分应用替换函数
        let result = kramdown.replace(textPattern, replaceSpaces);

        // 处理不在 ((...)) 内部的纯文本部分
        // 使用负向前瞻和后瞻断言来确保不匹配标志部分
        const outsidePattern = /(?<!$\()[^"\{\}\($]+(?!\)\))/g;
        result = result.replace(outsidePattern, (match) => {
            // 保留换行符
            return match.split('\n').map(replaceSpaces).join('\n');
        });

        // 将花括号内的内容插回去
        let index = 0;
        result = result.replace(/PLACEHOLDER/g, () => attributes[index++] || '');

        return result;
    }

    // 保留一个空格
    private keepWriteSpace(kramdown: string): string {
        // 正则表达式用于匹配 ((...)) 内的 "" 内的文本部分
        const textPattern = /(?<=\(\([^\s"]*\s")([^"]*)(?="\)\))/g;

        // 替换函数，用于去除匹配到的文本中的多余空格，但是保留一个空格
        function replaceSpaces(match: string): string {
            return match.trim().replace(/[ \t\f\v]+/g, ' ');
        }

        // 提取花括号内的内容
        const attributePattern = /{[^}]*}/g;
        const attributes = kramdown.match(attributePattern) || [];
        kramdown = kramdown.replace(attributePattern, 'PLACEHOLDER');

        // 对所有匹配到的文本部分应用替换函数
        let result = kramdown.replace(textPattern, replaceSpaces);

        // 处理不在 ((...)) 内部的纯文本部分
        // 使用负向前瞻和后瞻断言来确保不匹配标志部分
        const outsidePattern = /(?<!$\()[^"\{\}\($]+(?!\)\))/g;
        result = result.replace(outsidePattern, (match) => {
            // 保留换行符
            return match.split('\n').map(replaceSpaces).join('\n');
        });

        // 将花括号内的内容插回去
        let index = 0;
        result = result.replace(/PLACEHOLDER/g, () => attributes[index++] || '');

        return result;
    }

    // 移除和开头相同的字符
    private removeEndSimilar(kramdown: string) {
        // 如果长度为0直接返回
        if (kramdown.length == 0) {
            return kramdown;
        }
        // 获取第一个字符
        let firstChar = kramdown.charAt(0);
        // 获取最后一个字符
        let lastChar = kramdown.charAt(kramdown.length - 1);
        // 检测字符是否一样
        if (firstChar == lastChar) {
            // 去除最后一个字符
            return kramdown.slice(0, -1);
        }
        // 返回原字符串
        return kramdown;
    }

    // 对结果进行后处理
    private postRecover(kramdown: string) {
        if (kramdown.length == 0) {
            return kramdown;
        }

        let firstChar = kramdown.charAt(0);
        // 检测是否是标题
        if (firstChar == "#") {
            // 在连续的#之后插入一个空格
            kramdown = kramdown.replace(/^(#+)([^\s#])/g, '$1 $2');
        }
        // 检测(())块引用并添加空格
        kramdown = kramdown.replace(/(\(\([^\)]*\)\))(?!\s)/g, '$1 ');
        kramdown = kramdown.replace(/(?!\s)(\(\([^\)]*\)\))/g, ' $1');
        kramdown = kramdown.replace(/".*"\)\)/g, ' $&');

        return kramdown;
    }

    // 添加内容块菜单
    private addTextBlockItem({ detail }: any) {
        let menu: Menu = detail.menu;
        let submenu = [];
        let protype: HTMLElement = detail.blockElements[0];
        let blockId = protype.getAttribute('data-node-id');
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
        let kramdown = await api.getKramdown(blockId);
        // console.log(kramdown);
        kramdown = kramdown["kramdown"];
        // console.log(kramdown);
        // 不能对列表进行操作，返回的结果不能识别为列表
        // 但是单个列表项已经可以了，我先不开放先...
        if (kramdown.startsWith("*") || kramdown.startsWith("1.")) {
            api.sendError(this.i18n.listWarning);
            return;
        }
        // 移除所有空格
        if (type == "remove")
            kramdown = this.removeWriteSpace(kramdown);
        // 保留一个空格
        else if (type == "keep")
            kramdown = this.keepWriteSpace(kramdown);
        // console.log(kramdown);
        // 移除结尾的相同字符，例如引述块
        kramdown = this.removeEndSimilar(kramdown);
        // console.log(kramdown);
        // 后处理结果，例如加回标题的空格，加回块引用后分隔的空格
        kramdown = this.postRecover(kramdown);
        await api.updateBlock(blockId, kramdown);
    }
}
