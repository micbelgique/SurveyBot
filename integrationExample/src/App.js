import React from "react";

import WebChat from "./components/WebChat";

import "./App.css";

function App(props) {
  return (
    <div className="App" style={{ height: "60vh" }}>
      <WebChat locale={props.locale} />
    </div>
  );
}

export default App;
