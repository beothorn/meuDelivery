import { Observable, Observer, Subscription } from 'rxjs'
import * as ReactDOM from 'react-dom'
import * as React from 'react'
import HubComponent from './HubComponent'


interface OutputConnection {
    source: Observable<any>,
    subscriptions: Connection[]
}

interface InputConnection {
    subscriber: Observer<any>,
    subscription: Subscription
}

interface Connection {
    name: string,
    outputs: Map<string, OutputConnection>,
    inputs: Map<string, Map<string, InputConnection>>
}

type Connections =  Map<string, Connection>;

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

type Renderer = (components: Map<string, React.FunctionComponent>, props: Map<string, any>) => void;

const defaultRenderer: Renderer = (components, props) => 
    ReactDOM.render( HubComponent({ components, props }), document.getElementById('main'))

const splitOutputName: (outputName: string) => string[] = (outputName: string) => outputName.split(":")
const joinOutputName: (componentName: string, outputName: string) => string = (componentName, outputName) => `${componentName}:${outputName}`

class Hub {
    connections: Connections = new Map()
    components: Map<string, React.FunctionComponent> = new Map()
    props: Map<string, any> = new Map()
    aggregator: Renderer

    constructor(aggregator: Renderer = defaultRenderer) {
        this.aggregator = aggregator;
    }

    print: () => void = () => {
        let out = this.connections.size == 0 ? "No connections" : ""
        this.connections.forEach((connection, connectionName) => {
            out += connectionName + ":\n"
            
            out += connection.inputs.size == 0 ? "\tNo inputs\n" : ""
            connection.inputs.forEach((inputConnectionSource, inputName) => {
                out += `\tIn '${inputName}':\n`
                inputConnectionSource.forEach((outputConnection, outputConnectionName) => {
                    out += `\t\t${connectionName} <- ${inputName}:${outputConnectionName}\n`
                })
            })

            out += connection.outputs.size == 0 ? "\tNo outputs\n" : ""
            connection.outputs.forEach((output, outputName) => {
                out += `\tOut '${outputName}':\n`
                out += output.subscriptions.length == 0 ? "\t\tNo outputs subscriptions\n" : ""
                output.subscriptions.forEach(s => {
                    out += `\t\t${connectionName}:${outputName} -> ${s.name}\n`
                })
            })
        })
        console.log(out)
    }

    plug: (connection: PlugSettings) => void = (newConnection) => {
        if(!this.connections.has(newConnection.name)){
            this.connections.set(newConnection.name, {
                name: newConnection.name,
                outputs: new Map(),
                inputs: new Map()
            })    
        }

        let currentConnection: Connection = this.connections.get(newConnection.name)
    
        if(newConnection.inputs){
            for(let input of newConnection.inputs){
                let [outputComponentName, outputName] = splitOutputName(input.source)

                if(!this.connections.has(outputComponentName)){
                    this.connections.set(outputComponentName, {
                        name: outputComponentName,
                        outputs: new Map(),
                        inputs: new Map()
                    })
                }

                let connection: Connection = this.connections.get(outputComponentName)

                if(!connection.outputs.has(outputName)){
                    connection.outputs.set(outputName, {
                        source: null,
                        subscriptions:[]
                    })
                }
                let outputConnection: OutputConnection = connection.outputs.get(outputName)

                let subscription: Subscription = null
                if(outputConnection.source){
                    subscription = outputConnection.source.subscribe(input.sourceSubscriber)
                }
                outputConnection.subscriptions.push(currentConnection)
                if(!currentConnection.inputs.has(outputComponentName)){
                    currentConnection.inputs.set(outputComponentName, new Map())
                }
                const inputFor = currentConnection.inputs.get(outputComponentName)
                if(inputFor.has(outputName)){
                    inputFor.get(outputName).subscription.unsubscribe()
                }
                inputFor.set(outputName, {
                    subscriber: input.sourceSubscriber,
                    subscription: subscription
                })
            }
        }

        if(newConnection.outputs){
            //unsubscribe outputs
            currentConnection.outputs.forEach((outputValue, outputKey) => {
                outputValue.subscriptions.forEach( s => {
                    const inputOnOtherConnectionForConnection = s.inputs.get(currentConnection.name)
                    const inputOnOtherConnectionForOutput = inputOnOtherConnectionForConnection.get(outputKey)
                    if(inputOnOtherConnectionForOutput.subscription){
                        inputOnOtherConnectionForOutput.subscription.unsubscribe()
                    }

                    //resubscribe output if available
                    for(let newOutput of newConnection.outputs){
                        if(newOutput.name === outputKey){
                            outputValue.source = newOutput.outputObservable
                            inputOnOtherConnectionForOutput.subscription = outputValue.source.subscribe(inputOnOtherConnectionForOutput.subscriber)
                        }
                    }
                })
            })

            for(let o of newConnection.outputs){
                if(!currentConnection.outputs.has(o.name)){
                    currentConnection.outputs.set(o.name, {
                        source: o.outputObservable,
                        subscriptions: []
                    })
                }
            }
        }
        if(newConnection.renderer){
            this.components.set(newConnection.name, newConnection.renderer.functionComponent)
            if(newConnection.renderer.props)
                newConnection.renderer.props.subscribe((state: any) => {
                    this.props.set(newConnection.name, state)
                    this.aggregator(this.components, this.props)
                })
        }
    }

    unplug: (componentName: string) => void = (componentName) => {
        let currentConnection = this.connections.get(componentName)
        currentConnection.outputs.forEach((out, outName) => out.subscriptions.forEach( s => {
            s.inputs.get(componentName).forEach( s => s.subscription.unsubscribe())
        }))
        currentConnection.inputs.forEach(c => c.forEach( co => co.subscription.unsubscribe()  ))
    }

    size: () => number = () => this.connections.size
}

export { Input, Hub }