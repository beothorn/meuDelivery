import * as React from "react"
import { FunctionComponent } from 'react'

const Widget:FunctionComponent<{ component: JSX.Element }> = ({component}) => {    
    return <div className="widget">
            {component}
        </div>
}

export default Widget