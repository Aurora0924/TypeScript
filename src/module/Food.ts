// 定义食物Food
class Food {
	element: HTMLElement
	constructor() {
		//获取食物的dom元素节点，getElementById方法返回值可能为element或者null,这里肯定是element，所以加了！
		this.element = document.getElementById('food')!
	}
	//定义一个获取食物x坐标的方法
	get X() {
		return this.element.offsetLeft
	}
	get Y() {
		return this.element.offsetTop
	}
	//修改食物的位置
	change() {
		//生成一个随机的位置
		//食物的位置，最小是0，最大是290，且是10的倍数
		let top = Math.round(Math.random() * 29) * 10
		let left = Math.round(Math.random() * 29) * 10
		this.element.style.left = left + 'px'
		this.element.style.top = top + 'px'
	}
}
export default Food