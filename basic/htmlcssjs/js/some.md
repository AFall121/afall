---
outline:{
    level:[2,4]
}
---

# 部分概念
## 浅拷贝&深拷贝
在 JavaScript 中，**值的引用（Reference）** 和 **值的拷贝（Copy）** 是两种不同的数据传递方式。理解它们的区别有助于更准确地掌握模块之间数据交互的行为。

---
## 🆚 浅拷贝 vs 深拷贝 对比表

| 特性            | 浅拷贝（Shallow Copy）                     | 深拷贝（Deep Copy）                          |
|-----------------|--------------------------------------------|----------------------------------------------|
| **定义**         | 创建一个新对象，但只复制顶层属性             | 递归复制对象的所有层级，包括嵌套对象/数组     |
| **引用共享问题** | 原始对象的嵌套对象在拷贝后仍被共享           | 完全独立，不会共享任何子对象                  |
| **实现方式**     | `Object.assign()`、扩展运算符 `{...obj}` 等 | 手动递归、`JSON.parse(JSON.stringify())`、第三方库 |
| **支持类型**     | 基本类型 + 对象第一层                      | 支持多层嵌套对象、数组等                      |
| **性能**         | 快速                                       | 相对较慢，尤其是大对象                        |
| **循环引用处理** | 无法处理，会报错                           | 需要特殊处理才能支持（如使用递归缓存）        |
| **函数/undefined保留** | 保留                                   | JSON 方法不支持函数、`undefined` 等非 JSON 类型 |

---

## 💡 案例说明：为什么需要深拷贝？

### 示例 1：浅拷贝的问题

```js
const original = {
  name: "Alice",
  address: {
    city: "Beijing"
  }
};

const copy = { ...original };
copy.address.city = "Shanghai";

console.log(original.address.city); // 输出 "Shanghai"，因为 address 是引用共享的
```

> ❗说明：即使你修改的是拷贝后的对象，原始对象也被“意外”修改了。

---

### 示例 2：使用 JSON 实现深拷贝（基础方案）

```js
const original = {
  name: "Alice",
  address: {
    city: "Beijing"
  }
};

const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.address.city = "Shanghai";

console.log(original.address.city); // 输出 "Beijing"，成功隔离
```

> ✅ 成功避免了引用共享。

#### ⚠️ 缺点：
- 不支持函数、`undefined`、`Symbol`、`Date`、正则表达式等。
- 不能处理循环引用（如 `obj.self = obj`）。

---

### 示例 3：使用递归实现带循环引用检测的深拷贝（进阶方案）

```js
function deepClone(obj, visited = new Map()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (visited.has(obj)) return visited.get(obj);

  const clone = Array.isArray(obj) ? [] : {};
  visited.set(obj, clone);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], visited);
    }
  }

  return clone;
}

// 使用示例
const original = { a: 1, b: { c: 2 } };
const copy = deepClone(original);
copy.b.c = 3;

console.log(original.b.c); // 输出 2，说明完全隔离
```

> ✅ 支持嵌套对象、数组、循环引用。

---

### 示例 4：使用 Lodash 的 `_.cloneDeep()`（推荐生产环境使用）

```bash
npm install lodash
```

```js
const _ = require('lodash');

const original = {
  name: "Alice",
  address: {
    city: "Beijing"
  }
};

const deepCopy = _.cloneDeep(original);
deepCopy.address.city = "Shanghai";

console.log(original.address.city); // 输出 "Beijing"
```

> ✅ 完美支持所有数据类型（函数、日期、正则等），并能处理循环引用。

---

## ✅ 总结：深拷贝的完美方案建议

| 场景                         | 推荐方案                             |
|------------------------------|--------------------------------------|
| 简单对象，无需复杂类型       | `JSON.parse(JSON.stringify(obj))`   |
| 需要支持函数、Symbol、Date 等 | 使用递归深拷贝或第三方库如 `lodash` |
| 存在循环引用                 | 使用递归+Map 或 `lodash.cloneDeep()` |
| 生产环境、大型项目           | 使用成熟库（如 Lodash）               |

---

## 📌 小贴士

- 如果你在开发 Node.js 或现代前端项目，推荐引入 `lodash` 或其他专业工具库来处理深拷贝。
- 自行实现深拷贝时，务必注意性能和边界条件（如 Symbol、函数、DOM 节点等）。
---
## 纯函数pure function

