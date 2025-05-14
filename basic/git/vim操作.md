# Vim 操作命令


以下是一些常用的 Vim 操作命令，适用于在 **Vim 编辑器** 中进行快速编辑、导航和保存操作：

### 1. 进入/退出 Vim
- `vim filename`：打开文件。
- `:q`：退出（如果未修改）。
- `:q!`：强制退出且不保存修改。
- `:wq`：保存并退出。

### 2. 插入模式（用于输入文本）
- `i`：在光标前插入。
- `a`：在光标后插入。
- `I`：在行首插入。
- `A`：在行尾插入。
- `o`：在当前行下方新建一行并进入插入模式。
- `O`：在当前行上方新建一行并进入插入模式。

### 3. 移动光标
- `h`：左移一个字符。
- `j`：下移一行。
- `k`：上移一行。
- `l`：右移一个字符。
- `0`：移动到行首。
- `$`：移动到行尾。
- `G`：跳转到文件末尾。
- `gg`：跳转到文件开头。
- `nG`：跳转到第 n 行。

### 4. 删除与撤销
- `x`：删除当前光标下的字符。
- `dd`：删除整行。
- `dw`：删除一个单词。
- `d$`：从光标处删除至行尾。
- `u`：撤销上一次操作。
- `Ctrl + r`：重做上一次撤销的操作。

### 5. 复制与粘贴
- `yy`：复制当前行。
- `yw`：复制一个单词。
- `p`：在光标后粘贴。
- `P`：在光标前粘贴。

### 6. 查找与替换
- `/pattern`：向下查找 `pattern`。
- `?pattern`：向上查找 `pattern`。
- `n`：继续查找下一个匹配项。
- `N`：反向继续查找。
- `:s/old/new`：替换当前行第一个匹配的 `old` 为 `new`。
- `:%s/old/new/g`：全局替换所有匹配项。

### 7. 其他常用命令
- `.`：重复上一次更改操作。
- `r`：替换当前光标下的单个字符。
- `R`：进入替换模式（覆盖原有内容）。 - `v`：进入字符选择模式。 - `V`：进入行选择模式。 - `Ctrl + [ ` 或 `Esc`：退出插入模式回到正常模式。



明白了！以下是一份 **Vim 操作口诀表**，用简短的语句帮你记忆常用操作：

| 口诀 | 命令 | 含义 |
|------|------|------|
| 打开文件写代码 | `vim filename` | 打开指定文件 |
| 退出不改别留恋 | `:q` | 未修改时退出 |
| 强退不存加感叹 | `:q!` | 不保存强制退出 |
| 存盘退出用 `wq` | `:wq` | 保存并退出 |

| 插入模式记清楚 |  | 进入编辑状态 |
|----------------|---|-------------|
| 光标前插按 `i` | `i` | 在光标前插入 |
| 光标后插按 `a` | `a` | 在光标后插入 |
| 行首插入用 `I` | `I` | 快速在行首插入 |
| 行尾插入用 `A` | `A` | 快速在行尾插入 |
| 下一行插入按 [o](file://d:\code\my-theme\node_modules\estree-walker\types\tsconfig.tsbuildinfo) | [o](file://d:\code\my-theme\node_modules\estree-walker\types\tsconfig.tsbuildinfo) | 当前行下新建行并插入 |
| 上一行插入按 `O` | `O` | 当前行上新建行并插入 |

| 光标移动靠方向 |  | 控制你的位置 |
|----------------|---|-------------|
| 左 `h`、下 `j`、上 [k](file://d:\code\my-theme\node_modules\lodash-es\flake.lock)、右 [l](file://d:\code\my-theme\node_modules\@iconify\types\pnpm-lock.yaml) | `h j k l` | 四个方向键替代方向键 |
| 行首快到按 `0`（零） | `0` | 移动到当前行开头 |
| 行尾快到按 `$` | `$` | 移动到当前行末尾 |
| 文件头用 `gg` | `gg` | 跳转到文件开头 |
| 文件尾用 `G` | `G` | 跳转到文件末尾 |
| 指定行跳用 `nG` | `nG` | 跳转到第 n 行 |

| 删除撤销要熟练 |  | 修改和恢复 |
|----------------|---|-----------|
| 单字符删用 [x](file://d:\code\my-theme\node_modules\lodash-es\flake.nix) | [x](file://d:\code\my-theme\node_modules\lodash-es\flake.nix) | 删除当前字符 |
| 整行删除按 `dd` | `dd` | 删除当前行 |
| 删除单词按 `dw` | `dw` | 删除一个单词 |
| 删到行尾用 `d$` | `d$` | 从光标处删除到行尾 |
| 撤销一步按 `u` | `u` | 撤销上一次操作 |
| 重做一步 `Ctrl + r` | `Ctrl + r` | 重做被撤销的操作 |

| 复制粘贴很简单 |  | 拷贝和粘贴 |
|----------------|---|-----------|
| 复制整行按 `yy` | `yy` | 复制当前行 |
| 复制单词按 `yw` | `yw` | 复制一个单词 |
| 粘贴内容按 [p](file://d:\code\my-theme\node_modules\@algolia\client-abtesting\dist\builds\fetch.js.map) | [p](file://d:\code\my-theme\node_modules\@algolia\client-abtesting\dist\builds\fetch.js.map) | 在光标后粘贴 |
| 粘贴内容前用 `P` | `P` | 在光标前粘贴 |

| 查找替换有技巧 |  | 搜索与替换 |
|----------------|---|-----------|
| 向下查 `/pattern` | `/pattern` | 查找 pattern |
| 向上查 `?pattern` | `?pattern` | 反向查找 pattern |
| 查下一个按 [n](file://d:\code\my-theme\node_modules\@algolia\client-common\package.json) | [n](file://d:\code\my-theme\node_modules\@algolia\client-common\package.json) | 继续查找匹配项 |
| 查上一个按 `N` | `N` | 反向继续查找 |
| 替换单次 `:s/old/new` | `:s/old/new` | 替换当前行第一个匹配项 |
| 全部替换 `:%s/old/new/g` | `:%s/old/new/g` | 替换全文所有匹配项 |

| 其他命令记心头 |  | 小技巧 |
|----------------|---|--------|
| 重复操作用 [.](file://d:\code\my-theme\basic\git\vim操作.md) | [.](file://d:\code\my-theme\basic\git\vim操作.md) | 重复上一次更改 |
| 替换单字按 [r](file://d:\code\my-theme\node_modules\katex\src\fonts\makeBlacker) | [r](file://d:\code\my-theme\node_modules\katex\src\fonts\makeBlacker) | 替换当前字符 |
| 进入替换按 `R` | `R` | 进入覆盖模式 |
| 字符选择用 `v` | `v` | 进入字符选中模式 |
| 整行选择用 `V` | `V` | 进入行选中模式 |
| 退出编辑按 `Esc` 或 `Ctrl+[ ` | `Esc` / `Ctrl+[ ` | 返回正常模式 |


