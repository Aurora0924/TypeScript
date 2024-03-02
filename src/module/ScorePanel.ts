//定义表示记分牌的类
class ScorePanel {
	score = 0
	level = 1
	scoreEle: HTMLElement
	levelEle: HTMLElement
	//设置一个等级
    maxLevel: number
    //设置一个变量表示多少分时升级
    upScore:number
	constructor(maxLevel: number=10,upScore:number=1) {
		this.scoreEle = document.getElementById('score')!
        this.levelEle = document.getElementById('level')!
        this.maxLevel=maxLevel
        this.upScore=upScore
	}
	//设置一个分数增加的方法
	addScore() {
        this.scoreEle.innerHTML = ++this.score + ''
        if(this.score % this.upScore ===0){
            this.levelUp()
        }
	}
	//设置提升等级的方法
	levelUp() {
		if (this.level < this.maxLevel) {
			this.levelEle.innerHTML = ++this.level + ''
		}
	}
}
export default ScorePanel