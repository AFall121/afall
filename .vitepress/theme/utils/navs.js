
import { dirname, join, basename,extname } from "path";
import { findUp } from "find-up-simple";
import { readdirSync, statSync } from "fs";

// const __dirname = dirname(join(__filename,'../../../'));
const __pkgPath = await findUp("package.json");
export const __rootDir = dirname(__pkgPath);
console.log("Current Module Path:", __pkgPath);
console.log("Current Directory:", __rootDir);

// 定义我们要生成的目录有哪些

const navRoots = [join(__rootDir, "notes"), join(__rootDir, "posts")];

 function getNavs(path){
  const navs = []
  if( isFileOrDir(path)==='dir'){
    console.log('dir-------------');
    const direArray =  readdirSync(path,{withFileTypes:true})
    if(direArray.length>0){
      const menu = {}
      menu.text = basename(path)
      // 非空目录才生成items
      menu.items = []
      for (let fileOrDir of direArray) {
        let fullPath = join(fileOrDir.parentPath,fileOrDir.name)
        // console.log('parentPath is '+ fileOrDir.parentPath);
        // console.log('name is'+ fileOrDir.name);
        console.log('fullPath is '+ fullPath);
        const items =  getNavs(fullPath)
        menu.items = menu.items.concat(items)
      }
      navs.push(menu)
    }
  }else if(isFileOrDir(path)==='file'){
    navs.push({
      text: basename(path).replace('/\.\w+$/',''),
      link: path.replace(__rootDir,"")
    })
  }
  return navs
}

console.log('path类型'+typeof navRoots[0]+'path 是'+ navRoots[0]);


const navs =  (roots) =>  roots.map(nav => getNavs(nav))

console.log(navs(navRoots));

// 通过路径判断是文件还是文件夹
 function isFileOrDir(path) {
  try {
    const stats =  statSync(path);
    if (stats.isFile()) {
      return "file";
    } else if (stats.isDirectory()) {
      return "dir";
    }
  } catch (err) {
    console.log(`判断该路径是文件还是目录时发生错误:${err}`);
  }
}
// test
const nRoots = ["notes", "posts"];
const newRoots = nRoots.map(root => join(__rootDir, root));
console.log(newRoots);
const nav = [
  { text: "Home", link: "/" },
  // { text: ''}
  // ... await navs(navRoots)
  ...navs(newRoots).flat(),
];
console.log(nav);
export default navs