

function createElement(type,props,...children){
    return{
        type,
        props:{
            ...props,
            children:children.map(child =>
                typeof child === "object" 
                ? child 
                : createTextElement(child)
            )
        }
    }
}

function createTextElement(text){
    return{
        type:"TEXT_ELEMENT",
        props:{
            nodeValue:text,
            children:[]
        }
    }
}

const MyReact = {
    createElement
}

const element = MyReact.createElement(
    "div",
    {id:"foo"},
    React.createElement("a",null,"bar"),
    React.createElement("b")
)

const container = document.getElementById("root")
ReactDOM.render(element,container)