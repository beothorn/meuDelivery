import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { FunctionComponent } from 'react'
import BotToken from './settings/botToken/BotToken'
import ReceivedMessages from './receivedMessages/ReceivedMessages'
import Widget from './Widget'

const topWidget: JSX.Element = <BotToken />
const bottomWidget: JSX.Element = <ReceivedMessages messages={["A", "B"]} />

const Main = () => ReactDOM.render(
    <React.StrictMode>
        <Widget component={topWidget} />
        <Widget component={bottomWidget} />
    </React.StrictMode>,
    document.getElementById('main')
)

export default Main