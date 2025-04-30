---
outline: deep
---

# 常用命令

以下是关于 Git 在本地和远程端常用命令的详细说明，以及团队协作场景中的使用方法：

---

### 一、Git 常用命令分类

#### 1. **本地操作**
这些命令主要用于在本地仓库中初始化、提交和管理代码。

- **初始化仓库**
  - `git init`：在当前目录下初始化一个新的 Git 仓库。
    ```bash
    git init
    ```

- **查看状态**
  - `git status`：查看当前工作区的状态（如哪些文件被修改、未提交等）。
    ```bash
    git status
    ```

- **添加到暂存区**
  - `git add <file>`：将指定文件添加到暂存区。
  - `git add .`：将所有更改的文件添加到暂存区。
    ```bash
    git add file.txt
    git add .
    ```

- **提交到本地仓库**
  - `git commit -m "message"`：将暂存区的内容提交到本地仓库，并附带提交信息。
    ```bash
    git commit -m "Initial commit"
    ```

- **查看提交历史**
  - `git log`：查看提交历史记录。
  - `git log --oneline`：以简洁方式查看提交历史。
    ```bash
    git log
    git log --oneline
    ```
- **git reflog**
 - 用途: 记录对 HEAD 的所有引用更新操作的历史。
 - 内容: 包括但不限于提交、检出（checkout）、重置（reset）、合并（merge）等操作，记录了每一次 HEAD 指针的变化。
 - 范围: 不仅限于提交记录，还包括分支切换、重置等操作。
 - 适用场景: 当你误操作（如丢失了某些提交）时，可以通过 reflog 找回之前的提交状态。

- **分支管理**
  - `git branch`：列出所有分支。
  - `git branch <branch-name>`：创建新分支。
  - `git checkout <branch-name>`：切换到指定分支。
  - `git checkout -b <branch-name>`：创建并切换到新分支。
  - `git merge <branch-name>`：将指定分支合并到当前分支。
    ```bash
    git branch feature
    git checkout feature
    git merge main
    ```

- **撤销操作**
  - `git reset <file>`：从暂存区移除文件，但保留工作区的更改。
  - `git reset --hard`：撤销所有更改，恢复到最近一次提交的状态。
  - `git revert <commit-id>`：撤销某次提交，生成新的提交记录。
    ```bash
    git reset file.txt
    git reset --hard
    git revert abc1234
    ```

---

#### 2. **远程操作**
这些命令用于与远程仓库交互，包括推送代码、拉取更新等。

- **添加远程仓库**
  - `git remote add <name> <url>`：为本地仓库添加一个远程仓库。
    ```bash
    git remote add origin https://github.com/user/repo.git
    ```

- **查看远程仓库**
  - `git remote -v`：查看当前配置的远程仓库地址。
    ```bash
    git remote -v
    ```

- **推送代码**
  - `git push <remote> <branch>`：将本地分支推送到远程仓库。
    ```bash
    git push origin main
    ```

- **拉取代码**
  - `git pull <remote> <branch>`：从远程仓库拉取最新代码并合并到本地分支。
    ```bash
    git pull origin main
    ```

- **克隆远程仓库**
  - `git clone <url>`：克隆远程仓库到本地。
    ```bash
    git clone https://github.com/user/repo.git
    ```

---

### 二、团队协作场景

#### 1. **分支策略**
- **主分支（main/master）**：
  - 主分支用于存放稳定版本的代码，通常不直接在主分支上开发。
- **功能分支（feature branch）**：
  - 每个新功能或修复都会创建一个独立的功能分支进行开发。
- **发布分支（release branch）**：
  - 当需要准备发布时，从主分支创建发布分支，用于测试和修复问题。
- **热修复分支（hotfix branch）**：
  - 用于快速修复生产环境中的紧急问题。

#### 2. **协作流程**
1. **创建分支**
   - 开发者从主分支创建功能分支：
     ```bash
     git checkout -b feature/login
     ```
2. **开发与提交**
   - 在功能分支上完成开发后，提交代码：
     ```bash
     git add .
     git commit -m "Add login feature"
     ```
3. **推送分支**
   - 将功能分支推送到远程仓库：
     ```bash
     git push origin feature/login
     ```
4. **创建 Pull Request（PR）**
   - 在远程仓库（如 GitHub/GitLab）中创建 PR，请求将功能分支合并到主分支。
5. **代码审查**
   - 团队成员对 PR 进行代码审查，提出修改建议。
6. **合并分支**
   - 审查通过后，将功能分支合并到主分支：
     ```bash
     git checkout main
     git merge feature/login
     ```
7. **删除分支**
   - 合并完成后，删除功能分支：
     ```bash
     git branch -d feature/login
     git push origin --delete feature/login
     ```

