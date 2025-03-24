[English](https://github.com/emptylight370/sy-format-helper/blob/main/README.md)

![GitHub Release Date](https://img.shields.io/github/release-date/emptylight370/sy-format-helper?display_date=published_at&link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper/releases/latest)
![GitHub Release](https://img.shields.io/github/v/release/emptylight370/sy-format-helper?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper/releases/latest)
![GitHub Downloads (all assets, latest releases)](https://img.shields.io/github/downloads/emptylight370/sy-format-helper/latest/total?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper)
![GitHub Repo stars](https://img.shields.io/github/stars/emptylight370/sy-format-helper?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper)

# 格式助手

## 功能

- 去除段落中所有的空格
- 将段落中所有的连续空格仅保留一个
- 在数字和英文前后添加空格(类似于优化排版)
- 将英文全部转为大写或小写
- 待开发(比如处理一篇文档之类的)
- 待开发(比如给代码块做格式化)(我想做但是不一定能做)

## 注意

> 操作可能会导致**意外变化**。目前可以通过撤销键来撤销上一步操作。
> 
> **警告**❗：
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

- v0.4.0
  - 实现智能去除空格功能
  - 可以同时对多个块进行操作
- v0.3.1
  - 添加全大写和全小写功能
  - 从集市下架
- v0.3.0
  - 换用插件API更新块
  - 修复撤回失效问题

# 感谢

| 仓库 | 作者 | 内容 | 许可证 |
| --- | --- | --- | --- |
| 无 | [player](https://ld246.com/member/player) | [回帖](https://ld246.com/article/1734443320794/comment/1734444819260#comments) | 无 |
| 无 | [Achuan-2](https://ld246.com/member/Achuan-2) | [回帖](https://ld246.com/article/1734443320794/comment/1734451724612?r=EmptyLight#comments) | 无 |
| 无 | [Frostime](https://ld246.com/member/Frostime) | [插件开发 Quick Start](https://ld246.com/article/1723732790981) | 无 |
| [思源API](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) | 思源开发者们 | 思源API | AGPL3.0 |
| [转移引用](https://github.com/frostime/sy-transfer-refs) | [Frostime](https://github.com/frostime) | [向思源发送API请求的方式](https://github.com/frostime/sy-transfer-refs/blob/main/src/api.ts) | MIT |