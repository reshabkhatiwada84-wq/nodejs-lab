const EventEmitter = require('events');

const orders = new EventEmitter();

orders.on('placed', (item) => {
    console.log(`Kitchen: prepare ${item}`);
});

orders.on('placed', (item) => {
    console.log(`Billing: charge for ${item}`);
});

orders.on('placed', (item) => {
    console.log('SMS: order confirmed');
});

orders.on('placed', (item) => {
    console.log(`Loyalty Points: added for ${item}`);
});

orders.emit('placed', 'Pizza');