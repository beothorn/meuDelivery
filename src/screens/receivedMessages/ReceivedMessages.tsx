import * as React from "react"
import { FunctionComponent } from 'react';

const ReceivedMessages:FunctionComponent<{ messages: string[] }> = ({messages}) => {    
    if(messages.length == 0) return <div id="ReceivedMessages"> <p>Sem mensagens</p> </div>
    const renderedMessages = messages.map( msg => (<p key={msg} className="receivedMessage">{msg}</p>) )
    return <div id="ReceivedMessages">
            <h1>Mensagens Recebidas:</h1>
            {renderedMessages}
        </div>
}

export default ReceivedMessages