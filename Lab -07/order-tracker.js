const EventEmitter = require('events');

class OrderTracker extends EventEmitter {
    placeOrder(order) {
        this.emit('orderPlaced', order);

        setTimeout(() => {
            this.emit('orderPrepared', order);
        }, 1000);

        setTimeout(() => {
            this.emit('orderDelivered', order);
        }, 2000);
    }
}

const tracker = new OrderTracker();

// orderPlaced - 2 listeners
tracker.on('orderPlaced', (order) => {
    console.log(`Customer: Order ${order} placed successfully.`);
});

tracker.on('orderPlaced', (order) => {
    console.log(`Restaurant: Received order ${order}.`);
});

// orderPrepared - 2 listeners
tracker.on('orderPrepared', (order) => {
    console.log(`Kitchen: Order ${order} is prepared.`);
});

tracker.on('orderPrepared', (order) => {
    console.log(`Delivery Partner: Pickup order ${order}.`);
});

// orderDelivered - 2 listeners
tracker.on('orderDelivered', (order) => {
    console.log(`Customer: Order ${order} delivered.`);
});

tracker.on('orderDelivered', (order) => {
    console.log(`System: Order ${order} completed.`);
});

// once() listener
tracker.once('firstOrderBonus', (order) => {
    console.log(`Bonus: First order bonus applied to ${order}.`);
});

// error listener
tracker.on('error', (err) => {
    console.log(`Order Error: ${err.message}`);
});

// Start order tracking
tracker.emit('firstOrderBonus', 'ORD001');
tracker.placeOrder('ORD001');