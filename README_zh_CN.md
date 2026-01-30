[English](https://github.com/emptylight370/sy-format-helper/blob/main/README.md)

![GitHub Release Date](https://img.shields.io/github/release-date/emptylight370/sy-format-helper?display_date=published_at&link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper/releases/latest)
![GitHub Release](https://img.shields.io/github/v/release/emptylight370/sy-format-helper?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper/releases/latest)
![GitHub issue custom search in repo](https://img.shields.io/github/issues-search/emptylight370/sy-format-helper?query=state%3Aopen%20label%3A%22help%20wanted%22&label=Issues%20need%20helps&labelColor=%23112E32)
![GitHub Repo stars](https://img.shields.io/github/stars/emptylight370/sy-format-helper?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper)

# 格式助手

## 如何安装

### 手动安装

从 [GitHub Releases](https://github.com/emptylight370/sy-format-helper/releases/latest) 中下载最新的 `package.zip` 文件，并且解压到要安装的 `工作空间/data/plugins` 目录下，将解压出的 `package` 文件夹重命名为 `sy-format-helper`，之后在思源的插件面板中启用本插件。

更新时仍然下载最新的 Release 文件，并且替换 `sy-format-helper` 文件夹中的文件（可先清空文件夹），之后重新启用本插件。可通过插件说明文档中的 badge 观察是否存在更新。

### 自动安装

1. 在集市中下载[安装集市包](https://github.com/TCOTC/install-package)插件
2. 点击插件按钮打开安装面板
3. 复制本仓库网址，并粘贴到插件输入框中
4. 点击确定按钮安装

## 功能

- 去除段落中所有的空格
- 将段落中所有的连续空格仅保留一个
- 在数字和英文前后添加空格(类似于优化排版)
- 将英文全部转为大写或小写
- 待开发(比如处理一篇文档之类的)
- 待开发(比如给代码块做格式化)(我想做但是不一定能做)

## 注意

> 操作可能会导致**意外变化**。目前可以通过撤销键来撤销上一步操作。

> [!WARNING]
>
> - 仅有列出的功能比较稳定，文档未列出的功能即使有入口也不能保证数据完整。
> - 一定要做好数据备份，或者及时保存内容。误操作有可能导致数据丢失，尽管可以撤回，但请谨慎使用。

因为功能重复，推荐使用插件“文本处理”。通过下载`package.zip`并解压到工作空间/插件文件夹中启用。

## 使用方法

选中一个块，打开块菜单，在插件菜单中找到格式助手，从中选中要使用的功能。  
等待一分钟以刷新布局，如果您的更改未加载，则应手动刷新布局（F5）。

## 可处理块

- 段落块
- 含样式段落块
- 标题块
- 引述块
- 标签（两个标签中间的空格会被移除，导致两个标签连在一起，请使用非空字符分隔标签）
- 链接
- 块引用
- 列表
- 超级块

## 更新日志

> 完整[更新日志](https://github.com/emptylight370/sy-format-helper/blob/main/changelog.md)
> 完整[提交记录](https://github.com/emptylight370/sy-format-helper/blob/main/whatschange.md)

- v0.4.4
  - 在发布服务中禁用
- v0.4.2
  - 添加了法律法规条目后增加空格功能
- v0.4.1
  - 添加全角字符转半角和半角字符转全角功能

# 感谢

| 仓库                                                                      | 作者                                          | 内容                                                                                         | 许可证  |
| ------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| 无                                                                        | [player](https://ld246.com/member/player)     | [回帖](https://ld246.com/article/1734443320794/comment/1734444819260#comments)               | 无      |
| 无                                                                        | [Achuan-2](https://ld246.com/member/Achuan-2) | [回帖](https://ld246.com/article/1734443320794/comment/1734451724612?r=EmptyLight#comments)  | 无      |
| 无                                                                        | [Frostime](https://ld246.com/member/Frostime) | [插件开发 Quick Start](https://ld246.com/article/1723732790981)                              | 无      |
| [思源API](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) | 思源开发者们                                  | 思源API                                                                                      | AGPL3.0 |
| [转移引用](https://github.com/frostime/sy-transfer-refs)                  | [Frostime](https://github.com/frostime)       | [向思源发送API请求的方式](https://github.com/frostime/sy-transfer-refs/blob/main/src/api.ts) | MIT     |
