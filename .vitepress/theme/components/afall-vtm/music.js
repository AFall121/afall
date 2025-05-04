import {h, render} from 'vue'
import Player from './Player.vue'

const music = (musicList) =>{
    // 确保仅在浏览器中执行
    if (typeof window === 'undefined') return;
    const container = document.getElementsByTagName('body')[0]
    console.log('container',container);
    const vnode = h(Player, { list: musicList })
    render(vnode, container)
}


export default music
