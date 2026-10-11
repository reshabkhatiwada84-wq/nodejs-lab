Task 1 : What happened and why?
When emit() was written before on(), nothing was printed.
Why? Because the greet event was triggered when no listener was registered yet. Node.js EventEmitter does not save that event and replay it later when a listener is added.

So:
emit() → event happens → no listener → event is missed

When on() comes first:
on() → listener registered → emit() → listener executes

That's why Hello, Class! was printed in the correct order.

Task 5 :📝 Task 5 ka concept
Without listener: Error unhandled → program terminate.
With listener: Error handled → program safely continues.
Pehle ye run karo aur output bhejo. Phir Task 5 complete karke Task 6 par jayenge.



# Lab 07 – EventEmitter and Event-Driven Programming

## Student Information

- Name: Rishabh Khatiwada
- Scholar No.: 23145018
- Course: BCA VII Semester
- University: Dev Sanskriti Vishwavidyalaya

## Objective

To understand Node.js EventEmitter and event-driven programming by creating
custom events, multiple listeners, error handling, class-based EventEmitter,
and a real-time order tracking system.

## Tasks Completed

### Task 1 – Project Setup
Created the Lab 07 project folder and initialized the Node.js project.

### Task 2 – First Custom Event
Created a custom `greet` event using EventEmitter and emitted the event
with a name.

### Task 3 – Multiple Listeners
Created multiple listeners for the same `placed` event. All listeners were
executed when the event was emitted.

### Task 4 – once() vs on()
Demonstrated the difference between `once()` and `on()`.

- `once()` executes the listener only one time.
- `on()` executes the listener every time the event is emitted.

### Task 5 – Error Event
Learned how an `error` event behaves when there is no listener and how to
handle it safely using an error listener.

### Task 6 – EventEmitter with Class
Created a `NotificationCenter` class that extends EventEmitter and handled
custom notification events.

### Task 7 – Real-Time Order Tracking
Created an `OrderTracker` class that extends EventEmitter.

The project tracks the following order events:

- `orderPlaced`
- `orderPrepared`
- `orderDelivered`
- `firstOrderBonus`
- `error`

Multiple listeners were used for the order lifecycle events and
`setTimeout()` was used to simulate real-time order processing.

### Task 8 – Reflection
Studied the connection between EventEmitter and the Observer Pattern and
understood how Node.js APIs use event-driven programming.

## Files

| File | Description |
|---|---|
| `events-basic.js` | First custom event |
| `order-system.js` | Multiple event listeners |
| `once-vs-on.js` | Demonstrates `once()` and `on()` |
| `error-handling.js` | Error event handling |
| `notification-center.js` | EventEmitter with class |
| `order-tracker.js` | Real-time order tracking |
| `reflection-notes.txt` | Reflection answers |

## Key Concepts Learned

- EventEmitter
- Custom Events
- Event Listeners
- `on()`
- `once()`
- `emit()`
- Error Handling
- Event-Driven Programming
- Observer Pattern
- Class-based EventEmitter
- Asynchronous Events using `setTimeout()`

## Conclusion

This lab helped me understand how Node.js uses event-driven programming.
I learned how to create and emit custom events, register multiple listeners,
handle errors, use `once()` and `on()`, and build a practical order tracking
system using EventEmitter.