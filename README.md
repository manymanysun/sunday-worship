# 主日礼拜 · Sunday Worship

全屏沉浸式主日礼拜投屏演示系统。适用于教会主日崇拜，支持歌词展示、祷告文、信经、证道、报告事项等全流程环节的自动翻页与无缝切换。

## 效果预览

启动本地服务器后访问：

```
http://127.0.0.1:8770/index.html
```

## 操作方式

| 操作 | 说明 |
|------|------|
| 鼠标点击左侧 / 右侧 | 上一页 / 下一页 |
| `←` `PageUp` | 上一页 |
| `→` `PageDown` `Space` | 下一页 |
| `Home` | 跳到第一页 |
| `End` | 跳到最后一页 |
| 点击底部进度条 | 跳转到任意页 |

## 项目结构

```
sunday-worship/
├── index.html              # 主控页面（翻页壳、进度条、环节切换）
├── service.js              # 礼拜环节顺序清单
├── shared/
│   ├── module.css          # 共享排版样式、主题、动画
│   └── module.js           # 环节内部翻页引擎、Canvas 粒子特效、与主控通信
├── sections/               # 每个礼拜环节一个 HTML
│   ├── cover.html          # 首页封面
│   ├── quiet-peace.html    # 安静诗歌
│   ├── call-to-worship.html# 宣召
│   ├── broken-jar.html     # 正式诗歌 1
│   ├── olive.html          # 正式诗歌 2
│   ├── christ-in-me.html   # 正式诗歌 3
│   ├── true-worshipper.html# 正式诗歌 4
│   ├── apostles-creed.html # 使徒信经
│   ├── sermon-abundant-life.html # 证道
│   ├── abide-in-you.html   # 回应诗歌
│   ├── intercessory-prayer.html  # 公祷
│   ├── lords-prayer.html   # 主祷文
│   ├── offering.html       # 奉献
│   ├── announcements.html  # 报告事项
│   ├── welcome-friends.html# 欢迎新朋友
│   ├── benediction-prayer.html   # 祝福祷告
│   └── chosen-to-receive-love.html # 欢迎诗歌
├── assets/                 # 封面及通用图片资源
├── photo/                  # 现场照片（已 gitignore）
└── .gitignore
```

## 技术架构

### 主控层 (`index.html`)

- 全屏暗色背景，两个 iframe 槽位交替使用
- 环节切换时通过双 iframe 交叉淡入实现无缝过渡
- 底部状态栏显示：当前环节名 · 局部页码 · 全程页码 · 可点击进度条
- 键盘 + 鼠标 + 触摸事件统一处理

### 环节层 (`sections/*.html`)

每个环节是独立的 HTML 页面，通过 `shared/module.js` 暴露的 `WorshipModule.mount()` 初始化：

```js
WorshipModule.mount({
  title: "诗歌标题",
  sectionLabel: "安静诗歌",
  theme: "water",           // 视觉主题
  visual: "water",          // Canvas 特效类型
  accent: "#a9d6db",        // 主色调
  particle: "#cde8e6",      // 粒子颜色
  slides: [
    { title: "副歌", lines: ["歌词行1", "歌词行2"], visual: "water" },
    // ...
  ]
});
```

### 通信协议

环节 iframe 与主控通过 `postMessage` 通信：

| 消息类型 | 方向 | 说明 |
|---------|------|------|
| `worship:ready` | iframe → 主控 | 环节加载完成，携带当前页码和总页数 |
| `worship:state` | iframe → 主控 | 页码变化，更新进度条 |
| `worship:boundary` | iframe → 主控 | 翻到首/末页时通知主控切换环节 |
| `worship:navigate` | 主控 → iframe | 主控发送翻页指令（±1） |
| `worship:go` | 主控 → iframe | 主控发送跳转到指定页 |

### 视觉主题

`module.css` 内置多套主题，通过 `data-theme` 属性切换：

- `water` — 水波纹，适合平安/安息类诗歌
- `scripture` — 经卷质感，适合读经/宣召
- `alabaster` — 香膏暖色，适合奉献/敬拜
- `heaven` — 天堂意象，适合祝福/盼望
- 默认 — 深色星空，通用场景

### Canvas 特效

`module.js` 内置多种粒子/动画特效，通过 `visual` 字段选择：

`water` · `book` · `jar` · `heaven` · `heart-cross` · `night-lamp` · `shepherd` · `tomb` · `chains` · `home` · `praise` · `altar-search` · `kneeling-worship` · `eagle` · `vine-life` · `praying-hands` · `prayer-canvas` · `notice-board` · `welcome-friends` · `blessing-light`

## 新增环节

1. 在 `sections/` 下新建 HTML 文件，参考已有环节的结构：

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../shared/module.css">
  <title>环节标题</title>
</head>
<body>
  <div id="worship-module"></div>
  <script src="../shared/module.js"></script>
  <script>
    WorshipModule.mount({
      title: "环节标题",
      sectionLabel: "显示名称",
      theme: "scripture",
      slides: [
        { title: "页标题", lines: ["内容行1", "内容行2"] }
      ]
    });
  </script>
</body>
</html>
```

2. 在 `service.js` 中按礼拜顺序添加条目：

```js
{ label: "环节名称", src: "sections/your-file.html", pages: 页数 }
```

`pages` 必须与实际 slides 数量一致，用于全程进度计算。

## 本地运行

任意静态文件服务器均可，例如：

```bash
# Python
python -m http.server 8770

# Node.js
npx serve -l 8770

# PHP
php -S 127.0.0.1:8770
```

然后访问 `http://127.0.0.1:8770`。

## 浏览器兼容

- Chrome / Edge 90+
- Safari 15+
- Firefox 90+
- 移动端浏览器（推荐横屏投屏使用）
