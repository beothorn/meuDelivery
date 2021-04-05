import { Hub } from "./Hub";
import { BehaviorSubject } from 'rxjs';
import * as React from 'react';;
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('Add input and output, message flows', done => {

    const hub = new Hub( () => null )

    const producerOutput: BehaviorSubject<any> = new BehaviorSubject("Foo");

    hub.plug({
        name: "Producer",
        outputs: [{
            name: "out",
            outputObservable: new BehaviorSubject("Foo")
        }]
    })

    hub.plug({
        name: "Consumer",
        inputs: [{
            source: "Producer:out",
            sourceSubscriber: (data: any) => {
                expect(data).toStrictEqual("Foo")
                done()
            }
        }]
    })
})

test('Add two inputs and output, message flows', done => {

    const hub = new Hub( () => null )

    hub.plug({
        name: "Producer1",
        outputs: [{
            name: "out",
            outputObservable: new BehaviorSubject("Foo")
        }]
    })

    hub.plug({
        name: "Producer2",
        outputs: [{
            name: "out",
            outputObservable: new BehaviorSubject("Bar")
        }]
    })

    let count = 0

    hub.plug({
        name: "Consumer",
        inputs: [
            {
                source: "Producer1:out",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Foo")
                    count++
                    if(count == 2)
                        done()
                }
            },
            {
                source: "Producer2:out",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Bar")
                    count++
                    if(count == 2)
                        done()
                }
            }
        ]
    })
})

test('Add outputs, message flows', done => {

    const hub = new Hub( () => null )

    hub.plug({
        name: "Producer",
        outputs: [{
            name: "out1",
            outputObservable: new BehaviorSubject("Foo")
        },{
            name: "out2",
            outputObservable: new BehaviorSubject("Bar")
        }]
    })

    let count = 0

    hub.plug({
        name: "Consumer",
        inputs: [
            {
                source: "Producer:out1",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Foo")
                    count++
                    if(count == 2)
                        done()
                }
            },
            {
                source: "Producer:out2",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Bar")
                    count++
                    if(count == 2)
                        done()
                }
            }
        ]
    })
})

test('when changing props component will call renderer', done => {

    let c: React.FunctionComponent<{ a: string }> = ({a}) => <p>{a}</p>

    const hub = new Hub( (component, props) => {
        expect(component).toStrictEqual({
            "Renderable": c
        })
        expect(props).toStrictEqual({
            "Renderable":{a: "Foo"}
        })
        done() 
    } )

    hub.plug({
        name: "Renderable",
        renderer: {
            props: new BehaviorSubject({a: "Foo"}),
            functionComponent: c
        }
    })

})