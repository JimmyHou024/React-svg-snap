import React from "react";
import { DraggableCore } from "react-draggable";

export default () => (
  <DraggableCore
    onStart={() => {
      this.setState({ isMovingProgress: true });
    }}
    onDrag={this.onDragProgressBar}
    onStop={() => {
      this.setState({ isMovingProgress: false });
    }}
  >
    <g>
      <circle
        cx="100"
        cy="410"
        r="5"
        fill="pink"
        className="videoProgressAdjusterBall"
      />
      <line
        className="videoProgressAdjusterBar"
        x1="100"
        x2="100"
        y1="410"
        y2="450"
        strokeWidth="3"
        stroke="pink"
      />
    </g>
  </DraggableCore>
);
