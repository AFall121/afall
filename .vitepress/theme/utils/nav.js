import { link } from "fs";

const nav = [
  // 自定义配置一级导航链接
  { text: "主页", link: "/" },
  {
    text: "基础",
    items: [
      { text: "vue", link: "/basic/vue/" },
      { text: "react", link: "/basic/react/" },
      { text: "node", link: "/basic/node/" },
      { text: "typescript", link: "/basic/typescript/" },
      { text: "webpack", link: "/basic/webpack/" },
      { text: "git", link: "/basic/git/" },
      { text: "三剑客", link: "/basic/htmlcssjs/" },
    ],
  },
  {
    text: "笔记",
    items: [
      { text: "笔记首页", link: "/notes/" },
      // { text: "简单", link: "/notes/easy/" }
    ],
  },
];

export default nav;
