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

Build image: `docker build -f Dockerfile.prod -t sdf_prod .`

```bash
docker run \
  -p 3000:3000 \
  -e DATABASE_URL \
  -e SDF_OIDC_PROVIDER \
  -e SDF_OIDC_CLIENT_ID \
  -e SDF_BACKEND_HOST=0.0.0.0 \
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
| `SDF_HOST` | Host to run the webpack dev server on | `127.0.0.1` | `127.0.0.1` |
| `SDF_PORT` | Port to run the webpack dev server on | `3000` | `3000` |

### ExpressJS

| Key | Description | Example | Default |
| --- | ---         | ---     | ---     |
| `SDF_BACKEND_HOST` | Host to run the app on | `127.0.0.1` | `127.0.0.1` |
| `SDF_BACKEND_PORT` | Port to run the app on | `8080` | `8080` |
| `SDF_SCHEME` | HTTP Scheme to run the app on | `http` | `http` |

### Database

The database connection can be configured using DATABASE_URL, which is a connection URI exposed to ENV on the format:

- `protocol://[user:password@]address[:port]/database_name`

Example PostgreSQL connection URI:

- `postgresql://sdf:secretpassword@127.0.0.1:5432/sdf`

Or SQLite: `sqlite:///path/to/database.db` (note the three `/`, the first two are part of the protocol separator and the final one denotes the root of your file system)

For further configuration of Sequelize, check out `.sequelizerc`. This contains information about paths to model, migration and seed folders.

#### Migrations

The project is bootstrapped and expected to use migrations for model changes. Migrations can be applied by running

- `yarn db:migrations` (which executes `sequelize db:migrate`)

When running migrations, you have to specify `--url $DATABASE_URL` for Sequelize-cli to understand that you want to connect using the DATABASE_URL configuration.

The (fairly lacking) documentation for Sequelize migrations and how to create them can be found [here](http://docs.sequelizejs.com/manual/tutorial/migrations.html) or by executing `sequelize --help`.

### OpenID Connect

Authentication can be done through OpenID Connect.

This requires an OpenID Client ID as well as an OpenID Provider capable of providing the "onlineweb4" claim. [source](https://github.com/dotkom/onlineweb4/blob/develop/apps/oidc_provider/claims.py#L33)

| Key | Description | Example | Default |
| --- | ---         | ---     | ---     |
| `SDF_OIDC_PROVIDER` | OpenID Connect Provider (Issuer) | `http://127.0.0.1:8000/openid` | `` |
| `SDF_OIDC_CLIENT_ID` | ClientID of an OIDC client on OIDC provider | `123456` | `` |
| `SDF_OIDC_REDIRECT_URI` | Redirect URI back to SDF | `http://127.0.0.1:8080/auth` | `` |

_If running the OpenID Connect provider in [onlineweb4](/dotkom/onlineweb4) locally, remember that webpack uses port 3000 by default, so you'll likely have to use another port for super-duper-fiesta._

## WIP Screenshots

### Front page, no active issue

![https://i.imgur.com/hzqz3KN.png](https://i.imgur.com/hzqz3KN.png)


### Front page, active issue

![https://i.imgur.com/ZnwjXwR.png](https://i.imgur.com/ZnwjXwR.png)

### Admin page, overview

![https://i.imgur.com/6D5XOXd.png](https://i.imgur.com/6D5XOXd.png)


### Admin page, user administration

![https://i.imgur.com/x4bgoJT.png](https://i.imgur.com/x4bgoJT.png)
