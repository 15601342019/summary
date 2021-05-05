import TinyReact from './TinyReact'
const root = document.getElementById('root');
const virtualDOM = (
    <div className="container">
        <h1>你好 Tiny React</h1>
        <h2 data-test="test">(编码必杀技)</h2>
        <div>
            嵌套1 <div>嵌套 1.1</div>
        </div>
        <h3>(观察: 这个将会被改变)</h3>
        {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
        {2 == 2 && <div>2</div>}
        <span>这是一段内容</span>
        <button onClick={() => alert("你好")}>点击我</button>
        <h3>这个将会被删除</h3>
      2, 3
        <input type="text" value="13" />
    </div>
)
// TinyReact.render(virtualDOM, root)
const modifyDOM = (
    <div className="container">
        <h1>你好 Tiny React</h1>
        <h2 data-test="test1234">(编码必杀技)</h2>
        <div>
            嵌套1 <div>嵌套 1.1</div>
        </div>
        <h3>(观察: 这个将会被改变)</h3>
        {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
        {2 == 2 && <div>2</div>}
        <span>这是一段xiugaide内容</span>
        <button onClick={() => alert("你好!!!!!")}>点击我</button>
        {/* <h6>这个将会被删12除</h6> */}
        {/* 2, 3 */}
        <input type="text" />
    </div>
)

// TinyReact.render(virtualDOM, root)

// setTimeout(() => {
//     TinyReact.render(modifyDOM, root)
// }, 2000)

function Demo() {
    return <div>Hello Demo</div>
}
function Heart(props) {
    return (
        <div>
            {props.title}
        &hearts; <Demo />
        </div>
    )
}
// TinyReact.render(<Heart title='12423454565 '/>, root)

// class Alert extends TinyReact.component {
//     render() {
//         return <div>Hello React{this.props.name}{this.props.name}</div>
//     }
// }
// TinyReact.render(<Alert name='张珊' age='20' />, root)

class Alert extends TinyReact.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "Default Title"
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        // 这里使用的this.setState，实际上是父类Component中的方法
        this.setState({ title: "Changed Title" })
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log("componentWillReceiveProps")
    // }
    // componentWillUpdate() {
    //     console.log("componentWillUpdate")
    // }
    // componentDidUpdate() {
    //     console.log("componentDidUpdate")
    // }
    render() {
        return (
            <div>
                {this.props.name}
                {this.props.age}
                <div>
                    {this.state.title}
                    <button onClick={this.handleClick}>改变Title</button>
                </div>
            </div>
        )
    }
}
TinyReact.render(<Alert name='张三' age='20'/>, root)
setTimeout(() => {
    TinyReact.render(<Alert name='李四' age='50'/>, root)
    // TinyReact.render(<Heart title='hello111'/>, root)
}, 2000)