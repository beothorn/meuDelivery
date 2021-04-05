import BotToken from './settings/botToken/BotToken';
import ReceivedMessages from './receivedMessages/ReceivedMessages';
import { Observable, Subject } from 'rxjs';
import { Connection, Input, Hub } from '../reactHub/Hub';

let count = 0

const Main = () => {
    const hub = new Hub()

    const messages: Observable<any> = new Observable((observer: any) => {
        setInterval(() => {
            if(count < 10)
                observer.next("Hello "+count)
            count++
        }, 2000)
    })

    hub.plug({
        name: "Messages",
        outputs: [{
            name: "msgsReceived",
            outputObservable: messages
        }]
    })
    
    const messagesLog: string[] = []
    const messagesLogProps = new Subject()

    hub.plug({
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
        
        renderer: {
            props: messagesLogProps,
            functionComponent: ReceivedMessages
        }
    })

    setTimeout( hub.unplug("MessagesDisplay") , 10000)

    hub.plug({
        name: "BotToken",
        renderer: {
            functionComponent: BotToken
        }
    })
}

export default Main