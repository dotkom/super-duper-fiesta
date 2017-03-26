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
- Bootstrap the database by running `node server/init.js`.
- Run `npm start`.

#### Other requirements

- All code is to be linted according to the specification listed in `.eslintrc`.


### Architecture

- The project uses React.JS for the frontend code, with redux mixed in for state management.
- The backend is an ExpressJS web server which exposes WebSockets in addition to a simple API. WebSockets is the primary source of communication in this project.

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


## Configuration

### OAuth2

Authentication and authorization happens using OAuth2 and SSO.

Make sure to have access to the OAuth2 client ID and secret for the app, or create your own.

To configure the app to use the OAuth2 provider, set the following values using environment variables (`export KEY=VALUE`).

| Key | Description | Example | Default |
| --- | ---         | ---     | ---     |
| `SDF_OAUTH2_RESOURCE_BACKEND` | Resource backend (API) | `http://127.0.0.1:8000` | `''` |
| `SDF_OW4_USERS_API_ENDPOINT` | Endpoint for the users resource | `/sso/user/` |  `/sso/user/` |
| `SDF_OAUTH2_PROVIDER_BACKEND` | OAuth2 Provider backend | `http://127.0.0.1:8000` | `''` |
| `SDF_OAUTH2_AUTHORIZATION_URL` | URL to redirect user to for OAuth2 authorization | `/sso/o/authorize/` | `/sso/o/authorize/` |
| `SDF_OAUTH2_TOKEN_URL` | URL to fetch OAuth2 token | `/sso/o/token/` | `/sso/o/token/` |
| `SDF_OAUTH2_CLIENT_ID` | Client ID for app | `client id` | `''` |
| `SDF_OAUTH2_CLIENT_SECRET` | Client secret for app | `client secret` | `''` |
| `SDF_OAUTH2_CALLBACK_URL` | Callback URL to the app | `http://127.0.0.1:3000/auth` | `''` |

(Tip: Use a tool like "autoenv" to automatically set environment variables upon entering a project directory.)

_If running the OAuth2 provider in [onlineweb4](/dotkom/onlineweb4) locally, remember that webpack uses port 3000 by default, so you'll likely have to use another port for super-duper-fiesta._


## WIP Screenshots

![https://i.imgur.com/KhoXBZ8.png](https://i.imgur.com/KhoXBZ8.png)
