import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BotToken from './settings/botToken/BotToken';
import ReceivedMessages from './receivedMessages/ReceivedMessages';
import { Observable, Subject } from 'rxjs';
import { Connection, Input, plug, unplug } from '../reactHub/Hub';

let count = 0

const Main = () => {
    const messages: Observable<any> = new Observable((observer: any) => {
        setInterval(() => {
            if(count < 10)
                observer.next("Hello "+count)
            count++
        }, 2000)
    })

    plug({
        name: "Messages",
        outputs: [{
            name: "msgsReceived",
            outputObservable: messages
        }]
    })
    
    const messagesLog: string[] = []
    const messagesLogProps = new Subject()

    plug({
        name: "MessagesDisplay",
        inputs: [{
            source: "Messages:msgsReceived",
            sourceSubscriber: (msg: string) => {
                messagesLog.push(msg)
                messagesLogProps.next({
                    "messages": messagesLog
                })
            }
        }],
        props: messagesLogProps,
        renderer: ReceivedMessages
    })

    setTimeout( unplug("MessagesDisplay") , 10000)

    plug({
        name: "BotToken",
        renderer: BotToken
    })
}

export default Main