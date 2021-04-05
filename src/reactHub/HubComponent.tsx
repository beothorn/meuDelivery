import * as React from "react"

const HubComponent:React.FunctionComponent<{ 
        renderers: {[name: string]: React.FunctionComponent} ,
        allProps: {[name: string]: any}
    }> = ({ renderers, allProps }) => {    
    const rendered = Object.entries(renderers).map(
        ([key, C]) => <C key = {key} {...allProps[key]} />
    )
    return <React.StrictMode> {rendered} </React.StrictMode>
}

export default HubComponent