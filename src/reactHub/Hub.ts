import { Observable } from 'rxjs'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import HubComponent from './HubComponent'

interface Input {
    source: string;
    sourceSubscriber: any;
}

interface Output {
    name: string;
    outputObservable: Observable<any>;
}

interface Renderable{
    props?: Observable<any>;
    functionComponent: React.FunctionComponent<any>;
}

interface PlugSettings {
    name: string;
    renderer?: Renderable;
    inputs?: Input[];
    outputs?: Output[];
}

interface Connection {
    inputs: {[name: string]: Observable<any>};
    outputs: {[name: string]: Observable<any>};
}

type Renderer = (components:{[name: string]: React.FunctionComponent}, props: {[name: string]: any}) => void;

const defaultRenderer: Renderer = (components, props) => 
    ReactDOM.render( HubComponent({ components, props }), document.getElementById('main'))

class Hub {
    connections:{[name: string]: Connection} = {};
    components:{[name: string]: React.FunctionComponent} = {};
    props: {[name: string]: any} = {};
    aggregator: Renderer;

    constructor(aggregator: Renderer = defaultRenderer) {
        this.aggregator = aggregator;
    }

    plug: (connection: PlugSettings) => void = (connection) => {
        let newInputs: {[name: string]: Observable<any>} = {}
        let newOutputs: {[name: string]: Observable<any>} = {}
    
        if(connection.inputs){
            for(let i of connection.inputs){
                let [componentName, inputName] = i.source.split(":");
                let componentSrc = this.connections[componentName]
                componentSrc.outputs[inputName].subscribe(i.sourceSubscriber)
                newInputs[inputName] = i.sourceSubscriber
            }
        }
        if(connection.outputs){
            for(let o of connection.outputs){
                newOutputs[o.name] = o.outputObservable
            }
        }
        if(connection.renderer){
            this.components[connection.name] = connection.renderer.functionComponent
            if(connection.renderer.props)
                connection.renderer.props.subscribe((state: any) => {
                    this.props[connection.name] = state
                    this.aggregator(this.components, this.props)
                })
        }
    
        this.connections[connection.name] = {
            inputs: newInputs,
            outputs: newOutputs
        }
    }

    unplug: (componentOutput: string) => TimerHandler = (componentOutput) => {
        console.log("Unplug "+componentOutput)
        return null
    }
}

export { Connection, Input, Hub }