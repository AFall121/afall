import {h, render} from 'vue'
import Player from './Player.vue'

const music = (musicList) =>{
    const container = document.getElementsByTagName('body')[0]
    console.log('container',container);
    const vnode = h(Player, { list: musicList })
    render(vnode, container)
}


export default music
