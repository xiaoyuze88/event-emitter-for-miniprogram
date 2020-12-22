const EventEmitter = require('./event-emitter')

class Test extends EventEmitter {}

const test = new Test();

const oops1 = () => {
	console.log('oops 1');

	// setTimeout(() => test.off('oops', oops1), 0)
}

const oops2 = () => {
	console.log('oops 2');
}

const oops3 = () => {
	console.log('oops 3');
}

test.on('oops', oops1)
	.on('oops', oops2)
	.on('oops', oops3);

test.emit('oops');
