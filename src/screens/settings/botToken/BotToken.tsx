import * as React from "react";

const BotToken = () => {    
  return <div className="BotToken">
        <h1>Bot token:</h1>
        <input id={"bot-token"}/>
        <button id={"bot-token-ok"} onClick={() => console.log("OK")}>OK</button>
        <p id={"bot-token-out"}></p>
    </div>
}

export default BotToken