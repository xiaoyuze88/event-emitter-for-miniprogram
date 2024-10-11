export type EventDefines = Record<string, any>;
export type EventName<T extends EventDefines> = string & keyof T;
export type EventListener<T> = (params: T) => void;
export type EventListenerResponseMap<T extends string> = Partial<Record<T, any>>;

export default class EventEmitter<
  Defines extends EventDefines = any,
  Response extends EventListenerResponseMap<EventName<Defines>> = any,
> {
  constructor();
  on: <Name extends EventName<Defines>>(type: Name, listener: EventListener<Defines[Name]>) => EventEmitter;
  once: <Name extends EventName<Defines>>(type: Name, listener: EventListener<Defines[Name]>) => EventEmitter;
  off: <Name extends EventName<Defines>>(type: Name, listener?: EventListener<Defines[Name]>) => EventEmitter;
  emit: <Name extends EventName<Defines>>(type: Name, params: Defines[Name]) => Promise<Array<Response[Name]>>;
}
