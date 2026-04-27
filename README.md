# 专属私人点餐系统 🍽️💕 (云端无服务器版)

专为你和她设计的私人点餐系统，完美解决每天“吃什么”的世纪难题！
**目前已升级为“云端方案”，只要配置好，即使你的电脑关机，她也能随时随地在任何网络下打开网页点菜！**

---

## 🌟 方案优势
- **完全免费**：利用 Supabase（数据库） + Vercel（网页托管）的免费额度，无需花一分钱。
- **随时访问**：网页直接部署在公网上，不用担心内网穿透或者电脑关机的问题。
- **实时通知**：利用 Supabase Realtime，当她在手机上下单时，你的管理后台会立刻弹出提醒并播放声音！

---

## 🚀 部署教程 (只需 10 分钟)

### 第一步：注册并配置 Supabase (后端数据库)
1. 访问 [Supabase 官网](https://supabase.com/) 并注册/登录账号。
2. 点击 `New Project` 创建一个新项目，填好名字和密码（密码请务必记住），地区选择离你近的（比如 Singapore 或 Tokyo）。
3. 等待几分钟项目创建完成。
4. 在左侧菜单找到 `SQL Editor` (SQL编辑器)，点击 `New query`。
5. 打开本项目中的 `supabase_setup.sql` 文件，把里面的**所有代码复制**到 SQL Editor 中，然后点击右下角的 `Run` (运行)。
   *(这会一键帮你建好菜品表、订单表、以及存放图片的云盘)*
6. 在左侧菜单找到 `Project Settings` (设置) -> `API`。
   - 找到 **Project URL**，复制保存。
   - 找到 **Project API keys** 中的 **anon** `public` 密钥，复制保存。

### 第二步：在本地运行测试 (可选)
如果你想先在自己的电脑上看看效果：
1. 把本项目目录下的 `.env.example` 文件重命名为 `.env`。
2. 用记事本或代码编辑器打开 `.env`，填入刚才在 Supabase 复制的信息：
   ```env
   VITE_SUPABASE_URL=你的_Project_URL
   VITE_SUPABASE_ANON_KEY=你的_anon_public_密钥
   ```
3. 在终端中运行：
   ```bash
   npm install
   npm run dev
   ```

### 第三步：部署到 Vercel (发布到公网)
要把这个网站变成一个所有人（包括你的女友）都能访问的链接，我们需要用到免费的 Vercel。

1. **将代码上传到 GitHub**：
   在你的 GitHub 账号里新建一个代码仓库（Private 私有即可），把这个文件夹里的所有代码推送上去。
2. **注册 Vercel**：
   访问 [Vercel 官网](https://vercel.com/)，使用你的 GitHub 账号直接登录。
3. **导入项目**：
   - 点击 `Add New...` -> `Project`。
   - 找到你刚才上传的 GitHub 仓库，点击 `Import`。
4. **配置环境变量 (非常重要)**：
   - 在导入页面的 `Environment Variables` 设置中，添加两个变量：
     - Name: `VITE_SUPABASE_URL` | Value: 你的_Project_URL
     - Name: `VITE_SUPABASE_ANON_KEY` | Value: 你的_anon_public_密钥
   - 框架选择保持默认的 `Vite` 即可。
5. **点击 Deploy (部署)**：
   等待大约 1-2 分钟，Vercel 就会为你生成一个公网链接（类似于 `https://your-project.vercel.app`）。

### 第四步：开始使用
1. 把生成的 Vercel 链接发给你的女友，让她在手机浏览器里打开，并选择“添加到主屏幕/桌面”。
2. 你自己也打开这个链接，在网址后面加上 `/admin/login`，比如 `https://xxx.vercel.app/admin/login`。
   - **登录暗号**: `5201314` 或 `admin`
   - 登录后，就可以上传菜品、定价格啦。当她点完菜，只要你开着后台，就会收到叮咚的提醒！

---

## ❓ 常见问题
**Q: 图片上传失败怎么办？**
A: 请确保你在执行 `supabase_setup.sql` 脚本时，没有漏掉任何代码。存储桶（Buckets）必须名为 `images`，且设置了 public 权限。

**Q: 怎么修改登录暗号？**
A: 登录暗号目前写死在前端代码中。用代码编辑器打开 `src/pages/admin/Login.tsx`，找到 `password === '5201314'` 这行代码修改即可，改完后记得重新提交到 GitHub，Vercel 会自动更新。

祝你们用餐愉快！❤️