#### 3. **解决冲突**
- 当多人同时修改同一文件时，可能会出现冲突。
- 解决步骤：
  1. 拉取最新代码：
     ```bash
     git pull origin main
     ```
  2. 手动编辑冲突文件，解决冲突。
  3. 标记冲突已解决并提交：
     ```bash
     git add <file>
     git commit -m "Resolve conflict"
     ```



---

### 详解 `git rebase` 的应用场景及示例

`git rebase` 是一个强大的工具，用于将一组提交应用到另一个分支的顶部。它可以帮助你保持提交历史的整洁和线性，便于代码审查和合并。以下是 `git rebase` 的一些常见应用场景及其示例：

#### 1. **保持分支同步**

当你在一个功能分支上工作时，主分支可能会有新的提交。为了确保你的功能分支基于最新的主分支，你可以使用 `git rebase` 将你的提交应用到主分支的最新提交之上。

**示例：**

假设你在 `feature/login` 分支上工作，而 `main` 分支有了新的提交。你可以这样做：

```bash
# 切换到 feature/login 分支
git checkout feature/login

# 从 main 分支拉取最新的提交
git fetch origin main

# 将 feature/login 分支的提交 rebase 到 main 分支的最新提交之上
git rebase origin/main
```

#### 2. **清理提交历史**

在合并分支之前，你可以使用 `git rebase` 来整理你的提交历史，使其更加清晰和易于理解。你可以将多个小的、相关的提交合并成一个大的提交，或者重新排序提交的顺序。

**示例：**

假设你在 `feature/login` 分支上有多个提交，你想将它们合并成一个提交：

```bash
# 切换到 feature/login 分支
git checkout feature/login

# 交互式 rebase 最近的 3 个提交
git rebase -i HEAD~3
```

在打开的编辑器中，你可以将多个提交合并成一个，或者重新排序提交的顺序。

#### 3. **解决冲突**

在 `git rebase` 过程中，如果出现冲突，你可以解决冲突并继续 rebase 过程。

**示例：**

假设你在 `feature/login` 分支上 rebase `main` 分支时出现了冲突：

```bash
# 切换到 feature/login 分支
git checkout feature/login

# 从 main 分支拉取最新的提交
git fetch origin main

# 将 feature/login 分支的提交 rebase 到 main 分支的最新提交之上
git rebase origin/main
```

如果出现冲突，Git 会暂停 rebase 过程并提示你解决冲突。解决冲突后，你可以继续 rebase：

```bash
# 标记冲突已解决
git add <file>

# 继续 rebase 过程
git rebase --continue
```

#### 4. **更新 Pull Request**

如果你在一个功能分支上工作，并且已经创建了一个 Pull Request，而主分支有了新的提交，你可以使用 `git rebase` 来更新你的 Pull Request，使其基于最新的主分支。

**示例：**

假设你在 `feature/login` 分支上工作，并且已经创建了一个 Pull Request。主分支有了新的提交，你可以这样做：

```bash
# 切换到 feature/login 分支
git checkout feature/login

# 从 main 分支拉取最新的提交
git fetch origin main

# 将 feature/login 分支的提交 rebase 到 main 分支的最新提交之上
git rebase origin/main

# 推送更新后的分支到远程仓库
git push origin feature/login --force
```

使用 `git rebase` 可以帮助你保持提交历史的整洁和线性，便于代码审查和合并。希望这些示例能帮助你更好地理解和使用 `git rebase`。

---------
比较 git branch 和 git tag
为了更好地理解 git branch 和 git tag 的区别和用途，我们可以将它们的主要特性和应用场景形成一个表格进行对比。

当然，以下是将 `git branch` 和 `git tag` 的比较信息转换成表格的形式：

### 比较 `git branch` 和 `git tag`

| 特性/用途         | `git branch`                                      | `git tag`                                      |
|-------------------|---------------------------------------------------|------------------------------------------------|
| **定义**          | 用于创建、列出、删除和切换分支。                  | 用于给特定的提交打上标签，标记版本或里程碑。   |
| **类型**          | 分支是活动的工作线，可以随时切换和合并。          | 标签可以是轻量标签（仅包含引用）或附注标签（包含更多信息）。 |
| **用途**          | 支持并行开发，每个分支可以独立进行开发和测试。      | 标记发布版本，便于版本管理和回滚到特定版本。   |
| **创建命令**      | `git branch <branch-name>`                        | `git tag <tag-name>`（轻量标签）<br>`git tag -a <tag-name> -m "message"`（附注标签） |
| **查看命令**      | `git branch`                                      | `git tag`                                      |
| **查看详细信息**  | `git log <branch-name>`                           | `git show <tag-name>`                          |
| **切换命令**      | `git checkout <branch-name>`                      | 不能直接切换到标签，但可以基于标签创建分支：<br>`git checkout -b <new-branch-name> <tag-name>` |
| **删除命令**      | `git branch -d <branch-name>`                     | `git tag -d <tag-name>`                        |
| **推送命令**      | `git push <remote> <branch-name>`                 | `git push origin <tag-name>`（单个标签）<br>`git push origin --tags`（所有标签） |
| **删除远程命令**  | `git push origin --delete <branch-name>`            | `git push origin --delete <tag-name>`            |
| **应用场景**      | 并行开发、功能分支、发布分支、热修复分支等。      | 版本标记、里程碑标记、回滚版本等。 |

