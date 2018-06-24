import React from "react";
import Canvas from "./Canvas";
import CanvasModel from "./CanvasModel";

export default class CanvasEditor extends React.Component {
  state = {
    canvases: Array.from(new Array(10)).map(
      (cell, index) => new CanvasModel(index)
    )
    // canvases: [
    //   new CanvasModel(1, 87.8, 50.4, 0),
    //   new CanvasModel(2, 87.8, 50.4, 45)
    // ]
  };
  onDragEnd = (id, x, y) => {
    const canvasModel = this.state.canvases.find(c => c.id === id);
    if (canvasModel) {
      canvasModel.setNewPosition(x, y);
      this.forceUpdate();
    }
  };

  render() {
    const { canvases } = this.state;
    return (
      <svg width="800" height="600" id="svg">
        {canvases.map(canvasModel => (
          <Canvas
            key={canvasModel.id}
            onDragEnd={this.onDragEnd}
            canvasModel={canvasModel}
            otherX={canvases
              .filter(o => o.id !== canvasModel.id)
              .reduce(
                (arr, c) => arr.concat(c.innerPoints.map(inn => inn.x)),
                []
              )
              .sort()}
            otherY={canvases
              .filter(o => o.id !== canvasModel.id)
              .reduce(
                (arr, c) => arr.concat(c.innerPoints.map(inn => inn.y)),
                []
              )
              .sort()}
          />
        ))}
      </svg>
    );
  }
}

// <g>
//   <foreignObject x="0" y="0" width="300" height="200">
//     <video width="300" height="200" controls>
//       <source
//         src="http://techslides.com/demos/sample-videos/small.mp4"
//         type="video/mp4"
//       />
//     </video>
//   </foreignObject>
// </g>
