# Nightcord

基于 Cinny v4.12.7，页面名称为 **Nightcord**，当前版本为 **4.12.7-nightcord**。

主题参考同目录中的 Mastodon Nightcord 样式：共用壁纸和标志、紫色强调色、磨砂面板、6/10/14px 圆角、系统及 CJK 字体。深浅主题跟随系统，也可在设置中选择。

## 本地开发

使用 package.json 指定版本的 pnpm：

```sh
pnpm install --frozen-lockfile
pnpm start
```

生产构建与预览：

```sh
pnpm build
pnpm preview
```

主题位于 `src/nightcord/theme.css.ts`，显示名称和版本入口位于 `src/nightcord/brand.ts`。壁纸及应用图标位于 `public/res/nightcord/`，SVG 标志位于 `public/res/svg/nightcord*.svg`。

以后运行 `pnpm bump 4.13.0` 会自动生成 `4.13.0-nightcord`，所有页面版本显示均读取 package.json。

保留上游 AGPL 许可证和贡献者信息。

## SEKAI 日语贴纸

内置 Sekai Viewer 的全部 1,205 张日语贴纸，按角色分组；其他地区版本未收录。打开消息框旁的贴纸按钮，`SEKAI` 标签显示内置世界计划贴纸，`User Stickers` 标签显示用户、房间及空间的贴纸，`Emoji` 标签显示表情。各标签单独搜索，SEKAI 可搜索日语名称。内置贴纸发送时上传到当前 Matrix 服务器，发送标准 `m.sticker` 消息，因此接收者无需安装本客户端。重复发送会复用当前会话中已经上传的图片。

图片位于 `public/stickers/sekai/`，目录位于 `src/nightcord/sekai-stickers.json`，只有打开贴纸列表时才加载目录。重新同步日语资源：

```sh
node scripts/sync-sekai-stickers.mjs
```

资源来源为 https://sekai.best/stamp，原始图片版权归 Project SEKAI、SEGA、Colorful Palette 及相关权利方，未重新授权为 AGPL。

页面的源码链接指向 https://github.com/hanakokoizumi/cinny。

## 自动部署

默认 Matrix 服务器为 `nightcord.de`，可在 `config.json` 中修改。GitHub Pages 使用 Hash Router，支持刷新和 SSO 登录回跳。

推送至 `main` 后，GitHub Actions 使用 pnpm 锁定依赖、构建并部署至 https://chat.nightcord.de。拉取请求只构建，不发布；也可手动运行 `Deploy Nightcord to GitHub Pages`。Pages 发布源应设为 GitHub Actions，自定义域名设为 `chat.nightcord.de` 并开启 HTTPS。
