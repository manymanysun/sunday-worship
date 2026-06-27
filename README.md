# 主日礼拜 HTML

## 打开

启动静态服务器后访问 `index.html`。当前本机预览地址：

`http://127.0.0.1:8770/index.html`

## 结构

- `index.html`：全局翻页与无缝环节切换。
- `service.js`：礼拜环节顺序清单。
- `sections/*.html`：每个礼拜环节一个 HTML。
- `shared/module.css`：共享排版和动画。
- `shared/module.js`：环节内部翻页、Canvas 和总控通信。
- `assets/`：首页及其他图片资源。

## 新增环节

1. 在 `sections/` 新建一个 HTML，可参考 `quiet-peace.html`。
2. 在 `service.js` 按礼拜顺序添加：

```js
{ label: "使徒信经", src: "sections/apostles-creed.html", pages: 3 }
```

`pages` 是该环节的页数，用于计算全礼拜均匀进度。总控会自动预加载新环节，并在前后环节之间交叉淡入。
