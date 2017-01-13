import React from "react";
import ReactDOM from "react-dom";
import Hello from "./components/hello";


const App = () => {
  return (
    <div>
      <Hello />
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
