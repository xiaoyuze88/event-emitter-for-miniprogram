type listenerCallback = (argus: any) => any;

export default class EventEmitter {
  constructor();
  on: (type: string, listener: listenerCallback) => EventEmitter;
  once: (type, listener: listenerCallback) => EventEmitter;
  off: (type, listener?: listenerCallback) => EventEmitter;
  emit: (type, ...argus) => Promise<any>;
}
