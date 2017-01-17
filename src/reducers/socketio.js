import IO from 'socket.io-client';

const socketio = (state = {}, action) => {
  switch (action.type) {
    case 'CONNECT_TO_SOCKETIO': {
      const socket = IO.connect();
      // @ToDo: The `socket` object contains information about connection state. Display it?
      return socket;
    }
    default:
      return state;
  }
};

export default socketio;
