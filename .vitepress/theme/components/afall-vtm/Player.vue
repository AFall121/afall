<script setup lang="ts">
import { PropType } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";

// 定义列表项的接口
interface listItem {
  name?: string;
  author?: string;
  file?: string;
}

// 定义组件属性
const props = defineProps({
  list: {
    type: Array as PropType<listItem[]>,
    default: () => [],
  },
});

// 控制是否显示完整控制器
let isFocus = ref(false);
// 音频播放器引用
const audioRef = ref<HTMLAudioElement | null>(null);
// 控制播放状态
let ifpaused = ref(true);
// 当前播放音乐的URL
let musicurl = ref<string | undefined>(undefined);
// 当前播放音乐的ID
let curId = ref("");
// 播放模式
const modes = ["loop", "random", "single"];
let mode = ref("loop");

// 随机播放
const playRandom = () => {
  ifpaused.value = false;
  if (!audioRef.value) return;
  let randomNum = Math.floor(Math.random() * props.list.length);
  audioRef.value.loop = false;
  musicurl.value = props.list[randomNum].file || "";
  curId.value = props.list[randomNum].name || "";
  audioRef.value.load();
  playorpause();
};

// 根据模式播放
const playmode = (mode) => {
  if (!audioRef.value) return;
  switch (mode) {
    case "loop": // 单曲循环
      audioRef.value.loop = true;
      break;
    case "random": // 随机播放
      audioRef.value.loop = false;
      playRandom();
      break;
    case "sequence": // 顺序播放
      audioRef.value.loop = false;
      break;
  }
};

// 播放下一首
const playNext = () => {
  if (mode.value === "random") {
    playRandom();
  } else {
    let index = props.list.findIndex((item) => item.name === curId.value) || 0;
    if (index === props.list.length - 1) {
      curId.value = props.list[0].name || "";
      musicurl.value = props.list[0].file || "";
    } else {
      let nextIndex = index + 1;
      curId.value = props.list[nextIndex].name || "";
      musicurl.value = props.list[nextIndex].file || "";
    }
    audioRef.value?.load();
    playorpause();
  }
};

// 播放上一首
const playPrev = () => {
  let index = props.list.findIndex((item) => item.name === curId.value) || 0;
  if (index === 0) {
    let prevIndex = props.list.length - 1;
    curId.value = props.list[prevIndex]?.name || "";
    musicurl.value = props.list[prevIndex]?.file || "";
  } else {
    let prevIndex = index - 1;
    curId.value = props.list[prevIndex]?.name || "";
    musicurl.value = props.list[prevIndex]?.file || "";
  }
  audioRef.value?.load();
  playorpause();
};

// 切换播放模式
const toggleMode = () => {
  let idx = modes.findIndex((item) => mode.value === item);
  if (idx !== modes.length - 1) {
    mode.value = modes[idx + 1];
    playmode(mode.value);
  } else {
    mode.value = modes[0];
  }
};

// 组件挂载时初始化播放列表
onMounted(() => {
  if (props.list.length > 0) {
    musicurl.value = props.list[0].file || undefined;
    curId.value = props.list[0].name || "";
  }
});

// 播放或暂停
const playorpause = () => {
  if (!audioRef.value) return;
  if (audioRef.value.paused) {
    audioRef.value.play();
    ifpaused.value = false;
  } else {
    audioRef.value.pause();
    ifpaused.value = true;
  }
};

// 播放指定歌曲
const playSingle = (url, id) => {
  if (!audioRef.value) return;
  musicurl.value = url;
  if (id != curId.value) {
    ifpaused.value = !ifpaused.value;
    curId.value = id;
    audioRef.value.load(); // 只有curid 改变时才load，否则会有问题
    audioRef.value.currentTime = 0;
    ifpaused.value = false;
  }
  playorpause();
};
</script>

<template>
  <div class="vt-player">
    <div
      class="m-ctr"
      :class="{ gap: isFocus }"
      @mouseover="isFocus = true"
      @mouseleave="isFocus = false"
    >
      <span class="changpian">
        <i
          class="iconfont icon-play"
          v-show="ifpaused"
          @click="playorpause"
        ></i>
        <i
          class="iconfont icon-pause"
          v-show="!ifpaused"
          @click="playorpause"
        ></i>
      </span>
      <span class="prev" v-show="isFocus" @click="playPrev">
        <i class="iconfont icon-previous"></i>
      </span>
      <span class="next" v-show="isFocus" @click="playNext">
        <i class="iconfont icon-next"></i>
      </span>
      <span style="font-size: 12px" v-show="isFocus" @click="toggleMode">
        {{ mode.slice(0, 1).toUpperCase() }}
      </span>
    </div>
    <ul class="list">
      <audio ref="audioRef" @ended="playNext">
        <source :src="musicurl" type="audio/mp3" />
      </audio>
      <li
        class="single"
        v-for="(single, index) of list"
        @click="playSingle(single.file, single.name)"
      >
        <span>{{ index + 1 }}.{{ single?.name }}</span
        ><span>{{ single?.author }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@import "./iconfont.css";
.vt-player {
  position: fixed;
  bottom: 15%;
  right: 0;
  z-index: 999;
}
.vt-player > .list {
  visibility: hidden;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 5px;
  overflow: hidden;
  transform: translateY(-100%);
  background-color: #8f8ff9;
  transition: 1s visibility ease-out;
}
.vt-player > .list:hover {
  visibility: visible;
}
.dark .vt-player > .list {
  background-color: rgba(143, 143, 249,.1);
}
.single {
  display: inline-flex;
  justify-content: space-between;
  width: 300px;
  padding: 0.5rem 1.2rem 0;
}
.single:hover {
  background-color: #fff;
}

.dark .single:hover {
  background-color: #000;
}
.iconfont {
  color: #11d83c;
}

.dark .iconfont {
  color: #000;
}
.iconfont:hover {
  color: #fff;
}
.m-ctr {
  display: inline-flex;
  gap: 0px;
  justify-content: space-around;
  padding: 5px 10px;
  background-color: #8f8ff9;
  /* border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px; */
  border-radius: 50%;
  transition: gap 1s ease,border-radius 1s ease-out;
}
.dark .m-ctr {
  background: #f10404;
}

.m-ctr:hover {
  border-radius: 2px;
}

.m-ctr:hover + .list{
  visibility: visible;
}

.m-ctr.gap {
  gap: 5px;
}
</style>