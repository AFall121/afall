# Vue 中必须操作 DOM 的场景：原生 DOM 操作完全指南

在 Vue 开发中，我们核心遵循**数据驱动视图**的理念，通过数据、指令、响应式状态管理页面渲染，但在很多实际业务场景中，Vue 并没有提供对应的指令、语法或响应式绑定，**必须直接操作原生 DOM 元素**才能实现需求。

本文整理了 Vue 开发中**最常用、必须操作 DOM** 的四大类场景，包含原理说明、实现方式和代码示例，帮你彻底理清数据驱动和 DOM 操作的边界。

## 一、输入框主动聚焦/失焦

### 核心原理

聚焦/失焦是**DOM 元素原生方法**，不属于样式、内容或响应式状态，Vue 没有 `:focus="xxx"` 这类主动调用的语法，**数据只能控制默认聚焦，无法手动触发聚焦**。
必须获取到输入框 DOM 元素，调用原生 `focus()`/`blur()` 方法。

### 实现代码（Vue 3 + setup 语法糖）

```vue
<template>
  <!-- 通过 ref 标记 DOM 元素 -->
  <input ref="inputRef" type="text" placeholder="点击按钮聚焦我" />
  <button @click="handleFocus">主动聚焦</button>
  <button @click="handleBlur">主动失焦</button>
</template>

<script setup>
import { ref } from "vue";

// 定义 ref 绑定 DOM
const inputRef = ref(null);

// 主动聚焦
const handleFocus = () => {
  // 确保 DOM 已渲染
  if (inputRef.value) {
    inputRef.value.focus(); // 原生聚焦方法
  }
};

// 主动失焦
const handleBlur = () => {
  if (inputRef.value) {
    inputRef.value.blur(); // 原生失焦方法
  }
};
</script>
```

## 二、页面滚动/定位（滚动到底部、指定位置）

### 核心原理

滚动距离、滚动位置、滚动动画都是**DOM 原生属性/方法**，Vue 没有「滚动位置」的响应式绑定，数据无法控制浏览器滚动行为。
常用原生 API：

- 属性：`scrollTop`/`scrollLeft`（获取/设置滚动距离）
- 方法：`scrollTo()`/`scrollIntoView()`（滚动到指定位置/元素）

### 典型场景：聊天框自动滚动到底部

```vue
<template>
  <!-- 滚动容器 -->
  <div class="chat-box" ref="chatRef" style="height: 300px; overflow-y: auto;">
    <div v-for="item in chatList" :key="item.id" class="chat-item">
      {{ item.content }}
    </div>
  </div>
  <button @click="sendMsg">发送消息并滚动到底部</button>
</template>

<script setup>
import { ref } from "vue";

const chatRef = ref(null);
const chatList = ref([{ id: 1, content: "你好呀" }]);

// 发送消息 + 自动滚动到底部
const sendMsg = () => {
  chatList.value.push({ id: Date.now(), content: "新消息" });

  // DOM 更新后执行滚动
  nextTick(() => {
    if (chatRef.value) {
      // 方式1：scrollTop 滚动到底部
      chatRef.value.scrollTop = chatRef.value.scrollHeight;

      // 方式2：scrollTo 带动画滚动
      // chatRef.value.scrollTo({
      //   top: chatRef.value.scrollHeight,
      //   behavior: 'smooth' // 平滑滚动
      // })
    }
  });
};
</script>
```

### 场景扩展：列表定位到指定项

```js
// 滚动到指定元素
const scrollToItem = (itemRef) => {
  itemRef.value.scrollIntoView({
    behavior: "smooth",
    block: "center", // 元素居中显示
  });
};
```

## 三、Canvas 画布绘图

### 核心原理

Canvas 是**纯原生 DOM 绘图工具**，Vue 仅能渲染 `<canvas>` 标签，所有绘图逻辑（画线、画图、清除画布、像素操作）都必须通过原生 DOM API 实现，**数据驱动完全无法替代**。

### 实现代码：基础 Canvas 绘图

```vue
<template>
  <canvas ref="canvasRef" width="400" height="200"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue";

const canvasRef = ref(null);

// 组件挂载后操作 Canvas
onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // 1. 获取原生绘图上下文（核心 DOM 操作）
  const ctx = canvas.getContext("2d");

  // 2. 原生绘图：画矩形
  ctx.fillStyle = "#42b983";
  ctx.fillRect(50, 50, 100, 80);

  // 3. 原生绘图：画文字
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("Vue + Canvas", 60, 100);
});
</script>
```

## 四、同类必须操作 DOM 的补充场景

除了上述三大核心场景，Vue 开发中还有大量高频场景，**必须依赖原生 DOM API 实现**，整理如下：

### 1. 视频/音频控制

播放器的播放、暂停、进度控制都是原生方法，Vue 无法通过数据直接控制：

```js
// 获取视频 DOM
const videoRef = ref(null);

// 播放
videoRef.value.play();
// 暂停
videoRef.value.pause();
// 设置播放进度
videoRef.value.currentTime = 10; // 跳转到第10秒
```

### 2. 复制/剪切板操作

需要通过原生选中、`execCommand` 或现代 Clipboard API 实现，无 Vue 对应指令：

```js
// 复制文本到剪切板
const copyText = (text) => {
  navigator.clipboard.writeText(text);
};
```

### 3. 获取元素真实尺寸/位置

获取元素在页面中的真实宽高、偏移量，必须用原生 DOM 属性：

```js
const domRef = ref(null);

// 获取宽高/位置
const { offsetTop, offsetLeft, clientWidth, clientHeight } = domRef.value;
```

### 4. 复杂交互事件

复杂拖拽、鼠标坐标、原生右键菜单等交互，依赖原生 DOM 事件：

```js
// 监听鼠标坐标
document.addEventListener("mousemove", (e) => {
  console.log(e.clientX, e.clientY);
});
```

### 5. 第三方库初始化

ECharts、富文本编辑器、地图组件等第三方库，**必须传入 DOM 容器**才能初始化：

```js
import * as echarts from "echarts";

const chartRef = ref(null);
onMounted(() => {
  // 初始化 ECharts：必须传 DOM 元素
  const myChart = echarts.init(chartRef.value);
  myChart.setOption({
    /* 配置项 */
  });
});
```

## 总结：Vue 中 DOM 操作的核心规则

1. **数据驱动的边界**：Vue 仅负责**渲染 DOM 结构、绑定数据/样式/事件**，原生行为（聚焦、滚动、绘图、媒体控制）无法通过数据/指令实现；
2. **DOM 操作的前提**：必须在 DOM 渲染完成后操作（`onMounted`/`nextTick`），避免获取不到 DOM 元素；
3. **统一获取方式**：通过 `ref` 标记 DOM 元素，是 Vue 中操作 DOM 的标准方式。

遇到以上场景时，直接使用原生 DOM API 即可，无需强行依赖 Vue 的响应式或指令，这是符合 Vue 设计理念的最佳实践。
