import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import MyLayout from "./components/MyLayout.vue";
import music from "./components/afall-vtm/music";
import "./style.css";
import { h } from "vue";

// 歌曲大部分来自www.gequbao.com,可惜呀部署到surge上后，访问不了。。。
const playlist = [
  {
    name: "急救室-豪杰春香",
    author: "Izi",
    file: "/mp3/急救室.mp3",
  },
  {
    name: "夜曲",
    author: "周杰伦",
    file: "/mp3/夜曲.mp3",
    // file: "https://a.xmcdn.com/storages/0889-audiofreehighqps/DE/22/GKwRIasLeRakABUfdwNgkAU3.m4a?sign=e2093e81e291436a404fd6998bbc882c&buy_key=www2_a8cb4a20-67507954:0&timestamp=1746004044546000&token=3788&duration=226",
  },
  {
    name: "飘雪",
    author: "韩雪",
    file: "/mp3/飘雪.mp3",
    // file: "https://nf-sycdn.kuwo.cn/8bce4a62c6c67a636de22957c4f1d6ee/6811ff3d/resource/n1/18/36/806287869.mp3?bitrate$128&from=vip",
  },
  {
    name: "雪の華",
    author: "中島美嘉",
    file: "/mp3/雪の華.mp3",
    // file: "https://er-sycdn.kuwo.cn/fbe48476a5e9d5ab6aafa19ac4c46705/6811f84c/resource/30106/trackmedia/M500001UboWR2c1rxw.mp3?bitrate$128&from=vip",
  },
  {
    name: "눈의 꽃",
    author: "朴孝信",
    file: "/mp3/눈의 꽃.mp3",
    // file: "https://lv-sycdn.kuwo.cn/1f9b177fdd620de1ab97fc9c7b3eb65b/6811fdd9/resource/30106/trackmedia/M500003x8Q1c3xYSPi.mp3?bitrate$128&from=vip",
  },
  {
    name: "Shape Of My Heart",
    author: "外国歌手",
    file: "/mp3/Shape Of My Heart.mp3",
    // file: "https://a.xmcdn.com/group2/M02/2C/A7/wKgDr1HdXRqAOX2GAEP5jHTqeYA515.mp3?sign=ae3f7301cb989c8e4479898a4286c580&buy_key=www2_32694bde-67498752:0&timestamp=1746003529021000&token=1001&duration=278",
  },
  {
    name: "希望你幸福",
    author: "林享柱",
    file: "/mp3/希望你幸福.mp3",
    // file: "https://er-sycdn.kuwo.cn/bd36666c78cc155399e63b5ddaed5346/6811efb1/resource/30106/trackmedia/M500003PJyXt2CMVd9.mp3?bitrate$128&from=vip",
  },
];

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(MyLayout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    music(playlist);
  },
} satisfies Theme;
