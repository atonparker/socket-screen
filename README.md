
#### Server

```javascript
const io = require('socket.io')(80);
const ss = require('socket-screen')(io);

// That's really it.
```

#### Receiver

```javascript
const io = require('socket.io-client');
const ss = require('socket-screen/client')(io);

ss.create((err, session) => {

  // Now we have a new session on the server. The user also needs to join the
  // session on their smartphone before the full interaction is there.
  if (!err) console.log(`join session ${session} on your second device`);

});

// Listen for when the second screen is paired up.
ss.on('pair', () => console.log('all set to go'));
ss.on('unpair', () => console.log('beep boop no input'));

// Listen for updates from the second screen.
ss.on('update', (message) => {
  
  let { x, y } = message.touch;
  console.log(`touched ${x}, ${y}`);

});

```

#### Sender

```javascript
const io = require('socket.io-client');
const ss = require('socket-screen/client')(io);

let session = prompt("What's your session?");

ss.join(session, (err, session) => {

  if (!err) console.log(`joined session ${session}`)

});

// The pair and unpair events work the same on both clients.
ss.on('pair', () => console.log('all set to go'));
ss.on('unpair', () => console.log('beep boop all alone'));

// Send all of the touch events to the receiver.
window.ontouchstart(touched);
window.ontouchmove(touched);
window.ontouchend(touched);

function touched(event) {

  let touch = event.touches.items(0);
  ss.update({ touch });

}


```