**假设你已经找到一个特定的提交哈希值 `abc1234`，并且想要标记这个提交为 v1.0 **
```bash
git tag -a v1.0 abc1234 -m "Release version 1.0"
```
这个表格清晰地展示了 `git branch` 和 `git tag` 的主要特性和应用场景，便于理解和比较。

-------

当然可以！下面是一个公司开发大型项目时使用 Git 的流程图。这个流程图涵盖了从初始化仓库到最终发布和维护的整个过程。为了更好地展示，我将使用 Markdown 的文本格式来绘制流程图。你可以将这个文本复制到支持 Markdown 的编辑器中查看效果。

### 公司开发大型项目时使用 Git 的流程图

```markdown
```mermaid
graph TD;
    A[初始化仓库] --> B[创建主分支 (main/master)];
    B --> C[创建开发分支 (develop)];
    C --> D[开发者从 develop 分支创建功能分支 (feature/xxx)];
    D --> E[在功能分支上开发];
    E --> F[提交代码到功能分支];
    F --> G[推送功能分支到远程仓库];
    G --> H[创建 Pull Request (PR)];
    H --> I[代码审查];
    I --> J[解决代码审查中的问题];
    J --> K[重新提交代码];
    K --> L[合并 PR 到 develop 分支];
    L --> M[删除功能分支];
    M --> N[创建发布分支 (release/xxx)];
    N --> O[在发布分支上进行测试和修复];
    O --> P[提交测试和修复];
    P --> Q[推送发布分支到远程仓库];
    Q --> R[创建 PR 从 release/xxx 到 main];
    R --> S[代码审查];
    S --> T[解决代码审查中的问题];
    T --> U[重新提交代码];
    U --> V[合并 PR 到 main];
    V --> W[创建标签 (v1.0)];
    W --> X[推送标签到远程仓库];
    X --> Y[发布版本];
    Y --> Z[删除发布分支];
    Z --> AA[监控和维护];
    AA --> AB[创建热修复分支 (hotfix/xxx)];
    AB --> AC[在热修复分支上开发];
    AC --> AD[提交代码到热修复分支];
    AD --> AE[推送热修复分支到远程仓库];
    AE --> AF[创建 PR 从 hotfix/xxx 到 main];
    AF --> AG[代码审查];
    AG --> AH[解决代码审查中的问题];
    AH --> AI[重新提交代码];
    AI --> AJ[合并 PR 到 main];
    AJ --> AK[创建标签 (v1.0.1)];
    AK --> AL[推送标签到远程仓库];
    AL --> AM[发布热修复版本];
    AM --> AN[删除热修复分支];
    AN --> AA;
```
```

### 解释

