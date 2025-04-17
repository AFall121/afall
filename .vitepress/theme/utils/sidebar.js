import { readdirSync, statSync } from "node:fs";
import { join,extname } from "node:path";
import { findUpSync } from "find-up-simple";

const EXCLUDEDIRS = [".vitepress", "node_modules", "public"];
const EXCLUDEFILES = ["index", "README","package-lock","package","api-examples","markdown-examples"];
function getBarForArry(dir, baseDir) {
  const result = [];
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

    files.forEach((file) => {
      try {
        const fullPath = join(dir, file.name);
        const stats = statSync(fullPath);
        if (stats.isDirectory() === true) {
          result.push({ text: file.name, collapsed: false,items: getBarForArry(fullPath, baseDir) });
        } else if (stats.isFile() === true) {
          result.push({ text: file.name, link: fullPath.replace(baseDir.slice(0,-1), "") });
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

    files.forEach((file) => {
      try {
        const fullPath = join(dir, file.name);
        const stats = statSync(fullPath);
        if (stats.isDirectory() === true) {
          // result.push({ text: '/'+file.name+'/', items: getBarForGroup(fullPath, baseDir) });
          result[`/${file.name}/`] = [
            {
              text: file.name, 
              collapsed: false,
              items: getBarForArry(fullPath, baseDir)
            }
          ]
        } else if (stats.isFile() === true) {
          // result.push({ text: file.name, link: fullPath.replace(baseDir.slice(0,-1), "") });
        }
      } catch (err) {
        console.error("error", err);
      }
    });
  }
  return result;
}
export const barForGroup = getBarForGroup(dir,dir)
console.log('barForGroup:',barForGroup);


export default getBarForArry(dir, dir)
