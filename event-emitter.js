/**
 * Modified from https://www.npmjs.com/package/event-emitter, adapted for wechat miniprogram
 */
const { defineProperty, create } = Object;
const { hasOwnProperty } = Object.prototype;
const descriptor = { configurable: true, enumerable: false, writable: true };
const namespace = '__ee__';

function callable(fn) {
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  return fn;
}

module.exports = class EventEmitter {
  on(type, listener) {
    let data;

    callable(listener);

    if (!hasOwnProperty.call(this, namespace)) {
      data = descriptor.value = create(null);
      defineProperty(this, namespace, descriptor);
      descriptor.value = null;
    } else {
      data = this[namespace];
    }
    if (!data[type]) data[type] = [listener];
    else data[type].push(listener);

    return this;
  }

  once(type, listener) {
    let once,
      self;

    callable(listener);
    this.on.call(this, type, once = (...args) => {
      this.off.call(self, type, once);
      listener.apply(this, args);
    });

    return this;
  }

  off(type, listener) {
    if (!hasOwnProperty.call(this, namespace)) return this;

    const data = this[namespace];

    if (!data[type]) return this;

    if (!listener) {
      data[type].length = 0;
    } else {
      const listeners = data[type] || [];

      const listenerIndex = listeners.indexOf(listener);

      if (listenerIndex > -1) {
        listeners.splice(listenerIndex, 1);
      }
    }

    return this;
  }

  async emit(type, ...args) {
    if (!hasOwnProperty.call(this, namespace)) return;
    const listeners = this[namespace][type];
    if (!listeners || !listeners.length) return;
    return Promise.all(listeners.map(listener => listener.apply(this, args)));
  }
}
