import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BotToken from './settings/botToken/BotToken';
import ReceivedMessages from './receivedMessages/ReceivedMessages';
import { Observable, Subject } from 'rxjs';
import { Connection, Input, plug, unplug } from '../reactHub/Hub';

let count = 0

const Main = () => {
    const messages: Observable<any> = Observable.create((observer: any) => {
        setInterval(() => {
            if(count < 10)
                observer.next("Hello "+count)
            count++
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

    setTimeout( unplug("MessagesDisplay") , 10000)

    plug({
        name: "BotToken",
        renderer: BotToken
    } as Connection)
}

export default Main