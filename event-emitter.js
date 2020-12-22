/**
 * Modified from https://www.npmjs.com/package/event-emitter, adapted for wechat miniprogram
 */
var defineProperty = Object.defineProperty;
var create = Object.create;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var descriptor = { configurable: true, enumerable: false, writable: true };
var namespace = '__ee__';

function callable(fn) {
  if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
  return fn;
}

function arrayClone(arr) {
  var len = arr.length;
	var copy = new Array(len);
  for (var i = 0; i < len; ++i) {
		copy[i] = arr[i];
	}
  return copy;
}

function EventEmitter() {}

EventEmitter.prototype.on = function (type, listener) {
  var data;

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

EventEmitter.prototype.once = function (type, listener) {
  var self = this;
  callable(listener);
  this.on.call(self, type, function once() {
    this.off.call(self, type, once);
    listener.apply(self, arguments);
  });

  return this;
}

EventEmitter.prototype.off = function (type, listener) {
  if (!hasOwnProperty.call(this, namespace)) return this;

  var data = this[namespace];

  if (!data[type]) return this;

  if (!listener) {
    data[type].length = 0;
  } else {
    var listeners = data[type] || [];

    var listenerIndex = listeners.indexOf(listener);

    if (listenerIndex > -1) {
      listeners.splice(listenerIndex, 1);
    }
  }

  return this;
}

EventEmitter.prototype.emit = function (type, ...args) {
  if (!hasOwnProperty.call(this, namespace)) return;
  var listeners = this[namespace][type];
  if (!listeners || !listeners.length) return;

  listeners = arrayClone(listeners);

  return Promise.all(listeners.map(listener => listener.apply(this, args)));
}

module.exports = EventEmitter;
