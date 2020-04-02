import {Event, EventEmitter} from '../index';

class RaisedEvent extends Event {}
class DataEvent extends Event {
  data: "name"
}

const onRaised = jest.fn();
const onData = jest.fn();

// Begin tests
describe('Events', () => { 
  let events: EventEmitter;

  beforeEach(() => {
    onRaised.mockReset();
    onData.mockReset();
    
    events = new EventEmitter();

    events.on(RaisedEvent, onRaised);
    events.on(DataEvent, onData);
  })

  it("raises an event", () => {
    events.emit(RaisedEvent);
    expect(onRaised).toBeCalled();
  });

  it("raises an event with data", () => {
    events.emit(DataEvent, {
      data: "foo"
    })
    expect(onData.mock.calls[0][0].data).toEqual("foo");
  })
});