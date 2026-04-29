# Vue.js Getting Started 入门（中英对照完整版）

## Introduction 简介

**English**
Vue.js is a library for building interactive web interfaces.
Technically, Vue.js is focused on the ViewModel layer of the MVVM pattern. It connects the View and the Model via two way data bindings. Actual DOM manipulations and output formatting are abstracted away into Directives and Filters.

**中文**
Vue.js 是一套用于构建交互式网页界面的库。
从技术层面来说，Vue.js 聚焦于 MVVM 模式的 ViewModel 层，通过双向数据绑定连接视图（View）与数据模型（Model），将原生 DOM 操作与内容格式化逻辑统一封装为指令（Directives）和过滤器（Filters）。

---

**English**
Philosophically, the goal is to provide the benefits of reactive data binding and composable view components with an API that is as simple as possible. It is not a full-blown framework - it is designed to be a view layer that is simple and flexible. You can use it alone for rapid prototyping, or mix and match with other libraries for a custom front-end stack. It’s also a natural fit for no-backend services such as Firebase.

**中文**
从设计理念上，它旨在用极简的 API，提供响应式数据绑定与可组合视图组件的能力。它并非大型完整框架，而是轻量灵活的视图层工具。你可以单独使用它快速开发原型，也可搭配其他类库搭建自定义前端技术栈，同时非常适配 Firebase 等无后端服务。

---

**English**
Vue.js’ API is heavily influenced by AngularJS, KnockoutJS, Ractive.js and Rivets.js. Despite the similarities, I believe Vue.js offers a valuable alternative to these existing libraries by finding a sweetspot between simplicity and functionality.

**中文**
Vue.js 的 API 设计深受 AngularJS、KnockoutJS、Ractive.js、Rivets.js 影响。虽然存在相似性，但 Vue 在简洁性与功能性之间找到了平衡，为开发者提供了优质的替代方案。

---

**English**
Even if you are already familiar with some of these terms, it is recommended that you go through the following concepts overview because your notion of these terms might be different from what they mean in the Vue.js context.

**中文**
即便你熟悉以上相关术语，仍建议阅读下文概念概述，因为这些概念在 Vue 语境下的含义，可能与你以往认知不同。

---

## Concepts Overview 概念概览

### ViewModel 视图模型

**English**
An object that syncs the Model and the View. In Vue.js, every Vue instance is a ViewModel. They are instantiated with the Vue constructor or its sub-classes:

```js
var vm = new Vue({
  /* options */
});
```

This is the primary object that you will be interacting with as a developer when using Vue.js. For more details see The Vue Constructor.

**中文**
用于同步数据模型与视图的核心对象。在 Vue.js 中，每一个 Vue 实例都是一个 ViewModel，通过 Vue 构造函数或其子类创建：

```js
var vm = new Vue({
  /* 配置项 */
});
```

这是开发 Vue 项目时最核心的操作对象，更多细节可参考「Vue 构造函数」章节。

---

### View 视图

**English**
The actual DOM that is managed by Vue instances.

```js
vm.$el; // The View
```

Vue.js uses DOM-based templating. Each Vue instance is associated with a corresponding DOM element. When a Vue instance is created, it recursively walks all child nodes of its root element while setting up the necessary data bindings. After the View is compiled, it becomes reactive to data changes.

**中文**
由 Vue 实例托管的真实 DOM 元素。

```js
vm.$el; // 访问视图 DOM
```

Vue.js 采用基于 DOM 的模板渲染方式，每个 Vue 实例都会绑定一个专属 DOM 节点。实例创建时，会递归遍历根元素所有子节点并完成数据绑定，模板编译完成后，视图即可响应数据变化。

---

**English**
When using Vue.js, you rarely have to touch the DOM yourself except in custom directives (explained later). View updates will be automatically triggered when the data changes. These view updates are highly granular with the precision down to a textNode. They are also batched and executed asynchronously for greater performance.

**中文**
使用 Vue 开发时，除自定义指令（后文讲解）外，几乎无需手动操作 DOM。数据变更会自动触发视图更新，更新粒度精细至文本节点，同时采用异步批量更新机制，保证高性能渲染。

---

### Model 数据模型

**English**
A slightly modified plain JavaScript object.

```js
vm.$data; // The Model
```

In Vue.js, models are simply plain JavaScript objects, or data objects. You can manipulate their properties and Vue instances that are observing them will be notified of the changes. Vue.js achieves transparent reactivity by converting the properties on data objects into ES5 getter/setters. There’s no need for dirty checking, nor do you have to explicitly signal Vue to update the View. Whenever the data changes, the View is updated on the next frame.

