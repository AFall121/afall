# Snabbdom 源码深度解析

## 前言

Snabbdom 是一款**极简、高性能、可扩展**的虚拟 DOM 库，核心代码仅数百行，是 Vue 虚拟 DOM 实现的核心参考原型。它专注于**虚拟 DOM 定义、Diff 算法、DOM 更新**三大核心，摒弃冗余逻辑，极致轻量化。

本文将**逐模块、逐函数、逐行**解析 Snabbdom 源码，覆盖核心概念、执行流程、Diff 算法细节，帮助你彻底理解虚拟 DOM 的底层原理。

> 基于 Snabbdom 最新稳定版（v3.6.2）源码解析

## 目录

1. 核心架构与文件结构
2. 入口文件：`snabbdom.ts`
3. 虚拟 DOM 定义：`vnode.ts`
4. 核心函数：`h()` 函数
5. DOM 操作工具：`domapi.ts`
6. 核心 Diff 算法：`update.ts`
7. 生命周期与钩子函数
8. 模块系统（属性/样式/事件/类）
9. 完整执行流程
10. 源码总结

---

## 1. 核心架构与文件结构

Snabbdom 采用**模块化设计**，核心逻辑与扩展功能分离，文件结构清晰：

```
src/
├── snabbdom.ts       # 入口文件，导出核心 API
├── vnode.ts          # 虚拟 DOM 类型定义
├── h.ts              # 创建 VNode 的工具函数
├── domapi.ts         # 原生 DOM 操作封装
├── update.ts         # 核心 Diff + DOM 更新逻辑
├── hooks.ts          # 钩子函数类型定义
├── modules/          # 扩展模块（属性、样式、事件等）
│   ├── attributes.ts
│   ├── class.ts
│   ├── dataset.ts
│   ├── eventlisteners.ts
│   ├── style.ts
│   └── props.ts
```

**核心设计理念**：

- 虚拟 DOM = 普通 JS 对象（轻量、无副作用）
- Diff 算法 = 同层比较，避免跨层级遍历（高性能）
- 模块化 = 核心逻辑与扩展功能解耦（易扩展）

---

## 2. 入口文件：`snabbdom.ts`

`snabbdom.ts` 是 Snabbdom 的**入口**，负责**初始化核心函数**、**注册模块**、**导出 `init` 和 `h`**。

### 核心代码

```typescript
import { h } from "./h";
import { init } from "./init";
// 导出核心 API
export { h, init };
```

### `init` 函数（核心初始化）

`init` 是 Snabbdom 的**核心工厂函数**，接收**模块数组**，返回 `patch` 函数（用于更新 DOM）。

```typescript
// init 函数简化版
export function init(modules: Array<Module>, domApi?: DOMAPI) {
  // 1. 初始化 DOM 操作工具
  const api = domApi || htmlDomApi;
  // 2. 收集所有模块的钩子函数
  const hooks: Hooks = {};
  for (const module of modules) {
    for (const hook of Object.keys(module)) {
      if (!hooks[hook]) hooks[hook] = [];
      hooks[hook].push(module[hook]);
    }
  }
  // 3. 返回 patch 函数（核心更新函数）
  return function patch(oldVnode: VNode | Element, vnode: VNode) {
    // ... 后续执行 DOM 更新逻辑
  };
}
```

**核心作用**：

- 注册扩展模块（属性、事件、样式等）
- 收集模块钩子，注入到 Diff/更新流程
- 返回 `patch` 函数（虚拟 DOM → 真实 DOM 的桥梁）

---

## 3. 虚拟 DOM 定义：`vnode.ts`

`vnode.ts` 定义了 Snabbdom 中**虚拟 DOM 的数据结构**，虚拟 DOM 本质是**描述真实 DOM 的 JS 对象**。

### VNode 类型定义

```typescript
export interface VNode {
  sel: string | undefined; // 选择器（如 div、.class、#id）
  data: VNodeData | undefined; // 数据（属性、样式、事件、子元素等）
  children: Array<VNode | string> | undefined; // 子节点
  elm: Node | undefined; // 对应的真实 DOM 元素
  text: string | undefined; // 文本内容
  key: string | number | undefined; // 唯一标识（Diff 算法用）
}

// VNode 数据（属性、样式、事件等）
export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  class?: Classes;
  style?: CSSStyle;
  on?: On;
  dataset?: Dataset;
  key?: Key;
  // ... 其他扩展数据
}
```

