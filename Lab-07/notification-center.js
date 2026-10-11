const EventEmitter = require('events');

class NotificationCenter extends EventEmitter {}

const notifier = new NotificationCenter();

notifier.on('newMessage', (from, text) => {
    console.log(`Message from ${from}: ${text}`);
});

notifier.on('error', (err) => {
    console.log(`Handled: ${err.message}`);
});

notifier.emit('newMessage', 'Priya', 'Are You free?');

notifier.on('userOnline', (user) => {
    console.log(`${user} is now online.`);
});

notifier.emit('userOnline', 'Aman');