[English](https://github.com/emptylight370/sy-format-helper/blob/main/README.md)

# 格式助手

## 功能

- 去除段落中所有的空格
- 将段落中所有的连续空格仅保留一个
- 在数字和英文前后添加空格(类似于优化排版)
- 待开发(比如处理一篇文档之类的)
- 待开发(比如给代码块做格式化)(我想做但是不一定能做)

## 注意

> 操作可能会导致意外变化。目前可以通过撤销键来撤销上一步操作。
> 
> 警告❗：仅有列出的功能比较稳定，文档未列出的功能即使有入口也不能保证数据完整。

## 可处理块

- 段落块
- 含样式段落块
- 标题块
- 引述块
- 标签（不会影响标签）
- 链接
- 块引用
- 列表
- 超级块

## 更新日志

- v0.2.1
  - 添加不同的选中块类型判断
  - 添加增加空格的方法
- v0.2.0
  - 成功将操作改写成dom形式
- v0.1.1
  - 处理空格方式优化
  - 支持保留部分特殊格式
  - 支持保留一个空格

# 感谢

| 仓库 | 作者 | 内容 | 许可证 |
| --- | --- | --- | --- |
| 无 | [player](https://ld246.com/member/player) | [回帖](https://ld246.com/article/1734443320794/comment/1734444819260#comments) | 无 |
| 无 | [Achuan-2](https://ld246.com/member/Achuan-2) | [回帖](https://ld246.com/article/1734443320794/comment/1734451724612?r=EmptyLight#comments) | 无 |
| 无 | [Frostime](https://ld246.com/member/Frostime) | [插件开发 Quick Start](https://ld246.com/article/1723732790981) | 无 |
| [思源API](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) | 思源开发者们 | 思源API | AGPL3.0 |
| [转移引用](https://github.com/frostime/sy-transfer-refs) | [Frostime](https://github.com/frostime) | [向思源发送API请求的方式](https://github.com/frostime/sy-transfer-refs/blob/main/src/api.ts) | MIT |