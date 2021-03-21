import ReceivedMessages from './ReceivedMessages'
import * as React from "react"
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

test('Render list of messages', () => {
    const msgs: Array<string> = ["First", "Second"]
    render(<ReceivedMessages messages={msgs} />)
    expect(screen.getByText("First")).toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
})

test('Render empty messages', () => {
    const msgs: Array<string> = []
    render(<ReceivedMessages messages={msgs} />)
    expect(screen.getByText("Sem mensagens")).toBeInTheDocument()
})