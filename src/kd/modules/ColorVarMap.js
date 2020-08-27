/**
 * @description 需要替换的主题色变量配置文件
 * @description 公用文件, postcss插件和Theme.ts 都会用到
 */
/*
element ui 变量 定义
$--color-primary:  #409eff;
$--color-white:  #FFFFFF;
$--color-black:  #000000;
$--color-primary-light-1:  mix($--color-white, $--color-primary, 10%); // #53a8ff;
$--color-primary-light-2:  mix($--color-white, $--color-primary, 20%); // #66b1ff;
$--color-primary-light-3:  mix($--color-white, $--color-primary, 30%); // #79bbff;
$--color-primary-light-4:  mix($--color-white, $--color-primary, 40%); // #8cc5ff;
$--color-primary-light-5:  mix($--color-white, $--color-primary, 50%); // #a0cfff;
$--color-primary-light-6:  mix($--color-white, $--color-primary, 60%); // #b3d8ff;
$--color-primary-light-7:  mix($--color-white, $--color-primary, 70%); // #c6e2ff;
$--color-primary-light-8:  mix($--color-white, $--color-primary, 80%); // #d9ecff;
$--color-primary-light-9:  mix($--color-white, $--color-primary, 90%); // #ecf5ff;
$--slider-button-hover-color:  mix($--color-primary, $--color-black, 97%); // #3e99f7;
$--button-active-shade:  mix($--color-black, $--color-primary, 10%); // #3a8ee6;
*/

/**
 * @key 对应css变量名称
 * @property {string} color 给postcss替换颜色变量使用
 * @property {function} mix 给js运行时计算新的颜色使用，返回的数组就是sass mix函数接收的三个参数
 */
const var2color = {
  '--color-primary': {
    color: '#409eff',
    mix: primary => ['#ffffff', primary, 0]
  },
  '--color-primary-light-1': {
    color: '#53a8ff',
    mix: primary => ['#ffffff', primary, 0.1]
  },
  '--color-primary-light-2': {
    color: '#66b1ff',
    mix: primary => ['#ffffff', primary, 0.2]
  },
  '--color-primary-light-3': {
    color: '#79bbff',
    mix: primary => ['#ffffff', primary, 0.3]
  },
  '--color-primary-light-4': {
    color: '#8cc5ff',
    mix: primary => ['#ffffff', primary, 0.4]
  },
  '--color-primary-light-5': {
    color: '#a0cfff',
    mix: primary => ['#ffffff', primary, 0.5]
  },
  '--color-primary-light-6': {
    color: '#b3d8ff',
    mix: primary => ['#ffffff', primary, 0.6]
  },
  '--color-primary-light-7': {
    color: '#c6e2ff',
    mix: primary => ['#ffffff', primary, 0.7]
  },
  '--color-primary-light-8': {
    color: '#d9ecff',
    mix: primary => ['#ffffff', primary, 0.8]
  },
  '--color-primary-light-9': {
    color: '#ecf5ff',
    mix: primary => ['#ffffff', primary, 0.9]
  },
  '--slider-button-hover-color': {
    color: '#3e99f7',
    mix: primary => [primary, '#000000', 0.97]
  },
  '--button-active-shade': {
    color: '#3a8ee6',
    mix: primary => ['#000000', primary, 0.1]
  }
}
module.exports = {
  var2color
}