pure function（纯函数）是现代前端框架中非常重要的概念，尤其在 React、Vue、Angular 等主流框架中被广泛使用。纯函数具有**确定性输出**和**无副作用**的特性，因此非常适合用于组件渲染、状态计算等场景。

###  什么是 pure function？

### 定义：
1. **相同的输入始终返回相同的输出**
2. **不产生任何副作用（如修改外部变量、发起网络请求、修改 DOM 等）**

---

## ☑️ 实际运用场景

| 场景 | 描述 | 示例 |
|------|------|------|
| **React 组件（函数组件）** | 函数组件本质上就是一个 pure function，接收 `props` 返回 UI | ```jsx const Greeting = ({ name }) => <div>Hello, {name}</div>; ``` |
| **Vue 模板中的表达式** | Vue 模板绑定的数据处理逻辑要求是纯函数以避免副作用 | ```html `mustache语法:` formatPrice(price)  ``` |
| **Redux 中的 reducer** | Reducer 必须是纯函数，确保状态更新可预测 | ```js function counter(state = 0, action) { return state + 1; } ``` |
| **Vue Composition API 的 computed 属性** | `computed(() => ...)` 要求传入的是纯函数，保证缓存一致性 | ```js const fullName = computed(() => firstName.value + lastName.value); ``` |
| **Angular 的 Pipe（管道）** | 自定义 Pipe 应该设计为纯函数，提高性能与可测试性 | ```ts @Pipe({ name: 'formatDate' }) export class FormatDatePipe implements PipeTransform { transform(date: Date): string { return date.toISOString(); } } ``` |
| **React Hooks 中的依赖项（useMemo / useCallback）** | 这些 Hook 内部依赖的函数应为纯函数，以便正确进行缓存优化 | ```js const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]); ``` |

---

## ✅ 使用纯函数的好处

| 好处 | 说明 |
|------|------|
| **可预测性强** | 输入相同，输出一定相同，便于调试和测试 |
| **易于缓存（memoization）** | 可利用 `useMemo`、`computed` 等机制缓存结果提升性能 |
| **支持时间旅行调试（Time Travel Debugging）** | 如 Redux DevTools 可追溯每次状态变化 |
| **组件复用性高** | 纯函数组件更容易复用和组合 |
| **便于单元测试** | 不依赖外部状态，测试更简单直接 |

---

##  ⚠️ 注意事项

- 避免在纯函数中执行副作用操作（如 `fetch`、`Math.random()`、`Date.now()`）
- 在需要副作用时，应通过生命周期钩子或 Effect Hook（如 React 的 `useEffect`）管理

---

##  🧩 总结表格：Pure Function 在主流框架中的应用

| 框架 | 应用场景 | 是否推荐使用纯函数 |
|------|----------|--------------------|
| React | 函数组件、Reduction、useMemo、useCallback | ✅ 强烈推荐 |
| Vue | 模板表达式、computed、自定义指令逻辑 | ✅ 推荐 |
| Angular | Pipe、Service 中的业务逻辑 | ✅ 推荐 |
| Svelte | Store 更新函数、派生值 | ✅ 推荐 |

---

## 高阶函数
高阶函数（Higher-Order Function）是函数式编程中的核心概念，指的是：

> **接收一个或多个函数作为参数，或者返回一个新函数的函数。**

在 JavaScript 中，函数是一等公民（first-class citizen），可以像普通值一样被传递、返回和赋值，这为高阶函数的应用提供了天然支持。

---

## 🧠 高阶函数的核心思想

| 类型 | 描述 |
|------|------|
| **函数作为参数** | 将逻辑封装为函数，传入另一个函数中执行（如 `map`, `filter`, `reduce`） |
| **函数作为返回值** | 通过闭包特性返回新函数，实现更灵活的功能组合（如 `curry`, `once`, `memoize`） |

---

## ✅ 常见内置高阶函数（数组方法）