### 关键字段解释

| 字段       | 作用                                    |
| ---------- | --------------------------------------- |
| `sel`      | 节点选择器，标识节点类型（div/span 等） |
| `data`     | 节点属性、样式、事件、类名等附加数据    |
| `children` | 子虚拟节点数组                          |
| `elm`      | 映射的**真实 DOM 元素**（渲染后赋值）   |
| `text`     | 文本节点内容（优先级高于 children）     |
| `key`      | 节点唯一标识，优化 Diff 算法性能        |

### 创建 VNode 的工厂函数

```typescript
// 工厂函数：创建 VNode 对象
export function vnode(
  sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined,
): VNode {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
```

作用：统一封装 VNode 创建逻辑，保证结构标准化。

---

## 4. 核心函数：`h()` 函数

`h()` 函数是 Snabbdom 的**虚拟节点创建函数**，是开发者最常用的 API，作用是**将模板描述转为 VNode 对象**。

### 函数签名

```typescript
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;
```

### 核心实现

```typescript
export function h(sel: any, b?: any, c?: any): VNode {
  let data: VNodeData = {},
    children: any,
    text: any;

  // 处理参数：兼容不同传参方式
  if (c !== undefined) {
    data = b;
    if (is.array(c)) children = c;
    else text = c;
  } else if (b !== undefined) {
    if (is.array(b)) children = b;
    else if (is.primitive(b)) text = b;
    else data = b;
  }

  // 处理子节点：将字符串转为文本 VNode
  if (is.primitive(text)) {
    children = [vnode(undefined, undefined, undefined, text, undefined)];
  }

  // 调用 vnode 工厂函数创建虚拟节点
  return vnode(sel, data, children, text, undefined);
}
```

### 使用示例

```typescript
// 创建 div 节点，包含文本
h("div", "Hello Snabbdom");

// 创建带属性、样式、子节点的节点
h(
  "div#container",
  {
    class: { active: true },
    style: { color: "red" },
    on: { click: () => alert("click") },
  },
  [h("span", "子节点")],
);
```

**核心作用**：简化 VNode 创建，屏蔽底层工厂函数细节。

---

## 5. DOM 操作工具：`domapi.ts`

Snabbdom 不直接操作原生 DOM API，而是封装 `domapi.ts`，**统一 DOM 操作入口**，便于测试和跨平台。

### 核心 DOM 操作封装

```typescript
export const htmlDomApi: DOMAPI = {
  // 创建元素
  createElement: (tagName: string) => document.createElement(tagName),
  // 创建文本节点
  createTextNode: (text: string) => document.createTextNode(text),
  // 插入节点
  appendChild: (parent: Node, child: Node) => parent.appendChild(child),
  // 删除节点
  removeChild: (parent: Node, child: Node) => parent.removeChild(child),
  // 设置文本内容
  setTextContent: (node: Node, text: string) => (node.textContent = text),
  // 获取父节点/下一个兄弟节点
  parentNode: (node: Node) => node.parentNode,
  nextSibling: (node: Node) => node.nextSibling,
  // ... 其他 DOM 操作
};
```

**核心作用**：

- 解耦核心逻辑与原生 DOM，方便单元测试
- 统一 DOM 操作规范，避免兼容性问题

---

## 6. 核心 Diff 算法：`update.ts`

`update.ts` 是 Snabbdom 的**心脏**，包含两大核心逻辑：

1. **`patch`**：旧 VNode → 新 VNode，更新真实 DOM
2. **`updateChildren`**：子节点 Diff 算法（虚拟 DOM 核心性能点）

### 6.1 `patch` 函数（顶层更新逻辑）

```typescript
function patch(oldVnode: VNode | Element, vnode: VNode) {
  const elm = oldVnode.elm!;
  const parent = api.parentNode(elm);

  // 1. 转换：如果旧节点是真实 DOM，转为 VNode
  if (is.element(oldVnode)) {
    oldVnode = emptyNodeAt(oldVnode);
  }

  // 2. 判断：新旧节点是否相同（sel + key 一致）
  if (sameVnode(oldVnode, vnode)) {
    // 相同节点：执行 Diff 更新
    patchVnode(oldVnode, vnode, insertedVnodeQueue);
  } else {
    // 不同节点：直接替换
    const newElm = createElm(vnode, insertedVnodeQueue);
    if (parent !== null) {
      api.insertBefore(parent, newElm, api.nextSibling(elm));
      removeVnodes(parent, [oldVnode], 0, 0);
    }
  }

  // 3. 触发 insert 钩子
  for (const hook of insertedVnodeQueue) {
    hook.data.hook!.insert!(hook);
  }

  return vnode;
}
```

