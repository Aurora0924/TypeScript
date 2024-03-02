# 一、TypeScrip练习-贪吃蛇游戏准备

创建tsconfig.json文件，目的将TypeScript转换为JavaScript代码。文件代码如下：

```jsx
{
  "compilerOptions": {
    "module": "es6",
    "target": "es6",
    "strict": true,
    "noEmitOnError": true
  }
}
```

创建package.json包配置文件，使用webpack进行打包

```jsx
{
  "name": "ts-snake",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "webpack serve --open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.18.9",
    "@babel/preset-env": "^7.18.9",
    "babel-loader": "^8.2.5",
    "clean-webpack-plugin": "^4.0.0",
    "core-js": "^3.24.0",
    "css-loader": "^6.7.1",
    "html-webpack-plugin": "^5.5.0",
    "less": "^4.1.3",
    "less-loader": "^11.0.0",
    "postcss": "^8.4.14",
    "postcss-loader": "^7.0.1",
    "postcss-preset-env": "^7.7.2",
    "style-loader": "^3.3.1",
    "ts-loader": "^9.3.1",
    "typescript": "^4.7.4",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.9.3"
  }
}
```

集成终端中输入指令npm i -D webpack webpack-cli typescript ts-loader用来下载相关依赖(如果可以看见package.json的depDependencies中更新了你下载的依赖表示下载成功)。继续输入指令npm i -D css-loader 等依赖，然后进行webpackconfig.js打包工具的配置,代码如下：

```jsx
// 引入一个包
const path = require('path');
// 引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin');
// 引入clean插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// webpack中的所有的配置信息都应该写在module.exports中
module.exports = {

    // 指定入口文件
    entry: "./src/index.ts",

    // 指定打包文件所在目录
    output: {
        // 指定打包文件的目录
        path: path.resolve(__dirname, 'dist'),
        // 打包后文件的文件
        filename: "bundle.js",

        // 告诉webpack不使用箭头,不使用const
        environment:{
            arrowFunction: false,
            const:false
        }
    },

    // 指定webpack打包时要使用模块
    module: {
        // 指定要加载的规则
        rules: [
            {
                // test指定的是规则生效的文件
                test: /\.ts$/,
                // 要使用的loader
                use: [
                     // 配置babel
                     {
                         // 指定加载器
                         loader:"babel-loader",
                         // 设置babel
                         options: {
                             // 设置预定义的环境
                             presets:[
                                 [
                                     // 指定环境的插件
                                     "@babel/preset-env",
                                     // 配置信息
                                     {
                                         // 要兼容的目标浏览器
                                         targets:{
                                             "chrome":"58",
                                             "ie":"11"
                                         },
                                         // 指定corejs的版本
                                         "corejs":"3",
                                         // 使用corejs的方式 "usage" 表示按需加载
                                         "useBuiltIns":"usage"
                                     }
                                 ]
                             ]
                         }
                     },
                    'ts-loader'
                ],
                // 要排除的文件
                exclude: /node-modules/
            },
            //设置less文件的处理
            {
                test:/\.less$/,
                use:[
                    //顺序从下往上执行
                    "style-loader",
                    "css-loader",
                    //这里的配置是把css处理成具备兼容性的css(如加上前缀的)
                    {
                        loader:"postcss-loader",
                        options:{
                            postcssOptions:{
                                plugins:[
                                    [
                                        "postcss-preset-env",
                                        {
                                            browers:'last 4 versions',//兼容两个浏览器版本
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    "less-loader",
                ]
            }
        ]
    },

    // 配置Webpack插件
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            // title: "这是一个自定义的title"
            template: "./src/index.html"
        }),
    ],

    // 用来设置引用模块
    resolve: {
        extensions: ['.ts', '.js']
    }

};
```

# 二、贪吃蛇项目结构搭建

首先进行页面和css的搭建，代码如下：

```jsx
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>贪吃蛇</title>
</head>
<body>
    <!-- 创建邮游戏的主窗口 -->
    <div id="main">
       <!-- 设置游戏的舞台 -->
       <div id="stage">
        <!-- 设置蛇 -->
        <div id="snake">
            <!-- snake内部的div 表示蛇的各部分-->
            <div></div>
        </div>
        <!-- 设置食物 -->
        <div id="food">
            <!-- 设置四个小div来设置食物的样式 -->
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <!-- 设置计分盘 -->
    <div id="score-panel">
        <div> 
            SCORE:<span id="score">0</span>
        </div>
        <div>
            level:<span id="level">1</span>
        </div>
    </div>
</div>
</body>
</html>
```

less文件如下：