| 方法名 | 描述 | 示例 |
|--------|------|------|
| `Array.prototype.map` | 对数组每个元素应用函数，返回新数组 | ```js [1,2,3].map(x => x * 2) // [2,4,6]``` |
| `Array.prototype.filter` | 根据条件筛选元素 | ```js [1,2,3].filter(x => x > 1) // [2,3]``` |
| `Array.prototype.reduce` | 累计计算（如求和、分组） | ```js [1,2,3].reduce((sum, x) => sum + x, 0) // 6``` |
| `Array.prototype.forEach` | 遍历数组并执行副作用 | ```js ['a','b'].forEach(x => console.log(x))``` |
| `Array.prototype.find` | 查找符合条件的第一个元素 | ```js users.find(u => u.id === 1)``` |

---

## 💡 实际开发中的妙用场景

### 1. 数据处理与转换（通用性增强）

```js
const users = [
  { id: 1, name: 'Alice', active: true },
  { id: 2, name: 'Bob', active: false },
];

// 获取所有激活用户的名字
const activeUserNames = users
  .filter(user => user.active)
  .map(user => user.name);
```

### 2. 函数柯里化（Currying）

将多参函数转化为一系列单参函数，便于复用和组合。

```js
function add(a) {
  return function(b) {
    return a + b;
  };
}

const add5 = add(5);
add5(3); // 8
```

使用箭头函数简化：

```js
const add = a => b => a + b;
const add10 = add(10);
add10(5); // 15
```

### 3. 函数节流/防抖（Throttle / Debounce）

常用于处理频繁触发的事件，如输入框搜索、窗口调整等。

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce(fetchResults, 300));
```

### 4. 条件判断抽象（Predicate 函数）

将判断逻辑抽离为函数，提高可读性和可测试性。

```js
const isEven = x => x % 2 === 0;
[1, 2, 3, 4].filter(isEven); // [2, 4]
```

### 5. 缓存函数结果（Memoization）

避免重复计算，提升性能（尤其适用于递归或复杂计算）。

```js
function memoize(fn) {
  const cache = {};
  return (arg) => {
    if (cache[arg]) return cache[arg];
    const result = fn(arg);
    cache[arg] = result;
    return result;
  };
}

const fib = memoize(n => n <= 1 ? n : fib(n - 1) + fib(n - 2));
fib(10); // 只计算一次，后续直接取缓存
```

### 6. 一次性调用（Once）

确保某个函数只执行一次。

```js
function once(fn) {
  let called = false;
  return function(...args) {
    if (!called) {
      called = true;
      return fn.apply(this, args);
    }
  };
}

const init = once(() => console.log('Initialized'));
init(); // 输出
init(); // 不输出
```

---

## 🎯 在现代框架中的应用

| 框架 | 应用场景 | 示例 |
|------|----------|------|
| **React** | `useCallback`, `useMemo`, `HOC（高阶组件）` | ```js const MemoizedComp = React.memo(MyComponent); ``` |
| **Vue** | `computed`, `watch`, 自定义指令逻辑 | ```js computed: { fullName() { return this.firstName + this.lastName } } ``` |
| **Redux** | `createSelector`（Reselect）、中间件、reducer 组合 | ```js createSelector([getCart], cart => cart.items) ``` |
| **Lodash / Ramda** | 提供大量高阶函数工具如 `map`, `filter`, `flowRight` 等 | ```js _.mapValues(obj, val => val * 2) ``` |

---

## 🧩 总结：高阶函数的优势与适用场景

| 优势 | 说明 | 典型应用场景 |
|------|------|---------------|
| **代码简洁** | 抽象重复逻辑，减少样板代码 | 数据转换、过滤、聚合 |
| **逻辑解耦** | 将数据操作与业务逻辑分离 | 表格渲染、搜索、排序 |
| **可组合性** | 多个函数串联形成复杂逻辑 | 函数链式调用、管道操作 |
| **可测试性高** | 纯函数形式便于单元测试 | reducer、utils、helper |
| **性能优化** | 结合 memoization 提升效率 | 计算密集型任务、API 请求节流 |

---

## 📌 小贴士

- 使用高阶函数时注意保持函数的纯度，避免副作用。
- 合理使用函数式编程风格，不要过度抽象，影响可读性。
- 配合 TypeScript 使用，能获得更好的类型推导和 IDE 支持。

--- 

如果你有具体需求（比如“如何用高阶函数封装 API 请求”、“如何设计一个权限控制的高阶函数”），我可以进一步帮你展开写法。