import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BotToken from './settings/botToken/BotToken';
import ReceivedMessages from './receivedMessages/ReceivedMessages';
import Widget from './Widget';
import { Observable, Subject } from 'rxjs';

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
                return value.renderer(allProps[key])
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

const Main = () => {
    const messages: Observable<any> = Observable.create((observer: any) => {
        setInterval(() => {
            observer.next("Hello")
        }, 2000)
    })

    plug({
        name: "Messages",
        output: messages
    } as Connection)
    
    const messagesLog: string[] = []
    const messagesLogProps = new Subject()

    plug({
        name: "MessagesDisplay",
        inputs: [{
            source: "Messages",
            sourceSubscriber: (msg: string) => {
                messagesLog.push(msg)
                messagesLogProps.next({
                    "messages": messagesLog
                })
            }
        } as Input],
        props: messagesLogProps,
        renderer: ReceivedMessages
    } as Connection)

    plug({
        name: "BotToken",
        renderer: BotToken
    } as Connection)
}

export default Main