```less
//设置变量
@bg-color:#b7d4a8;

//清除默认样式
*{
    padding: 0;
    margin: 0;
    //改变盒子模型的计算方法
    box-sizing: border-box;
}
body{
    font:bold 20px "Courier";
}
//设置主窗口的样式
#main{
    width: 360px;
    height: 420px;
    //设置背景颜色
    background-color: @bg-color;
    //设置居中
    margin:100px auto;
    border:10px solid black;
    //设置圆角
    border-radius:20px;
    //开启弹性盒模式
    display: flex;
    //设置主轴方向，自上而下
    flex-flow: column;
    //设置主轴的对齐方向
    justify-content: space-around;
    //设置侧轴的对齐方式
    align-items: center;
    
    //游戏的舞台
    #stage{
        width:304px;
        height:304px;
        border: 2px solid black;
        //开启相对定位
        position: relative;
        //设置蛇的样式 注意这里设置的是snake里面的div的样式
        #snake{
            &>div{
            width: 10px;
            height: 10px;
            background-color: black;
            // margin-right: 2px;
            //这里为蛇的身体设置一个边框，目的是为了让蛇的每一段分开，
            //由于边框的背景颜色和舞台的背景颜色一样，所以我们看到的蛇是一段段的
            border: 1px solid @bg-color;
            //开启绝对定位,因为蛇的移动要有参照物
            position: absolute;
            }
            //蛇头是红色的，便于区分
			 &>div:first-child{
                background-color: red;
            }
        }
       #food{
            width: 10px;
            height: 10px;
            border: 1px solid @bg-color;
            position: absolute;
            left: 40px;
            top:100px;
            display: flex;
            //设置横轴为主轴，warp表示自动换行
            flex-flow: row wrap;
            justify-content: space-between;
            align-content: space-between;
            
            &>div{
                width: 4px;
                height: 4px;
                background-color: black;
                //使四个div旋转45°
                transform: rotate(45deg);
            }

        }
    }
    //积分盘
    #score-panel{
        width: 300px;
        display: flex;
        //设置主轴的对齐方法
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
    }
}
```

# 三、完成Food类

首先要明确类中有哪些属性和方法

1. 因为是食物，所以要获取食物对应的元素
2. 因为食物的位置是变化的，所以需要获取食物的坐标，以及需要有改变食物位置的方法

```tsx
class Food {
  element:HTMLElement;
  constructor(){
    this.element = document.getElementById('food')!;
  }

  //获取食物X轴的坐标
  get X(){
    return this.element.offsetLeft;
  }
  //获取食物Y轴坐标
  get Y(){
    return this.element.offsetTop;
  }

  //修改食物位置
  change(){
    //生成一个随机的位置
    //食物的位置最小为0，最大为290
    //蛇移动一次就是一格(10px)，所以食物的位置必须是10的倍数
    let left = Math.round(Math.random()*29)*10;
    let top = Math.round(Math.random()*29)*10;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }
}

export default Food;
```

# 四、计数盘（ScorePanel）类

```tsx
class ScorePanel {
  //score和level用来记录得分和等级
  score = 0;
  level = 1;
//分数和等级所在的元素，在构造函数中进行初始化
  scoreEle: HTMLElement;
  levelEle: HTMLElement;

  //设置一个变量限制等级
  maxLevel: number;
  //设置一个变量表示多少分时提升一次等级
  upScore: number;

  //为传入参数使用默认值
  constructor(maxLevel: number = 10, upScore: number = 10) {
    this.scoreEle = document.getElementById('score')!;
    this.levelEle = document.getElementById('level')!;
    this.maxLevel = maxLevel;
    this.upScore = upScore;
  }

  //设置加分
  addScore() {
    this.scoreEle.innerHTML = ++this.score + '';
    //判断分数是否达到升级分数
    if (this.score % this.upScore === 0) {
      this.levelUp();
    }
  }

  levelUp() {
    //判断是否达到最大等级
    if(this.level < this.maxLevel){
      this.levelEle.innerHTML = ++this.level + '';
    }
  }
}
export default ScorePanel;
```

# 五、Snake（蛇）类

```tsx
class Snake {
  //获取蛇头元素
  head:HTMLElement;
  //获取蛇身体元素
  bodies:HTML
  //获取蛇的容器
  element:HTMLElement;
  //蛇的移动方向（也就是蛇头下一步要移动的位置）
  direction:string = '';
  constructor() {
    this.element = document.getElementById('snake')!;
    this.head = document.querySelector('#snake > div')!;
    this.bodies = this.element.querySelector('div')!;
  }
//获取蛇的坐标（蛇头坐标）
  get X() {
    return this.head.offsetLeft;
  }
  get Y() {
    return this.head.offsetTop;
  }

  //设置蛇的坐标（蛇头坐标）
  set X(value) {
    if(this.X === value) return;
    //X的值发生改变，蛇在X轴上移动
    //禁止蛇向反方向移动

    if(value < 0 || value > 290) {
      throw new Error('蛇撞墙了！');    
    }
    //修改x时，修改水平坐标，蛇头左右移动
    if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetLeft === value){
      //如果发生掉头，让蛇向反方向移动
      if(value > this.X) {
        //如果新值value大于旧值X，说明蛇在向右走，此时发生掉头，应该向左走
        value = this.X - 10;
      }
      else {
        value = this.X + 10;
      }
    }
    //移动身体
    this.moveBody();
    this.head.style.top = value + 'px';
    this.checkHeadBody();
  }

  set Y(value) {
    if(this.Y === value) return;
    //Y的值发生改变，蛇在Y轴上移动
    //禁止蛇向反方向移动
    if(value < 0 || value > 290) {
      throw new Error('蛇撞墙了！');
    }
    //修改y时，修改垂直坐标，蛇头上下移动
    if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetTop === value){
      //如果发生掉头，让蛇向反方向移动
      if(value > this.Y) {
        //如果新值value大于旧值Y，说明蛇在向下走，此时发生掉头，应该向上走
        value = this.Y - 10;
      }
      else {
        value = this.Y + 10;
      }
    }
    //移动身体
    this.moveBody();
    this.head.style.top = value + 'px';
    this.checkHeadBody();
  }
}
```
=======
# TypeScript
TypeScript贪吃蛇小游戏
>>>>>>> 4feb3e74070906efd5d250e3f14b3425f88892eb
