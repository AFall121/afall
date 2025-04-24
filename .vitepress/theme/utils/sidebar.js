import { readdirSync, statSync } from "node:fs";
import { join,extname } from "node:path";
import { findUpSync } from "find-up-simple";

const EXCLUDEDIRS = [".vitepress", "node_modules", "public"];
const EXCLUDEFILES = ["index", "README","package-lock","package","api-examples","markdown-examples"];

function filterFiles(dir){
  let files = readdirSync(dir, { withFileTypes: true });
  if (files.length > 0) {
    files = files.filter((file) => {
      let fileName = file.name.replace(extname(file.name),'')
      if (EXCLUDEDIRS.includes(fileName) || EXCLUDEFILES.includes(fileName)) {
        return false;
      }else{
        return true
      }
    });
  }
  return files;
}
function getBarForArry(dir, baseDir) {
  const result = [];
  let files = filterFiles(dir)
  if (files.length > 0) {
    files.forEach((file) => {
      try {
        const fullPath = join(dir, file.name);
        const stats = statSync(fullPath);
        let fileName = file.name.replace(extname(file.name),'')
        if (stats.isDirectory() === true) {
          result.push({ text: fileName, collapsed: false,items: getBarForArry(fullPath, baseDir) });
        } else if (stats.isFile() === true) {
          result.push({ text: fileName, link: fullPath.replace(baseDir.slice(0,-1), "") });
        }
      } catch (err) {
        console.error("error", err);
      }
    });
  }
  return result;
}

const dir = join(findUpSync("package.json", "file"), "../");
// console.log(dir);

// console.log(getBarForArry(dir, dir));

// 当在某个目录下时用该目录的侧边栏
function getBarForGroup(dir, baseDir) {
  const result = {}
  let files = filterFiles(dir)
    files.forEach((file) => {
      try {
        const fullPath = join(dir, file.name);
        const stats = statSync(fullPath);
        if (stats.isDirectory() === true) {
          result[`/${file.name}/`] = [
            {
              text: file.name, 
              collapsed: false,
              items: getBarForArry(fullPath, baseDir)
            }
          ]
        } else if (stats.isFile() === true) {
          // 这里的else if 完全可以去掉,因为我遍历的dir下只需要目录....
        }
      } catch (err) {
        console.error("error", err);
      }
    });
  return result;
}
export const barForGroup = getBarForGroup(dir,dir)
console.log('barForGroup:',barForGroup);


export default getBarForArry(dir, dir)
/*
getBarForGroup(dir, baseDir)
├── 初始化 result = {}
├── 调用 filterFiles(dir)
│   └── 获取过滤后的文件列表 files
├── 遍历 files
│   ├── 检查 stats.isDirectory()
│   │   ├── 如果是目录
│   │   │   ├── 调用 getBarForArry(fullPath, baseDir)
│   │   │   ├── 构建子项对象 { text, collapsed, items }
│   │   │   └── 添加到 result 中，键名为 /${file.name}/
│   │   └── 如果是文件
│   │       └── 忽略
│   └── 下一项
└── 返回 result

getBarForArry(dir, baseDir)
├── 初始化 result = []
├── 调用 filterFiles(dir)
│   └── 获取过滤后的文件列表 files
├── 遍历 files
│   ├── 检查 stats.isDirectory()
│   │   ├── 如果是目录
│   │   │   ├── 调用 getBarForArry(fullPath, baseDir)
│   │   │   ├── 构建子项对象 { text, collapsed, items }
│   │   │   └── 添加到 result 中
│   │   └── 如果是文件
│   │       ├── 构建文件对象 { text, link }
│   │       └── 添加到 result 中
│   └── 下一项
└── 返回 result
*/