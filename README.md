[中文](https://github.com/emptylight370/sy-format-helper/blob/main/README_zh_CN.md)

![GitHub Release Date](https://img.shields.io/github/release-date/emptylight370/sy-format-helper?display_date=published_at&link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper/releases/latest)
![GitHub Release](https://img.shields.io/github/v/release/emptylight370/sy-format-helper?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper/releases/latest)
![GitHub issue custom search in repo](https://img.shields.io/github/issues-search/emptylight370/sy-format-helper?query=state%3Aopen%20label%3A%22help%20wanted%22&label=Issues%20need%20helps&labelColor=%23112E32)
![GitHub Repo stars](https://img.shields.io/github/stars/emptylight370/sy-format-helper?link=https%3A%2F%2Fgithub.com%2Femptylight370%2Fsy-format-helper)

# Format Helper

## How to install

### Manually install

Download latest `package.zip` file from [GitHub Releases](https://github.com/emptylight370/sy-format-helper/releases/latest), and extract to `workspace/data/plugins` directory of the workspace which you want to install the plugin, and rename the `package` folder to `sy-format-helper`, then enable this plugin in SiYuan's plugin panel.

Download the latest Release file when you updating the plugin, and replace the files in the `sy-format-helper` folder(you can clear the folder first), then re-enable this plugin. You can observe whether there is update via the badge in the plguin README docs.

### Auto install

1. Install [Install Marketplace Package](https://github.com/TCOTC/install-package) plugin in bazaar
2. Click the plugin button to open the installation panel
3. Copy the url of this repo, and paste into the plugin's input
4. Click the confirm button to install

## Functions

- Remove all whitespace in paragraph
- Keep only one blank space in a paragraph
- Add whitespace before and after number and English char(similar with Optimize typography)
- All chars toUpperCase and toLowerCase
- TODO(such as process a document)
- TODO(such as format code block)(I want to do but I may not be able to)

## Notice

> Actions may result in **unexpected changes**. Currently, you can undo the previous operation by using the undo key.

> [!WARNING]
>
> - Only the listed features are a little more stable, and the features not listed in the documentation do not guarantee data integrity even if they have an entry.
> - Be sure to back up your data, or save your content in a timely manner. Mishandling may lead to data loss, although it can be retracted, please use it with caution.

Because of the duplication of functions, it is recommended to use the plugin "Text Process". Enable by download `package.zip` to workspace/plugins folder.

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

> Complete [changelog](https://github.com/emptylight370/sy-format-helper/blob/main/changelog.md)
> Complete [commit history](https://github.com/emptylight370/sy-format-helper/blob/main/whatschange.md)

- v0.4.4
  - Disable in Publish mode
- v0.4.2
  - Added functionality to add spaces after legal article entries
- v0.4.1
  - Add full-width characters to half-width and half-width characters to full-width functions

# Thanks

| Repo                                                                         | Author                                        | Content                                                                                            | LICENSE |
| ---------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------- |
| None                                                                         | [player](https://ld246.com/member/player)     | [Reply](https://ld246.com/article/1734443320794/comment/1734444819260#comments)                    | None    |
| None                                                                         | [Achuan-2](https://ld246.com/member/Achuan-2) | [Reply](https://ld246.com/article/1734443320794/comment/1734451724612?r=EmptyLight#comments)       | None    |
| None                                                                         | [Frostime](https://ld246.com/member/Frostime) | [PLugin Development Quick Start](https://ld246.com/article/1723732790981)                          | None    |
| [SiYuan API](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) | SiYuan Developers                             | SiYuan API                                                                                         | AGPL3.0 |
| [Transfer refs](https://github.com/frostime/sy-transfer-refs)                | [Frostime](https://github.com/frostime)       | [The way to contact SiYuan API](https://github.com/frostime/sy-transfer-refs/blob/main/src/api.ts) | MIT     |
