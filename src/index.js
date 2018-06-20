import React from "react";
import { render } from "react-dom";
import CanvasEditor from "./CanvasEditor/CanvasEditor";
import CE from "./CE2/CE";
import VideoPreviewer from "./VideoPreviewer/VideoPreviewer.js";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <CanvasEditor />
  </div>
);

render(<App />, document.getElementById("root"));
