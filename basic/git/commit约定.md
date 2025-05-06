---
outline: deep
---
# 约定大于配置

在团队协作开发中，遵循统一的 Git 提交约定有助于提高代码可读性、方便版本回溯和自动化生成变更日志。以下是常用的 Git 提交约定规范：

### 1. 提交信息结构
一个标准的提交信息应包括以下三个部分（以空行分隔）：

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### 示例：
```text
feat(auth): add password strength meter

Add real-time validation for password strength during registration.
Improve UX by giving immediate feedback.

Fix #1234
```

---

### 2. Type（类型）
`type` 表示本次提交的类型，建议使用以下值：

| 类型       | 含义说明                             |
|------------|--------------------------------------|
| `feat`     | 新功能（feature）                    |
| `fix`      | 修复 bug                             |
| `chore`    | 构建流程或辅助工具的变动             |
| `docs`     | 文档更新                             |
| `style`    | 格式调整（如缩进、空格、不影响逻辑） |
| `refactor` | 代码重构（不涉及功能变化）           |
| `perf`     | 性能优化                             |
| `test`     | 增加或修改测试                       |
| [build](file://d:\code\my-theme\node_modules\esbuild\bin\esbuild)    | 构建系统或依赖更改                   |
| `ci`       | CI 配置相关更改                      |
| `revert`   | 回滚某个 commit                      |

---

### 3. Scope（可选）
用于指定本次更改影响的范围，例如模块名、组件名等。可以省略。

示例：`auth`, `router`, `store`, `utils`

---

### 4. Subject（简要描述）
- 简洁明了地描述做了什么。
- 使用首字母大写，不以句号结尾。
- 使用现在时或过去时均可，但保持统一。

---

### 5. Body（详细描述，可选）
- 更详细地说明本次更改的内容。
- 可以包括背景、动机、实现方式等。
- 每行不超过 72 个字符。

---

### 6. Footer（页脚，可选）
- 关联 issue 或 PR，如 `Fix #1234`、`Close #5678`
- 如果是重大变更（breaking change），应在此注明，并说明迁移方式。

---

### 7. 推荐工具
- [commitlint](https://github.com/conventional-changelog/commitlint)：校验提交格式是否符合规范。
- [husky](https://github.com/typicode/husky)：Git hooks 工具，可用于在提交前自动检查 commit message。

---

### 8. 参考规范
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

如果你正在使用 Vue、React、Node.js 等项目，这些规范同样适用，并且可以结合 `lint-staged` + `prettier` + `eslint` 实现自动格式化与校验。