import { defineConfig } from "vitepress";
import nav from "./theme/utils/nav";
// import sidebar from './theme/utils/sidebar'
import { barForGroup } from './theme/utils/sidebar'



console.log(nav);
// https://vitepress.dev/reference/site-config
export default defineConfig(
{
  base: '/notes/',
  title: "AFall Leaves",
  description: "个人笔记",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: "/logo-light.svg",
      dark: "/logo-dark.svg",
      alt: "site logo",
    },
    nav,
    // sidebar,
    sidebar: {...barForGroup},
    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    // ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
