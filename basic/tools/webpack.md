---
outline: deep
---

# Webpack

Webpack 是一个现代的模块打包工具，广泛用于前端开发中。它可以帮助开发者将多个模块（如 JavaScript、CSS、图片等）打包成一个或多个静态资源文件，以便在浏览器中加载。以下是 Webpack 的核心概念和一个经典的配置示例。

## Webpack 核心概念

1. **入口（Entry）**
   - Webpack 构建过程的起点。Webpack 从入口文件开始，递归地解析和打包所有依赖的模块。
   - 默认入口文件为 `src/index.js`。

2. **输出（Output）**
   - Webpack 打包后的文件输出位置和命名。
   - 默认输出文件为 `dist/main.js`。

3. **加载器（Loaders）**
   - Webpack 本身只能处理 JavaScript 文件。加载器允许 Webpack 处理其他类型的文件，并将其转换为模块。
   - 常用加载器包括 `babel-loader`（处理 ES6+ 代码）、`css-loader`（处理 CSS 文件）、`style-loader`（将 CSS 注入到 DOM 中）、`file-loader`（处理文件）等。

4. **插件（Plugins）**
   - 插件用于执行更广泛的任务，如打包优化、资源管理和环境变量注入。
   - 常用插件包括 `HtmlWebpackPlugin`（生成 HTML 文件）、`CleanWebpackPlugin`（清理输出目录）、`DefinePlugin`（定义全局常量）等。

5. **模式（Mode）**
   - Webpack 提供了三种模式：`development`、`production` 和 `none`。
   - `development` 模式启用开发工具，如 Source Map。
   - `production` 模式启用优化，如代码压缩和 Tree Shaking。
   - `none` 模式不启用任何默认优化。

6. **模块解析（Module Resolution）**
   - Webpack 如何查找模块。可以通过配置 `resolve` 选项来修改模块解析规则。
   - 常用配置包括 `alias`（模块路径别名）、`extensions`（文件扩展名）、`modules`（模块查找路径）等。

7. **开发服务器（Dev Server）**
   - 提供一个本地开发服务器，支持热模块替换（HMR），提高开发效率。
   - 通过 `webpack-dev-server` 包实现。

## 经典配置示例

以下是一个经典的 Webpack 配置示例，涵盖了上述核心概念：

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 入口文件
  entry: './src/index.js',

  // 输出配置
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // 自动清理输出目录
  },

  // 模式
  mode: 'development', // 可选值: 'development', 'production', 'none'

  // 加载器配置
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有 .js 文件
        exclude: /node_modules/, // 排除 node_modules 目录
        use: {
          loader: 'babel-loader', // 使用 babel-loader 处理 .js 文件
          options: {
            presets: ['@babel/preset-env'], // 使用 @babel/preset-env 预设
          },
        },
      },
      {
        test: /\.css$/, // 匹配所有 .css 文件
        use: ['style-loader', 'css-loader'], // 使用 style-loader 和 css-loader 处理 .css 文件
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // 匹配所有图片文件
        type: 'asset/resource', // 使用 asset/resource 处理图片文件
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i, // 匹配所有字体文件
        type: 'asset/resource', // 使用 asset/resource 处理字体文件
      },
    ],
  },

  // 插件配置
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 使用 src/index.html 作为模板
      filename: 'index.html', // 输出文件名为 index.html
    }),
    new CleanWebpackPlugin(), // 清理输出目录
  ],

  // 开发服务器配置
  devServer: {
    static: './dist', // 提供 dist 目录下的静态文件
    open: true, // 自动打开浏览器
    hot: true, // 启用热模块替换
    compress: true, // 启用 gzip 压缩
    port: 9000, // 端口号
  },

  // 模块解析配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 设置路径别名
    },
    extensions: ['.js', '.json', '.jsx'], // 文件扩展名
    modules: [path.resolve(__dirname, 'node_modules')], // 模块查找路径
  },
};
```

### 配置说明

1. **入口文件**
   - `entry: './src/index.js'`：指定入口文件为 `src/index.js`。

2. **输出配置**
   - `output.filename: 'bundle.[contenthash].js'`：输出文件名为 `bundle.[contenthash].js`，`[contenthash]` 用于缓存控制。
   - `output.path: path.resolve(__dirname, 'dist')`：输出目录为 `dist`。
   - `output.clean: true`：自动清理输出目录。

3. **模式**
   - `mode: 'development'`：设置开发模式，启用开发工具和优化。

4. **加载器配置**
   - `module.rules`：定义加载器规则。
     - `babel-loader`：处理 JavaScript 文件，使用 `@babel/preset-env` 预设。
     - `style-loader` 和 `css-loader`：处理 CSS 文件。
     - `asset/resource`：处理图片和字体文件。

5. **插件配置**
   - `HtmlWebpackPlugin`：生成 HTML 文件，使用 `src/index.html` 作为模板。
   - `CleanWebpackPlugin`：清理输出目录。

6. **开发服务器配置**
   - `devServer`：提供本地开发服务器。
     - `static: './dist'`：提供 `dist` 目录下的静态文件。
     - `open: true`：自动打开浏览器。
     - `hot: true`：启用热模块替换。
     - `compress: true`：启用 gzip 压缩。
     - `port: 9000`：端口号为 9000。

7. **模块解析配置**
   - `resolve.alias`：设置路径别名，方便模块引用。
   - `resolve.extensions`：定义文件扩展名。
   - `resolve.modules`：定义模块查找路径。

通过上述配置，Webpack 可以高效地处理和打包前端项目中的各种资源文件，提高开发效率和代码质量。

