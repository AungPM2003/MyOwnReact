

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

function render(element,container){
    const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode('') : document.createElement(element.type)
    const isProperty = key => key !== "children";
    Object.keys(props).filter(isProperty).forEach(name => 
        dom[name] = element.props[name]
    )
    
    element.props.children.forEach(child => 
        render(child,dom)
    )
    container.appendChild(dom)
}

const MyReact = {
    createElement,
    render
}

const element = MyReact.createElement(
    "div",
    {id:"foo"},
    MyReact.createElement("a",null,"bar"),
    MyReact.createElement("b")
)
console.log(JSON.stringify(element,null,2))
const container = document.getElementById("root")
MyReact.render(element,container)