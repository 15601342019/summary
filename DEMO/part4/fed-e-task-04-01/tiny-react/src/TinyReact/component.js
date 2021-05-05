import diff from './diff';
export default class Component {
    constructor(props) {
        this.props = props
    }
    // 问题：在父类中，this指向子类实例对象，说明父类可以获取到 挂载在子类实例this和原型上的 所有属性和方法？
    //      比如子类实例上的state和render方法？
    setState(state) {
        this.state = { ...this.state, ...state }
        console.log(this.state, this.render)
        // 更新后的virtualDOM对象
        let virtualDOM = this.render()
        // 获取容器
        let container = oldDOM?.parentNode
        // 获取页面中正在显示的 DOM 对象 通过它可以获取其对象的 Virtual DOM 对象
        let oldDOM = this.getDOM()
        // 接下来就可以调用 diff 方法进行比对了，比对后会按照我们之前写好的逻辑进行 DOM 对象更新，我们就可以在页面中看到效果了
        // 比对
        diff(virtualDOM, container, oldDOM)
    }

    // 以下逻辑有点长，耐心看
    // 要实现对比，还需要获取未更新前的 Virtual DOM，按照之前的经验，我们可以从 DOM 对象中获取其对应的 Virtual DOM 对象，
    // 未更新前的 DOM 对象实际上就是现在在页面中显示的 DOM 对象，
    // 我们只要能获取到这个 DOM 对象就可以获取到其对应的 Virtual DOM 对象了。

    // 页面中的 DOM 对象要怎样获取呢？页面中的 DOM 对象是通过 mountNativeElement 方法挂载到页面中的，
    // 所以我们只需要在这个方法中调用 Component 类中的方法就可以将 DOM 对象保存在 Component 类中了。在子类调用 setState 方法的时候，
    // 在 setState 方法中再调用另一个获取 DOM 对象的方法就可以获取到之前保存的 DOM 对象了。

    // 接下来我们要研究一下在 mountNativeElement 方法中如何才能调用到 setDOM 方法，要调用 setDOM 方法，必须要得到类的实例对象，
    // 所以目前的问题就是如何在 mountNativeElement 方法中得到类的实例对象，这个类指的不是Component类，
    // 因为我们在代码中并不是直接实例化的Component类，而是实例化的它的子类，由于子类继承了父类，
    // 所以在子类的实例对象中也是可以调用到 setDOM 方法的。

    // mountNativeElement 方法接收最新的 Virtual DOM 对象，
    // 如果这个 Virtual DOM 对象是类组件产生的，在产生这个 Virtual DOM 对象时一定会先得到这个类的实例对象，
    // 然后再调用实例对象下面的 render 方法进行获取。我们可以在那个时候将类组件实例对象添加到 Virtual DOM 对象的属性中，
    // 而这个 Virtual DOM 对象最终会传递给 mountNativeElement 方法，这样我们就可以在 mountNativeElement 方法中获取到组件的实例对象了，
    // 既然类组件的实例对象获取到了，我们就可以调用 setDOM 方法了。

    // 在 buildClassComponent 方法中为 Virtual DOM 对象添加 component 属性， 值为类组件的实例对象就可以了。
    setDOM(dom) {
        this._dom = dom
    }
    getDOM() {
        return this._dom
    }

    // 添加生命周期函数

    componentWillMount() { }
    componentDidMount() { }
    componentWillReceiveProps(nextProps) { }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps != this.props || nextState != this.state
    }
    componentWillUpdate(nextProps, nextState) { }
    componentDidUpdate(prevProps, preState) { }
    componentWillUnmount() { }

    // 更新props的方法
    updateProps(props) {
        this.props = props
    }
}


// // 模拟以上 父组件中可以拿到子类实例的任何方法和属性
// class Component {
//     constructor(props) {
//         this.props = props
//     }
//     setState(state) {
//         // setState 方法被子类调用 此处this指向子类实例对象
//         // 所以改变的是子类的 state 对象
//         console.log(this)
//         // this.state = Object.assign({}, this.state, state)
//     }
// }
// class Alert extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             title: "Default Title"
//         }
//     }
//     handleClick() {
//         // this.setState({ title: "Changed Title" });
//         console.log(this.state.title)
//     }

// }
// let alert = new Alert({ name: 01, age: 02 })
// // alert对象可以获取到 setState、state、handleClick等属性和方法
// console.log(alert)