**中文**
经过响应式改造的原生普通 JavaScript 对象。

```js
vm.$data; // 访问数据模型
```

Vue 中的模型就是普通 JS 数据对象，直接修改属性即可被监听的 Vue 实例感知。Vue 利用 ES5 的 getter/setter 实现无感响应式，无需脏检查、无需手动通知视图刷新，数据变化后会在下一帧自动更新页面。

---

**English**
Vue instances proxy all properties on data objects they observe. So once an object `{ a: 1 }` has been observed, both `vm.$data.a` and `vm.a` will return the same value, and setting `vm.a = 2` will modify `vm.$data`.

**中文**
Vue 实例会代理所监听数据的所有属性。例如对象 `{ a: 1 }` 被劫持后，`vm.$data.a` 与 `vm.a` 取值完全一致，修改 `vm.a = 2` 也会同步修改 `vm.$data`。

---

**English**
The data objects are mutated in place, so modifying it by reference has the same effects as modifying vm.$data. This makes it possible for multiple Vue instances to observe the same piece of data. In larger applications it is also recommended to treat Vue instances as pure views, and externalize the data manipulation logic into a more discrete store layer.

**中文**
数据对象为原地修改，通过引用修改数据和直接操作 `vm.$data` 效果一致，支持多个 Vue 实例共享同一份监听数据。大型项目中建议将 Vue 实例只作为纯视图，把数据逻辑抽离至独立状态管理层。

---

**English**
One caveat here is that once the observation has been initiated, Vue.js will not be able to detect newly added or deleted properties. To get around that, observed objects are augmented with $add, $set and $delete methods.

**中文**
注意：响应式监听初始化后，Vue 无法监测对象**新增/删除**的属性。因此 Vue 为监听对象扩展了 `$add`、`$set`、`$delete` 方法来解决该问题。

---

### Directives 指令

**English**
Prefixed HTML attributes that tell Vue.js to do something about a DOM element.

```html
<div v-text="message"></div>
```

Here the div element has a v-text directive with the value message. This tells Vue.js to keep the div’s textContent in sync with the Vue instance’s message property.

**中文**
带有专属前缀的 HTML 特性，用来指令 Vue 对 DOM 元素执行特定操作。

```html
<div v-text="message"></div>
```

该 div 标签绑定了 `v-text` 指令，值为 message，作用是让元素文本内容与 Vue 实例的 message 属性保持同步。

---

**English**
Directives can encapsulate arbitrary DOM manipulations. For example v-attr manipulates an element’s attributes, v-repeat clones an element based on an Array, v-on attaches event listeners… we will cover them later.

**中文**
指令可以封装任意复杂的 DOM 操作：`v-attr` 操作元素属性、`v-repeat` 根据数组循环渲染元素、`v-on` 绑定事件监听，更多指令后续详解。

---

### Mustache Bindings 大括号插值

**English**
You can also use mustache-style bindings, both in text and in attributes. They are translated into v-text and v-attr directives under the hood. For example:

```html
<div id="person-{{id}}">Hello {{name}}!</div>
```

**中文**
你可以在文本和标签属性中使用大括号插值语法，底层会自动编译为 `v-text` 和 `v-attr` 指令，示例：

```html
<div id="person-{{id}}">Hello {{name}}!</div>
```

---

**English**
Although it is convenient, there are a few things you need to be aware of:
The src attribute on an `<image>` element makes an HTTP request when a value is set, so when the template is first parsed it will result in a 404. In this case v-attr is preferred.

**中文**
插值语法虽便捷，但有注意事项：
图片标签的 src 属性使用插值绑定时，模板初次解析会发起无效请求导致 404，此类场景推荐使用 `v-attr`。

---

**English**
Internet Explorer will remove invalid inline style attributes when parsing HTML, so always use v-style when binding inline CSS if you want to support IE.

**中文**
IE 浏览器会自动清除非法行内样式，如需兼容 IE，行内 CSS 样式绑定请统一使用 `v-style`。

---

**English**
You can use triple mustaches for unescaped HTML, which translates to v-html internally:

```html
{{{ safeHTMLString }}}
```

However, this can open up windows for potential XSS attacks, therefore it is suggested that you only use triple mustaches when you are absolutely sure about the security of the data source, or pipe it through a custom filter that sanitizes untrusted HTML.

