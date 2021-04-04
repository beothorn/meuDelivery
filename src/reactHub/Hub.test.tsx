import * as Hub from "./Hub";
import { Observable, Subject, BehaviorSubject } from 'rxjs';

test('Add input and output, message flows', done => {

    const producerOutput: BehaviorSubject<any> = new BehaviorSubject("Foo");

    Hub.plug({
        name: "Producer",
        outputs: [{
            name: "out",
            outputObservable: new BehaviorSubject("Foo")
        }]
    })

    Hub.plug({
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

    Hub.plug({
        name: "Producer1",
        outputs: [{
            name: "out",
            outputObservable: new BehaviorSubject("Foo")
        }]
    })

    Hub.plug({
        name: "Producer2",
        outputs: [{
            name: "out",
            outputObservable: new BehaviorSubject("Bar")
        }]
    })

    let count = 0

    Hub.plug({
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

    Hub.plug({
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

    Hub.plug({
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