1. **初始化仓库**：创建一个新的 Git 仓库。
2. **创建主分支 (main/master)**：主分支用于存放稳定版本的代码。
3. **创建开发分支 (develop)**：开发分支用于日常开发和集成。
4. **开发者从 develop 分支创建功能分支 (feature/xxx)**：每个新功能或修复都会创建一个独立的功能分支。
5. **在功能分支上开发**：开发者在功能分支上进行开发工作。
6. **提交代码到功能分支**：将开发的代码提交到功能分支。
7. **推送功能分支到远程仓库**：将功能分支推送到远程仓库。
8. **创建 Pull Request (PR)**：在远程仓库中创建 PR，请求将功能分支合并到 develop 分支。
9. **代码审查**：团队成员对 PR 进行代码审查，提出修改建议。
10. **解决代码审查中的问题**：根据代码审查的反馈，解决存在的问题。
11. **重新提交代码**：将修改后的代码重新提交到功能分支。
12. **合并 PR 到 develop 分支**：审查通过后，将功能分支合并到 develop 分支。
13. **删除功能分支**：合并完成后，删除功能分支。
14. **创建发布分支 (release/xxx)**：当需要准备发布时，从 develop 分支创建发布分支。
15. **在发布分支上进行测试和修复**：在发布分支上进行测试和必要的修复。
16. **提交测试和修复**：将测试和修复的代码提交到发布分支。
17. **推送发布分支到远程仓库**：将发布分支推送到远程仓库。
18. **创建 PR 从 release/xxx 到 main**：在远程仓库中创建 PR，请求将发布分支合并到 main 分支。
19. **代码审查**：团队成员对 PR 进行代码审查，提出修改建议。
20. **解决代码审查中的问题**：根据代码审查的反馈，解决存在的问题。
21. **重新提交代码**：将修改后的代码重新提交到发布分支。
22. **合并 PR 到 main**：审查通过后，将发布分支合并到 main 分支。
23. **创建标签 (v1.0)**：在 main 分支上创建版本标签。
24. **推送标签到远程仓库**：将标签推送到远程仓库。
25. **发布版本**：将版本发布到生产环境。
26. **删除发布分支**：合并完成后，删除发布分支。
27. **监控和维护**：监控生产环境，处理紧急问题。
28. **创建热修复分支 (hotfix/xxx)**：用于快速修复生产环境中的紧急问题。
29. **在热修复分支上开发**：开发者在热修复分支上进行开发工作。
30. **提交代码到热修复分支**：将开发的代码提交到热修复分支。
31. **推送热修复分支到远程仓库**：将热修复分支推送到远程仓库。
32. **创建 PR 从 hotfix/xxx 到 main**：在远程仓库中创建 PR，请求将热修复分支合并到 main 分支。
33. **代码审查**：团队成员对 PR 进行代码审查，提出修改建议。
34. **解决代码审查中的问题**：根据代码审查的反馈，解决存在的问题。
35. **重新提交代码**：将修改后的代码重新提交到热修复分支。
36. **合并 PR 到 main**：审查通过后，将热修复分支合并到 main 分支。
37. **创建标签 (v1.0.1)**：在 main 分支上创建热修复版本标签。
38. **推送标签到远程仓库**：将标签推送到远程仓库。
39. **发布热修复版本**：将热修复版本发布到生产环境。
40. **删除热修复分支**：合并完成后，删除热修复分支。
41. **返回监控和维护**：继续监控生产环境，处理紧急问题。

你可以将上述 Markdown 文本复制到支持 Mermaid 的编辑器中（如 VS Code 配合 Mermaid 插件、GitHub 等）来查看流程图。希望这个流程图能帮助你更好地理解公司在开发大型项目时如何使用 Git。

---

```
当然可以！以下是 Git 配置文件的位置和作用的总结，以表格形式列出：

### Git 配置文件的位置和作用

| 配置文件类型       | 位置                                      | 作用                                                                 |
|--------------------|-------------------------------------------|----------------------------------------------------------------------|
| **系统级配置文件** | `/etc/gitconfig` 或 `C:\ProgramData\Git\config` (Windows) | 影响所有用户和所有仓库。通常由系统管理员管理。                     |
| **全局配置文件**   | `~/.gitconfig` 或 `C:\Users\<YourUsername>\.gitconfig` (Windows) | 影响当前用户的所有仓库。通常由用户自己管理。                         |
| **本地配置文件**   | `<repository>/.git/config`                | 影响特定仓库。通常由仓库的开发者管理。                               |




### 详细说明

1. **系统级配置文件**
   - **位置**：
     - Linux/Mac: `/etc/gitconfig`
     - Windows: `C:\ProgramData\Git\config`
   - **作用**：系统级配置文件影响所有用户和所有仓库。通常由系统管理员管理，设置一些全局性的配置，如默认的文本编辑器、默认的合并工具等。

2. **全局配置文件**
   - **位置**：
     - Linux/Mac: `~/.gitconfig`
     - Windows: `C:\Users\<YourUsername>\.gitconfig`
   - **作用**：全局配置文件影响当前用户的所有仓库。通常由用户自己管理，设置一些个人化的配置，如用户名、邮箱、别名等。

3. **本地配置文件**
   - **位置**：`<repository>/.git/config`
   - **作用**：本地配置文件影响特定仓库。通常由仓库的开发者管理，设置一些特定于该仓库的配置，如远程仓库的 URL、特定的钩子脚本等。

### 示例

#### 系统级配置文件 (`/etc/gitconfig` 或 `C:\ProgramData\Git\config`)

```ini
[user]
    name = System Admin
    email = admin@example.com
[core]
    autocrlf = input
```

#### 全局配置文件 (`~/.gitconfig` 或 `C:\Users\<YourUsername>\.gitconfig`)

```ini
[user]
    name = John Doe
    email = john.doe@example.com
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
[core]
    autocrlf = input
```

#### 本地配置文件 (`<repository>/.git/config`)

```ini
[remote "origin"]
    url = https://github.com/user/repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
    remote = origin
    merge = refs/heads/main
```

通过这些配置文件，你可以灵活地管理和定制 Git 的行为，以适应不同的开发环境和需求。