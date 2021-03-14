import * as React from "react"

const App = () => {    
  return <div className="App">
        <h1>Bot token:</h1>
        <input id={"bot-token"}/>
        <button id={"bot-token-ok"}>OK</button>
        <p id={"bot-token-out"}></p>
    </div>
}

export default App