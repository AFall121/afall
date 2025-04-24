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