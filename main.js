

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

// function render(element,container){
//     const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode('') : document.createElement(element.type)
//     const isProperty = key => key !== "children";
//     Object.keys(props).filter(isProperty).forEach(name => 
//         dom[name] = element.props[name]
//     )
    
//     element.props.children.forEach(child => 
//         render(child,dom)
//     )
//     container.appendChild(dom)
// }
function createDom(fiber){
    const dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode('') : document.createElement(fiber.type)
    const isProperty = key => key !== "children";
    Object.keys(fiber.props).filter(isProperty).forEach(name => 
        dom[name] = fiber.props[name]
    )
    return dom;
}

function render(element,container){
    nextUnitOfWork = {
        dom:container,
        props:{
            children:[element]
        }
    }
}

function performUnitOfWork(fiber){
    //adding dom node
    if(!fiber.dom){
        fiber.dom = createDom(fiber)
    }

    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }

    //create new fibers
    const elements = fiber.props.children
    let index = 0;
    let prevSibling = null;

    while(index < elements.length){
        const element = elements[index]

        const newFiber = {
            type:element.type,
            props:element.props,
            parent:fiber,
            dom:null
        }

        if(index === 0){
            fiber.child = newFiber
        }else{
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index ++;
    }

    if(fiber.child){
        return fiber.child
    }
    let nextFiber = fiber

    while(nextFiber){
        if(nextFiber.sibling){
            return nextFiber.sibling
        }

        nextFiber = nextFiber.parent
    }
}



//break into small unit
let nextUnitOfWork = null;
function workLoop(deadline){
    let shouldYield = false;
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaing() < 1
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

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