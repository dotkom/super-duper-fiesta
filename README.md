# Super Duper Fiesta
[![Build Status](https://ci.online.ntnu.no/api/badges/dotkom/super-duper-fiesta/status.svg?branch=master)](https://ci.online.ntnu.no/dotkom/super-duper-fiesta)
[![codecov](https://codecov.io/gh/dotkom/super-duper-fiesta/branch/master/graph/badge.svg)](https://codecov.io/gh/dotkom/super-duper-fiesta)

Electronic voting system for the annual general meeting (AGM), or "generalforsamlingen/genfors" of _Linjeforeningen Online_

## How to contribute

### Looking for something to do?

Check out the [todo list](https://github.com/dotkom/super-duper-fiesta/projects/4).

### Dependencies

- Node.JS (and npm)
- MongoDB

### Instructions

- Start by cloning the repository, then running `npm install` from the root directory.
- Run backend with `npm run backend`.
- Run frontend with `npm run frontend`

### Instructions (production)

#### Docker

This is an example of a docker command to run super-duper-fiesta in production.

`docker build -f Dockerfile.prod -t sdf_prod .`

```
docker run \
  -p 3000:3000 \
  -e SDF_OAUTH2_RESOURCE_BACKEND \
  -e SDF_OAUTH2_PROVIDER_BACKEND \
  -e SDF_OAUTH2_CLIENT_ID \
  -e SDF_OAUTH2_CLIENT_SECRET \
  -e SDF_OAUTH2_CALLBACK_URL \
  -e SDF_DATABASE_URL=mongodb://path_to_db/sdf \
  -e SDF_HOST=0.0.0.0 \
  --name sdf_prod \
  --rm \
  sdf_prod
```

#### Other

- `npm install`
- `npm run build:prod`
- Make sure the relevant environment variables are set
  - `NODE_EN=production`
  - `PRODUCTION=true`
  - Any other required variables, see the [configuration section](#configuration)
- `npm start` (or `node server/app.js`)

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

Most of the configuration of this app is done using environment variables.

(Tip: Use a tool like "autoenv" to automatically set environment variables upon entering a project directory.)

Linux, MacOS:

Current terminal:  
- `export VARIABLE_NAME=VARIABLE_VALUE`

To persist the changes, look into a tool like "autoenv" as mentioned earlier, or set them in `~/.profile` (not recommended...).

Windows: 

Current terminal:  
- `set VARIABLE_NAME=VARIABLE_VALUE`

Current user (permanent):  
- `setx VARIABLE_NAME VARIABLE_VALUE`

### General

| Key | Description | Example | Default |
| --- | ---         | ---     | ---     |
| `PRODUCTION` | Run the app in production mode | `true` | `''` |

### ExpressJS

| Key | Description | Example | Default |
| --- | ---         | ---     | ---     |
| `SDF_HOST` | Host to run the app on | `127.0.0.1` | `127.0.0.1` |
| `SDF_PORT` | Port to run the app on | `3000` | `3000` |
| `SDF_SCHEME` | HTTP Scheme to run the app on | `http` | `http` |
| `SDF_DATABASE_URL` | Connection string for MongoDB (including database name) | `mongodb://localhost/` | `mongodb://localhost/sdf` |
| `SDF_DATABASE_NAME` | Name of MongoDB database | `sdf` | `sdf` |

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
| `SDF_OAUTH2_CALLBACK_URL` | Callback URL to the app | `http://127.0.0.1:8080/auth` | `''` |


_If running the OAuth2 provider in [onlineweb4](/dotkom/onlineweb4) locally, remember that webpack uses port 3000 by default, so you'll likely have to use another port for super-duper-fiesta._


## WIP Screenshots

### Front page, no active issue

![https://i.imgur.com/hzqz3KN.png](https://i.imgur.com/hzqz3KN.png)


### Front page, active issue

![https://i.imgur.com/ZnwjXwR.png](https://i.imgur.com/ZnwjXwR.png)

### Admin page, overview

![https://i.imgur.com/6D5XOXd.png](https://i.imgur.com/6D5XOXd.png)


### Admin page, user administration

![https://i.imgur.com/x4bgoJT.png](https://i.imgur.com/x4bgoJT.png)
