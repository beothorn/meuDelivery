import { Observable } from 'rxjs';
import * as ReactDOM from 'react-dom';
import * as React from 'react';

interface Input {
    source: string;
    sourceSubscriber: any;
}

interface Output {
    name: string;
    outputObservable: Observable<any>;
}

interface Renderable{
    props: Observable<any>;
    renderer: React.FunctionComponent;
}

interface NewConnection {
    name: string;
    props?: Observable<any>;
    renderer?: React.FunctionComponent;
    inputs?: Input[];
    outputs?: Output[];
}

interface Connection {
    props?: Observable<any>;
    renderer?: React.FunctionComponent;
    inputs: {[name: string]: Observable<any>};
    outputs: {[name: string]: Observable<any>};
}

const hub:{[name: string]: Connection} = {}
const allProps: {[name: string]: any} = {}

const updateState: (name: string, newProps: any) => void  = (name, newProps) => {
    allProps[name] = newProps
    const rendered = Object.entries(hub).map(
        ([key, value]) => {
            if(value.renderer){
                return <value.renderer 
                key = {key}
                {...allProps[key]} 
                />
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

const plug: (connection: NewConnection) => void = (connection) => {

    let newInputs: {[name: string]: Observable<any>} = {}
    let newOutputs: {[name: string]: Observable<any>} = {}

    if(connection.inputs){
        for(let i of connection.inputs){
            let [componentName, inputName] = i.source.split(":");
            let componentSrc = hub[componentName]
            componentSrc.outputs[inputName].subscribe(i.sourceSubscriber)
            newInputs[inputName] = i.sourceSubscriber
        }
    }
    if(connection.outputs){
        for(let o of connection.outputs){
            newOutputs[o.name] = o.outputObservable
        }
    }
    if(connection.props){
        connection.props.subscribe((state: any) => {
            updateState(connection.name, state)
        })
    }

    hub[connection.name] = {
        props: connection.props,
        renderer: connection.renderer,
        inputs: newInputs,
        outputs: newOutputs
    }
}

const unplug: (componentOutput: string) => TimerHandler = (componentOutput) => {
    console.log("Unplug "+componentOutput)
    return null
}

export { Connection, Input, plug, unplug}