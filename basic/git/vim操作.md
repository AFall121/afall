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
- [o](file://d:\code\my-theme\node_modules\estree-walker\types\tsconfig.tsbuildinfo)：在当前行下方新建一行并进入插入模式。
- `O`：在当前行上方新建一行并进入插入模式。

### 3. 移动光标
- `h`：左移一个字符。
- `j`：下移一行。
- [k](file://d:\code\my-theme\node_modules\lodash-es\flake.lock)：上移一行。
- [l](file://d:\code\my-theme\node_modules\@iconify\types\pnpm-lock.yaml)：右移一个字符。
- `0`：移动到行首。
- `$`：移动到行尾。
- `G`：跳转到文件末尾。
- `gg`：跳转到文件开头。
- `nG`：跳转到第 n 行。

### 4. 删除与撤销
- [x](file://d:\code\my-theme\node_modules\lodash-es\flake.nix)：删除当前光标下的字符。
- `dd`：删除整行。
- `dw`：删除一个单词。
- `d$`：从光标处删除至行尾。
- `u`：撤销上一次操作。
- `Ctrl + r`：重做上一次撤销的操作。

### 5. 复制与粘贴
- `yy`：复制当前行。
- `yw`：复制一个单词。
- [p](file://d:\code\my-theme\node_modules\@algolia\client-abtesting\dist\builds\fetch.js.map)：在光标后粘贴。
- `P`：在光标前粘贴。

### 6. 查找与替换
- `/pattern`：向下查找 `pattern`。
- `?pattern`：向上查找 `pattern`。
- [n](file://d:\code\my-theme\node_modules\@algolia\client-common\package.json)：继续查找下一个匹配项。
- `N`：反向继续查找。
- `:s/old/new`：替换当前行第一个匹配的 `old` 为 `new`。
- `:%s/old/new/g`：全局替换所有匹配项。

### 7. 其他常用命令
- [.](file://d:\code\my-theme\basic\git\vim操作.md)：重复上一次更改操作。
- [r](file://d:\code\my-theme\node_modules\katex\src\fonts\makeBlacker)：替换当前光标下的单个字符。
- `R`：进入替换模式（覆盖原有内容）。
- `v`：进入字符选择模式。
- `V`：进入行选择模式。
- `Ctrl + [ ` 或 `Esc`：退出插入模式回到正常模式。

这些命令可以帮助你更高效地使用 Vim。熟练掌握后，可以显著提升代码编辑速度！