**中文**
三层大括号可渲染未转义的 HTML 内容，底层等价于 `v-html`：

```html
{{{ safeHTMLString }}}
```

该写法存在 XSS 安全风险，仅建议在数据源完全可信时使用，或配合过滤 HTML 的自定义过滤器使用。

---

**English**
Finally, you can add \* to your mustache bindings to indicate a one-time only interpolation, which does not react to data changes:

```html
{{* onlyOnce }}
```

**中文**
在插值中添加 `*` 可实现**一次性插值**，数据后续变化不会更新视图：

```html
{{* onlyOnce }}
```

---

### Filters 过滤器

**English**
Filters are functions used to process the raw values before updating the View. They are denoted by a “pipe” inside directives or bindings:

```html
<div>{{message | capitalize}}</div>
```

Now before the div’s textContent is updated, the message value will first be passed through the capitalize function. For more details see Filters in Depth.

**中文**
过滤器是视图更新前用来处理原始数据的函数，在插值/指令中通过管道符 `|` 调用：

```html
<div>{{message | capitalize}}</div>
```

元素文本渲染前，message 数据会先经过 capitalize 函数格式化，更多用法参考「深入过滤器」章节。

---

### Components 组件

**English**
In Vue.js, every component is simply a Vue instance. Components form a nested tree-like hierarchy that represents your application interface. They can be instantiated by a custom constructor returned from Vue.extend, but a more declarative approach is registering them with Vue.component(id, constructor).

**中文**
在 Vue.js 中，组件本质就是 Vue 实例。组件通过嵌套形成树形结构，构成整个应用界面。可通过 `Vue.extend` 创建组件构造器，更推荐使用 `Vue.component(id, 构造函数)` 声明式注册组件。

---

**English**
Once registered, they can be declaratively nested in other Vue instance’s templates with the v-component directive:

```html
<div v-component="my-component">
  <!-- internals handled by my-component -->
</div>
```

**中文**
组件注册后，可通过 `v-component` 指令在其他模板中直接嵌套使用：

```html
<div v-component="my-component">
  <!-- 组件内部内容 -->
</div>
```

---

**English**
This simple mechanism enables declarative reuse and composition of Vue instances in a fashion similar to Web Components, without the need for latest browsers or heavy polyfills. By breaking an application into smaller components, the result is a highly decoupled and maintainable codebase. For more details, see Component System.

**中文**
该机制实现了组件的复用与组合，用法类似 Web Components，且无需高版本浏览器和大量兼容补丁。将项目拆分为小组件，能有效降低代码耦合度、提升可维护性，详见「组件系统」章节。

---

## A Quick Example 快速示例

**English | HTML**

```html
<div id="demo">
  <h1>{{title | uppercase}}</h1>
  <ul>
    <li v-repeat="todos" v-on="click: done = !done" class="{{done ? 'done' : ''}}">{{content}}</li>
  </ul>
</div>
```

**中文 | HTML**

```html
<div id="demo">
  <h1>{{title | uppercase}}</h1>
  <ul>
    <li v-repeat="todos" v-on="click: done = !done" class="{{done ? 'done' : ''}}">{{content}}</li>
  </ul>
</div>
```

---

**English | JS**

```js
var demo = new Vue({
  el: "#demo",
  data: {
    title: "todos",
    todos: [
      {
        done: true,
        content: "Learn JavaScript",
      },
      {
        done: false,
        content: "Learn Vue.js",
      },
    ],
  },
});
```

**中文 | JS**

```js
var demo = new Vue({
  el: "#demo",
  data: {
    title: "todos",
    todos: [
      { done: true, content: "Learn JavaScript" },
      { done: false, content: "Learn Vue.js" },
    ],
  },
});
```

---

**English**
Result
TODOS
• Learn JavaScript
• Learn Vue.js

Also available on jsfiddle.

**中文**
运行结果
TODOS
• Learn JavaScript
• Learn Vue.js

可在 JSFiddle 在线运行该示例。

---

**English**
You can click on a todo to toggle it, or open your Browser’s console and play with the demo object - for example, change demo.title, push a new object into demo.todos, or toggle a todo’s done state.

**中文**
点击待办项可切换完成状态；也可打开浏览器控制台操作 demo 实例，例如修改标题、新增待办、切换任务状态。

---

**English**
You probably have a few questions in mind now - don’t worry, we’ll cover them soon. Next up: Directives in Depth.

**中文**
你此刻可能存在一些疑问，无需担心，后续会逐一讲解。下一章：深入理解指令。

---
