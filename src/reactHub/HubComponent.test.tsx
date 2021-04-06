import HubComponent from './HubComponent'
import * as React from "react"
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

test('Render all components', () => {
    let component: React.FunctionComponent<any> = ({val}) => <p>{val}</p>
    render(<HubComponent 
        components={{ 
            "a": component,
            "b": component
        }} 
        props={{
            "a": {"val": "Foo"},
            "b": {"val": "Bar"}
        }}
    />)
    expect(screen.getByText("Foo")).toBeInTheDocument()
    expect(screen.getByText("Bar")).toBeInTheDocument()
})