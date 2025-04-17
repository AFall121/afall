import { link } from "fs";

const nav = [
  // 自定义配置一级导航链接
  { text: "主页", link: "/" },
  {
    text: "笔记",
    items: [
      { text: "vue", link: "/notes/vue/" },
      { text: "react", link: "/notes/react/" },
      { text: "node", link: "/notes/node/" },
      { text: "typescript", link: "/notes/typescript/" },
      { text: "webpack", link: "/notes/webpack/" },
      { text: "git", link: "/notes/git/" },
    ],
  },
  { text: "posts", items: [] },
];

export default nav;
