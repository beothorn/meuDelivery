import * as React from "react";
import ReceivedMessages from './receivedMessages/ReceivedMessages';

const App = () => {    

  return <div className="App">
        <h1>Bot token:</h1>
        <input id={"bot-token"}/>
        <button id={"bot-token-ok"} onClick={() => console.log("OK")}>OK</button>
        <p id={"bot-token-out"}></p>
        <ReceivedMessages messages={["A", "B"]} />
    </div>
}

export default App