**关键逻辑**：

- `sameVnode`：判断两个 VNode 是否可复用（`sel` + `key` 一致）
- 相同节点 → `patchVnode` 精细化更新
- 不同节点 → 直接销毁旧节点，创建新节点替换

### 6.2 `patchVnode` 函数（节点精细化更新）

```typescript
function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNode[]) {
  // 1. 触发 update 钩子
  const data = vnode.data;
  if (data !== undefined) {
    for (const hook of hooks.update!) hook(oldVnode, vnode);
  }

  // 2. 文本节点更新
  if (vnode.text !== undefined) {
    // 新节点是文本：直接设置文本内容
    api.setTextContent(oldVnode.elm!, vnode.text);
  } else {
    const oldCh = oldVnode.children;
    const ch = vnode.children;
    // 3. 子节点都存在：执行子节点 Diff
    if (oldCh !== undefined && ch !== undefined) {
      updateChildren(oldVnode.elm!, oldCh, ch, insertedVnodeQueue);
    }
    // 4. 只有新子节点：添加新子节点
    else if (ch !== undefined) {
      addVnodes(oldVnode.elm!, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    }
    // 5. 只有旧子节点：删除旧子节点
    else if (oldCh !== undefined) {
      removeVnodes(oldVnode.elm!, oldCh, 0, oldCh.length - 1);
    }
  }

  // 6. 触发 postpatch 钩子
  if (data !== undefined) {
    for (const hook of hooks.postpatch!) hook(oldVnode, vnode);
  }
}
```

### 6.3 `updateChildren` 函数（子节点 Diff 算法）

这是**虚拟 DOM 最核心的性能优化点**，Snabbdom 采用**双指针同层比较**，时间复杂度 O(n)。

#### 双指针定义

- `oldStartIdx` / `oldEndIdx`：旧子节点首尾指针
- `newStartIdx` / `newEndIdx`：新子节点首尾指针

#### 4 种比较策略（优先级从高到低）

1. 旧首 ↔ 新首
2. 旧尾 ↔ 新尾
3. 旧首 ↔ 新尾（移动节点）
4. 旧尾 ↔ 新首（移动节点）
5. 兜底：通过 `key` 查找复用节点

#### 核心代码

```typescript
function updateChildren(parent: Node, oldCh: VNode[], newCh: VNode[], insertedVnodeQueue: VNode[]) {
  let oldStartIdx = 0,
    newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newEndIdx = newCh.length - 1;
  let oldStartVnode = oldCh[0],
    newStartVnode = newCh[0];
  let oldEndVnode = oldCh[oldEndIdx],
    newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx: KeyToIndexMap | undefined;
  let idxInOld: number;
  let elmToMove: VNode;

  // 双指针循环比较
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 处理已删除节点
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    }
    // 策略1：旧首 = 新首
    else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    // 策略2：旧尾 = 新尾
    else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    // 策略3：旧首 = 新尾
    else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
      api.insertBefore(parent, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!));
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    }
    // 策略4：旧尾 = 新首
    else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
      api.insertBefore(parent, oldEndVnode.elm!, oldStartVnode.elm!);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    }
    // 兜底：key 匹配
    else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = oldKeyToIdx[newStartVnode.key as string];
      // 无匹配 key：创建新节点
      if (idxInOld === undefined) {
        api.insertBefore(parent, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!);
      }
      // 有匹配 key：复用节点
      else {
        elmToMove = oldCh[idxInOld];
        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
        oldCh[idxInOld] = undefined as any;
        api.insertBefore(parent, elmToMove.elm!, oldStartVnode.elm!);
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }

  // 处理剩余节点：添加/删除
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(parent, oldCh, oldStartIdx, oldEndIdx);
  }
  if (newStartIdx <= newEndIdx) {
    addVnodes(parent, null, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
  }
}
```

**Diff 算法核心优势**：

