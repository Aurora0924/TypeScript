//引入其他的类
import Snake from './Snake'
import Food from './Food'
import ScorePanel from './ScorePanel'
//控制其他所有类
class GameControl {
	//定义三个属性
	snake: Snake
	food: Food
	scorePanel: ScorePanel
	//创建一个属性来存储蛇的移动方向(按键的方向)
	direction: string = 'Down'
	//创建一个属性判断游戏是否结束
	isLive: boolean = true
	constructor() {
		this.snake = new Snake()
		this.food = new Food()
		this.scorePanel = new ScorePanel()
		this.init()
	}
	//初始化方法,调用后游戏开始
	init() {
		//绑定键盘的按键按下事件,按下后执行回调函数
		document.addEventListener('keydown', this.keydownHandler.bind(this))
		this.run()
	}
	//创建一个键盘按下的相应函数
	keydownHandler(event: KeyboardEvent) {
		console.log(event.key)
		//检查用户按键是不是只按了上下左右四个键
		//用户按键触发，需要修改direction属性
		this.direction = event.key
	}
	//创建一个让蛇动起来的方法
	run() {
		//根据方向this.direction来改变蛇头的位置
		let X = this.snake.X
		let Y = this.snake.Y
		switch (this.direction) {
			case 'ArrowUp':
			case 'Up':
				Y -= 10
				break
			case 'ArrowDown':
			case 'Down':
				Y += 10
				break
			case 'ArrowLeft':
			case 'Left':
				X -= 10
				break
			case 'ArrowRight':
			case 'Right':
				X += 10
				break
        }
        //检查蛇是否吃到了食物，如果蛇头的位置和食物的位置重叠，则说明吃到了食物
        this.checkEat(X,Y)
		try {
			this.snake.X = X
			this.snake.Y = Y
		} catch (e) {
            alert(e)
            this.isLive=false
        }

		this.isLive && setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30)
    }
    
    //定义一个方法，用来检查蛇是否吃到了食物
    checkEat(X:number,Y:number){
        if(X===this.food.X && Y===this.food.Y){
            //食物的位置变更
            this.food.change()
            //分数增加
            this.scorePanel.addScore()
            //蛇要增加一节
            this.snake.addBody()
        }
    }
}
export default GameControl
