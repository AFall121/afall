<script setup lang="ts">
import { on } from "events";
import { random } from "mermaid/dist/utils.js";
import { buffer } from "stream/consumers";
import { PropType, ref, onMounted, onUnmounted, reactive } from "vue";

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
    playmode(mode.value);
  }
};

// 组件挂载时初始化播放列表
onMounted(() => {
  if (props.list.length > 0) {
    musicurl.value = props.list[0].file || undefined;
    curId.value = props.list[0].name || "";
    if (audioRef.value) {
      audioRef.value.loop = true;
    }
  }
});

// 定义 Ref 类型

const canvas = ref<HTMLCanvasElement | null>(null);

let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;
let bufferLength = 0;
let dataArray: Uint8Array | null = null;
let animationId: number | null = null;
let dataIntervalId: NodeJS.Timeout;
let intervalId: NodeJS.Timeout;
let loopCount = ref(0);
let colorPool: CanvasGradient[] = [];
// let colorPool: string[] = [];

onMounted(() => {
  // 初始化音频上下文
  audioContext = new (window.AudioContext ||
    (window as { [key: string]: any })["webkitAudioContext"])();
  const dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    // canvas.value!.width = Math.floor(window.innerWidth * dpr);
    canvas.value!.width = document.documentElement.clientWidth;
    canvas.value!.height = Math.floor(100 * dpr);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  const audio = audioRef.value;
  const ctx = canvas.value!.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr); // 缩放上下文以保持坐标一致
  }
  if (!audio || !ctx) return;

  // 创建分析器
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // 创建媒体源并连接
  source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // 颜色太多，太淡了。。。
  // function randomColor() {
  //   const gradient = ctx!.createLinearGradient(0, 0, 0, canvas.value!.height);
  //   const r = Math.floor(Math.random() * 226 + 30);
  //   const g = Math.floor(Math.random() * 100 + 156);
  //   const b = Math.floor(Math.random() * 80 + 176);

  //   gradient.addColorStop(.2, "#fff");
  //   gradient.addColorStop(1, `rgb(${r},${g},${b})`);

  //   return gradient;
  // }

  const observer = new MutationObserver(() => {
    colorPoolUpdate();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  function randomColor() {
    const gradient = ctx!.createLinearGradient(0, 0, 0, canvas.value!.height);

    // const num = Math.floor(Math.random() * 3);
    const isDark = document.documentElement.classList.contains("dark");
    let colors: string[] = [];
    if (isDark) {
      colors = ["#f00404", "#8e8ff9", "#f5f2ed", "pink", "#1296db"];
    } else {
      //  colors = ["#f00404", "#8e8ff9", "lime", "pink", "#1296db"];
      //  colors = ["#00d0d0", "#40ffb0", "#f00404", "#b0ffd0"];
      colors = [
        "pink",
        "#f00",
        "#00d0d0",
        "#b0ffd0",
        "rgba(0,0,0,.8)",
        "#8e8ff9",
        "#a030ff",
      ];
    }
    const num = Math.floor(Math.random() * colors.length);
    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(0.3, colors[num]);
    gradient.addColorStop(1, colors[num]);
    return gradient;
  }
  // 每隔一段时间更新颜色池
  function colorPoolUpdate() {
    loopCount.value = bufferLength / 10;
    for (let i = 0; i < loopCount.value; i++) {
      colorPool[i] = randomColor();
    }
  }
  colorPoolUpdate();
  dataIntervalId = setInterval(() => {
    clearInterval(dataIntervalId);
    colorPoolUpdate();
  }, 10000);
  // 频谱绘制函数
  function draw() {
    const width = canvas.value!.width;
    const height = canvas.value!.height;
    let intervalTime = 200; // 绘制时间间隔为2000ms
    let x = 0;
    let gap = 13;
    const barWidth = width / loopCount.value - gap; // (width / loopCount.value)为bar基础宽度
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    console.log("draw");
    // 绘制一次
    analyser?.getByteFrequencyData(dataArray!);
    intervalId = setInterval(() => {
      animationId = requestAnimationFrame(draw);
      clearInterval(intervalId);
      ctx!.clearRect(0, 0, width, height);
      // ctx!.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx!.fillStyle = "transparent";
      ctx!.fillRect(0, 0, width, height);

      for (let i = 0; i < loopCount.value; i++) {
        ctx!.fillStyle = colorPool[i];
        const barHeight = dataArray![i];

        ctx!.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
        // // ctx?.beginPath();
        // ctx?.roundRect(x, height - barHeight / 2, barWidth, barHeight / 2, 10);
        // ctx?.closePath();
        // ctx!.fill();
        x += barWidth + gap;
      }
    }, intervalTime);
  }

  // 开始绘制
  audio.addEventListener("play", () => {
    if (!animationId) {
      draw();
    }
  });

  // 恢复音频上下文（应对浏览器自动暂停）
  document.addEventListener("click", () => {
    if (audioContext!.state === "suspended") {
      void audioContext!.resume();
    }
  });
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (dataIntervalId) {
    clearInterval(dataIntervalId);
  }
  if (intervalId) {
    clearInterval(intervalId);
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
      <span
        style="font-size: 12px; color: #fff"
        v-show="isFocus"
        @click="toggleMode"
      >
        {{ mode.slice(0, 1).toUpperCase() }}
      </span>
    </div>
    <ul class="list">
      <audio ref="audioRef" @ended="playNext">
        <source :src="musicurl" type="audio/mp3" />
      </audio>
      <li
        class="single"
        :class="{ active: single.name === curId }"
        v-for="(single, index) of list"
        @click="playSingle(single.file, single.name)"
      >
        <span>{{ index + 1 }}.{{ single?.name }}</span
        ><span>{{ single?.author }}</span>
      </li>
    </ul>
    <canvas ref="canvas" width="600" height="200"></canvas>
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
  background-color: rgba(200, 200, 200, 0.2);
  transition: 1s visibility ease-out;
}
.vt-player > .list:hover {
  visibility: visible;
}
.dark .vt-player > .list {
  background-color: #000;
}
.single {
  display: inline-flex;
  justify-content: space-between;
  width: 300px;
  padding: 0.5rem 1.2rem 0;
}
.single:hover,
.active {
  background-color: #8f8ff9;
}

.dark .single:hover,
.dark .active {
  background-color: rgba(143, 143, 249, 0.8);
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
  position: relative;
  gap: 0px;
  justify-content: space-around;
  padding: 5px 10px;
  background-color: #000;
  /* border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px; */
  border-radius: 50%;
  transition: gap 1s ease, border-radius 1s ease-out;
  z-index: 999;
}
.dark .m-ctr {
  background: #f10404;
}

.m-ctr:hover {
  border-radius: 2px;
}

.m-ctr:hover + .list {
  visibility: visible;
}

.m-ctr.gap {
  gap: 5px;
}

canvas {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 666;
  pointer-events: none;
}
</style>
