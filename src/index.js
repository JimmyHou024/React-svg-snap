import React from "react";
import { render } from "react-dom";
import CanvasEditor from "./CanvasEditor/CanvasEditor";
import VideoPreviewer from "./VideoPreviewer/VideoPreviewer.js";
import mediaList from "./VideoPreviewer/videoDataSet";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <CanvasEditor />
    <VideoPreviewer mediaList={mediaList} />
  </div>
);

render(<App />, document.getElementById("root"));
