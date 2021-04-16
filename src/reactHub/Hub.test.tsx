import { Hub } from "./Hub"
import { BehaviorSubject, Subject } from 'rxjs'
import * as React from 'react'
import '@testing-library/jest-dom'

describe("Hub tests", () => {

    test("Add Producer then Consumer, message flows", done => {

        const hub = new Hub( () => null )

        hub.plug({
            name: "ProducerA",
            outputs: [{
                name: "out",
                outputObservable: new BehaviorSubject("Foo")
            }]
        })

        hub.plug({
            name: "ConsumerA",
            inputs: [{
                source: "ProducerA:out",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Foo")
                    done()
                }
            }]
        })
    })

    test("Add Producer then Consumer then Producer with same name, no duplicated messages", done => {

        const hub = new Hub( () => null )
        expect(hub.size()).toBe(0)

        const producerOutput1: Subject<any> = new Subject()
        const producerOutput2: Subject<any> = new Subject()

        hub.plug({
            name: "ProducerB",
            outputs: [{
                name: "out",
                outputObservable: producerOutput1
            }]
        })
        expect(hub.size()).toBe(1)

        hub.plug({
            name: "ConsumerB",
            inputs: [{
                source: "ProducerB:out",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Foo")
                    done()
                }
            }]
        })
        expect(hub.size()).toBe(2)

        hub.plug({
            name: "ProducerB",
            outputs: [{
                name: "out",
                outputObservable: producerOutput2
            }]
        })
        expect(hub.size()).toBe(2)

        producerOutput1.next("Bar")
        producerOutput2.next("Foo")
    })

    test("Add Consumer then Producer, message flows", done => {

        const hub = new Hub( () => null )

        const producerOutput: Subject<any> = new Subject()

        hub.plug({
            name: "ConsumerB",
            inputs: [{
                source: "ProducerB:out",
                sourceSubscriber: (data: any) => {
                    expect(data).toStrictEqual("Foo")
                    done()
                }
            }]
        })

        hub.plug({
            name: "ProducerB",
            outputs: [{
                name: "out",
                outputObservable: producerOutput
            }]
        })

        producerOutput.next("Foo")
    })

    test('Add Producer and Consumer, then remove Consumer, message does not flows', done => {

        const hub = new Hub( () => null )

        const producerOutput: Subject<any> = new Subject()

        hub.plug({
            name: "Producer",
            outputs: [{
                name: "out",
                outputObservable: producerOutput
            }]
        })

        let firstCall = false

        let plugTest = () => hub.plug({
            name: "Consumer",
            inputs: [{
                source: "Producer:out",
                sourceSubscriber: (data: any) => {
                    if( data === "First call"){
                        firstCall = true
                        return
                    }
                    if( data === "Should not call"){
                        fail("Unplugged should not be called")
                    }
                    if( data === "Last call"){
                        expect(firstCall).toBeTruthy()
                        done()
                    }
                }
            }]
        })

        plugTest()

        producerOutput.next("First call")
        hub.unplug("Consumer")
        producerOutput.next("Should not call")
        plugTest()
        producerOutput.next("Last call")
    })

    test('Add Producer and Consumer, then remove Producer, message does not flows', done => {

        const hub = new Hub( () => null )

        const producerOutput: Subject<any> = new Subject();

        let plugTest = () =>hub.plug({
            name: "ProducerToUnplug",
            outputs: [{
                name: "out",
                outputObservable: producerOutput
            }]
        })

        plugTest()

        let firstCall = false

        hub.plug({
            name: "Consumer",
            inputs: [{
                source: "ProducerToUnplug:out",
                sourceSubscriber: (data: any) => {
                    if( data === "First call"){
                        firstCall = true
                        return
                    }
                    if( data === "Should not call"){
                        fail("Unplugged should not be called")
                    }
                    if( data === "Last call"){
                        expect(firstCall).toBeTruthy()
                        done()
                    }
                }
            }]
        })

        producerOutput.next("First call")
        hub.unplug("ProducerToUnplug")
        producerOutput.next("Should not call")
        plugTest()
        producerOutput.next("Last call")
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
            expect(component.get("Renderable")).toStrictEqual(c)
            expect(props.get("Renderable")).toStrictEqual({a: "Foo"})
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
})