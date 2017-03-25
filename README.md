# Super Duper Fiesta
Electronic voting system for the annual general meeting (AGM), or "generalforsamlingen/genfors" of _Linjeforeningen Online_

## How to contribute

### Looking for something to do?

Check out the [todo list](https://github.com/dotkom/super-duper-fiesta/projects/4).

### Dependencies

- Node.JS (and npm)
- MongoDB

### Instructions

- Start by cloning the repository, then running `npm install` from the root directory.
- The project uses React.JS for the frontend code, with redux mixed in for state management.
- The backend is an ExpressJS web server which exposes WebSockets in addition to a simple API. WebSockets is the primary source of communication in this project.
- The backend expects MongoDB to be running.
- All code is to be linted according to the specification listed in `.eslintrc`.
- Run `server/init.js` to bootstrap up a simple database.

## Communication between backend and frontend

The backend and frontend are connected by socket.io, following the ideology of [redux-socket.io](https://github.com/itaylor/redux-socket.io), namely that any action to be dispatched to the backend starts is on the form `server/<action>`, where `action` is a unique name for the action to be performed. The backend will emit events on the `action` channel, and every event will contain a `type` which is parsed by the client side of the library, and passed through to the correct reducer in the frontend. 

### Example

If the frontend dispatches an action `server/hello`, redux-socket.io will automatically dispatch this event to the backend. It's now up to the backend to handle this event.

Check out [this](https://github.com/dotKom/super-duper-fiesta/blob/master/src/reducers/issues.js#L3) example. Basically much like any other action as defined by redux.

If the backend dispatches an event on the channel `action`, it is required to have a `type` for the frontend to be able to parse it as an action. Import and use the helper function `emit` from `utils.js` to automate some of the repetetive tasks as demonstrated below.

```
// Emit an action to be handled by the frontend
emit(socket, 'OPEN_ISSUE', { description: "Issue number 1" });
```

This will be emitted on the `action` channel and be passed on to the reducers in the front end.


## WIP Screenshots

![https://i.imgur.com/KhoXBZ8.png](https://i.imgur.com/KhoXBZ8.png)
