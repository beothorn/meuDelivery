import * as React from "react"

const HubComponent:React.FunctionComponent<{ 
        components: {[name: string]: React.FunctionComponent} ,
        props: {[name: string]: any}
    }> = ({ components, props }) => {    
    const rendered = Object.entries(components).map(
        ([key, C]) => <C key = {key} {...props[key]} />
    )
    return <React.StrictMode> {rendered} </React.StrictMode>
}

export default HubComponent