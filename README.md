# Super Duper Fiesta
Electronic voting system for the annual general meeting (AGM), or "generalforsamlingen/genfors" of _Linjeforeningen Online_

## WIP Screenshots

![https://i.imgur.com/KhoXBZ8.png](https://i.imgur.com/KhoXBZ8.png)

## How to contribute

### Dependencies

- Node.JS (and npm)
- MongoDB

### Instructions

- Start by cloning the repository, then running `npm install` from the root directory.
- The project uses React.JS for the frontend code, with redux mixed in for state management.
- The backend is an ExpressJS web server which exposes WebSockets in addition to a simple API. WebSockets is the primary source of communication in this project.
- The backend expects MongoDB to be running.
- All code is to be linted according to the specification listed in `.eslintrc`.
