import * as React from "react"
import { FunctionComponent } from 'react';

const ReceivedMessages:FunctionComponent<{ messages: Array<string> }> = ({messages}) => {    
    const renderedMessages = messages.map( msg => (<p key={msg} className="receivedMessage">{msg}</p>) )
    return <div id="ReceivedMessages">
            <h1>Mensagens Recebidas:</h1>
            {renderedMessages}
        </div>
}

export default ReceivedMessages