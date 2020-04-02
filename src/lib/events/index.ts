export class Event {}

export type EventClass<T extends Event> = new()=>T;
export type EventCallback<T = {}> = (payload:T)=>void;
export type EmitEvent = <T>(event: EventClass<T>, payload?: T)=>void;

export class EventEmitter {
  private events = new Map<EventClass<{}>, EventCallback<any>[]>();

  on<T>(event: new()=>T, callback: EventCallback<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    this.events.get(event)?.push(callback)
  }

  emit: EmitEvent = (Clazz, payload) => {
    const data = new Clazz();
    Object.assign(data, payload);

    this.events.get(Clazz)?.forEach( callback => {
        callback(data)
      })
  }
}