- 仅**同层比较**，避免跨层级 DOM 操作（性能损耗大）
- 双指针 + 4 种策略，最大化复用 DOM 节点
- `key` 精准匹配，避免节点误删/误移

---

## 7. 生命周期与钩子函数

Snabbdom 提供**生命周期钩子**，允许在 DOM 渲染/更新的不同阶段执行自定义逻辑。

### 内置钩子类型

```typescript
export interface Hooks {
  pre?: PreHook; // patch 开始前
  init?: InitHook; // VNode 创建时
  create?: CreateHook; // DOM 元素创建时
  insert?: InsertHook; // DOM 插入文档时
  update?: UpdateHook; // 节点更新时
  remove?: RemoveHook; // 节点删除时
  destroy?: DestroyHook; // 节点销毁时
  post?: PostHook; // patch 完成后
}
```

### 钩子使用示例

```typescript
h(
  "div",
  {
    hook: {
      insert: (vnode) => {
        console.log("节点插入到 DOM 了", vnode.elm);
      },
      destroy: () => {
        console.log("节点销毁了");
      },
    },
  },
  "钩子测试",
);
```

**核心作用**：实现副作用逻辑（DOM 操作、异步请求、定时器清理等）。

---

## 8. 模块系统

Snabbdom 核心不包含任何属性/样式/事件处理，通过**模块**扩展功能，模块本质是**钩子函数的集合**。

### 常用模块

1. **attributes**：处理 HTML 属性（`id`/`class`/`src` 等）
2. **props**：处理 DOM 属性（`value`/`checked` 等）
3. **class**：处理类名切换
4. **style**：处理行内样式
5. **eventlisteners**：处理事件绑定
6. **dataset**：处理 `data-*` 属性

### 模块实现示例（class 模块）

```typescript
export const classModule = {
  // 节点创建时：添加类名
  create: updateClass,
  // 节点更新时：更新类名
  update: updateClass,
};

// 类名更新逻辑
function updateClass(oldVnode: VNode, vnode: VNode) {
  const elm = vnode.elm!;
  const oldClass = oldVnode.data?.class;
  const newClass = vnode.data?.class;

  if (oldClass === newClass) return;

  // 删除旧类名
  if (oldClass) {
    for (const name in oldClass) {
      if (!newClass || !newClass[name]) {
        elm.classList.remove(name);
      }
    }
  }
  // 添加新类名
  if (newClass) {
    for (const name in newClass) {
      if (!oldClass || !oldClass[name]) {
        elm.classList.add(name);
      }
    }
  }
}
```

**模块设计优势**：按需引入，减小打包体积，灵活扩展。

---

## 9. 完整执行流程

从调用 API 到 DOM 更新，Snabbdom 的完整流程：

1. **创建 VNode**：调用 `h()` 函数生成虚拟节点
2. **初始化**：调用 `init()` 注册模块，返回 `patch` 函数
3. **首次渲染**：`patch(container, vnode)` → 创建真实 DOM 插入容器
4. **更新渲染**：`patch(oldVnode, newVnode)` → 执行 Diff 算法
5. **DOM 更新**：根据 Diff 结果，最小化操作真实 DOM
6. **触发钩子**：执行生命周期回调

---

## 10. 源码总结

### Snabbdom 核心亮点

1. **极简设计**：核心代码 < 500 行，易读易理解
2. **高性能 Diff**：双指针同层比较，时间复杂度 O(n)
3. **模块化**：核心与扩展分离，按需使用
4. **可扩展**：钩子+模块系统，支持自定义功能
5. **无框架依赖**：可单独使用，也可集成到其他框架

### 虚拟 DOM 核心原理（Snabbdom 验证）

- 用 JS 对象模拟真实 DOM（VNode）
- 状态变化 → 生成新 VNode
- 通过 Diff 算法对比新旧 VNode，找到最小差异
- 只更新差异部分，避免全量重绘 DOM

---

## 结语

Snabbdom 是学习虚拟 DOM 的**最佳教材**，它剥离了框架的复杂逻辑，只保留虚拟 DOM 的核心本质。理解 Snabbdom 源码，你就能彻底掌握：

- 虚拟 DOM 的数据结构
- 高性能 Diff 算法的实现细节
- 模块化、可扩展的库设计思想

这也是 Vue 虚拟 DOM 的核心设计原型，吃透 Snabbdom，再学 Vue 源码会事半功倍。
