[中文](https://github.com/emptylight370/sy-format-helper/blob/main/README_zh_CN.md)

![GitHub Release Date](https://img.shields.io/github/release-date/emptylight370/sy-format-helper?display_date=published_at)
![GitHub Release](https://img.shields.io/github/v/release/emptylight370/sy-format-helper)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/emptylight370/sy-format-helper/latest/total)
![GitHub Repo stars](https://img.shields.io/github/stars/emptylight370/sy-format-helper)

# Format Helper

**Warning**: Because of the duplication of functions, it is recommend to use the plugin "Text Process". This plugin will remove from bazaar in several days. The repository link won't change.

## Functions

- Remove all whitespace in paragraph
- Keep only one blank space in a paragraph
- Add whitespace before and after number and English char(similar with Optimize typography)
- TODO(such as process a document)
- TODO(such as format code block)(I want to do but I may not be able to)

## Notice

> Actions may result in **unexpected changes**. Currently, you can undo the previous operation by using the undo key.
>
> **Warning**❗:
> - Only the listed features are a little more stable, and the features not listed in the documentation do not guarantee data integrity even if they have an entry.
> - Be sure to back up your data, or save your content in a timely manner. Mishandling may lead to data loss, although it can be retracted, please use it with caution.

Because of the duplication of functions, it is recommended to use the plugin "Text Process".

## How to use

Select a block, open the block menu, find the format assistant in the plugin menu, and select the function you want to use.  
Wait a minute to refresh the layout, if your change doesn't loaded, you should refresh the layout manually(F5).

## Processable block

- paragraph
- set format paragraph
- heading
- blockquote
- tag（the whitespace between two tag will be remove, so two tags will combine together, please use any not whitespace char to divide them）
- link
- block reference
- list
- super block

## Update Logs

- v0.3.1
  - Add toUpperCase and toLowerCase functions
  - Remove from bazaar
- v0.3.0
  - Change to plugin API to update block
  - Fix withdraw failure issue
- v0.2.5
  - Fixed an issue where tags were accidentally handled

# Thanks

| Repo | Author | Content | LICENSE |
| --- | --- | --- | --- |
| None | [player](https://ld246.com/member/player) | [Reply](https://ld246.com/article/1734443320794/comment/1734444819260#comments) | None |
| None | [Achuan-2](https://ld246.com/member/Achuan-2) | [Reply](https://ld246.com/article/1734443320794/comment/1734451724612?r=EmptyLight#comments) | None |
| None | [Frostime](https://ld246.com/member/Frostime) | [PLugin Development Quick Start](https://ld246.com/article/1723732790981) | None |
| [SiYuan API](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) | SiYuan Developers | SiYuan API | AGPL3.0 |
| [Transfer refs](https://github.com/frostime/sy-transfer-refs) | [Frostime](https://github.com/frostime) | [The way to contact SiYuan API](https://github.com/frostime/sy-transfer-refs/blob/main/src/api.ts) | MIT |