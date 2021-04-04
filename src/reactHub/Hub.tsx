import { Observable } from 'rxjs';
import * as ReactDOM from 'react-dom';
import * as React from 'react';

interface Input {
    source: string;
    sourceSubscriber: any;
}

interface Connection {
    name: string;
    props?: Observable<any>;
    renderer?: React.FunctionComponent;
    inputs?: Input[];
    output?: Observable<any>;
}

const hub:{[name: string]: Connection} = {}
const allProps: {[name: string]: any} = {}

const updateState: (name: string, newProps: any) => void  = (name, newProps) => {
    allProps[name] = newProps
    const rendered = Object.entries(hub).map(
        ([key, value]) => {
            if(value.renderer){
                return <value.renderer {...allProps[key]} />
            }
        }
    )
    ReactDOM.render(
        <React.StrictMode>
            {rendered}
        </React.StrictMode>,
        document.getElementById('main')
    )
}

const plug: (connection: Connection) => void = (connection) => {
    if(connection.inputs){
        for(let i of connection.inputs){
            hub[i.source].output.subscribe(i.sourceSubscriber)
        }
    }
    if(connection.props){
        connection.props.subscribe((state: any) => {
            updateState(connection.name, state)
        })
    }

    hub[connection.name] = connection
}

const unplug: (componentOutput: string) => TimerHandler = (componentOutput) => {
    console.log("Unplug "+componentOutput)
    return null
}

export { Connection, Input, plug, unplug}