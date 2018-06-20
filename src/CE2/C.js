import React from "react";
import { DraggableCore } from "react-draggable";

const style = {
  fill: "#c5d5cb",

  stroke: "red",
  strokeWidth: 2
};

const binarySearch = (d, t, s, e) => {
  const m = Math.floor((s + e) / 2);
  if (t === d[m]) return d[m];
  if (e - 1 === s) return Math.abs(d[s] - t) > Math.abs(d[e] - t) ? d[e] : d[s];
  if (t > d[m]) return binarySearch(d, t, m, e);
  if (t < d[m]) return binarySearch(d, t, s, m);
};

window.bs = binarySearch;

const SNAP_GAP = 15;
export default class Canvas extends React.Component {
  state = {
    x: this.props.canvasModel.x,
    y: this.props.canvasModel.y,
    snapX: this.props.canvasModel.x,
    snapY: this.props.canvasModel.y,
    snapXOffset: 0,
    snapYOffset: 0,
    isSnapX: false,
    isSnapY: false
  };

  onDrag = async (e, dragData) => {
    const { x, y } = this.state;
    const { otherX, otherY, canvasModel } = this.props;
    let isSnapX = false;
    let isSnapY = false;
    let snapXOffset = 0;
    let snapYOffset = 0;

    let newX = x + dragData.deltaX;
    let newY = y + dragData.deltaY;

    console.log(newX, x + dragData.deltaX);
    canvasModel.setNewPosition(newX, newY);

    const pointsX = canvasModel.innerPoints.map(point => {
      return (
        binarySearch(otherX.sort(), point.x, 0, otherX.length - 1) -
        (point.x + dragData.deltaX)
      );
    });
    let closestPointX = binarySearch(pointsX.sort(), 0, 0, pointsX.length - 1);
    // console.log(pointsX, closestPointX);
    if (Math.abs(closestPointX) <= SNAP_GAP) {
      isSnapX = true;
      snapXOffset = closestPointX;
    }

    const pointsY = canvasModel.innerPoints.map(point => {
      return (
        binarySearch(otherY, point.y, 0, otherY.length - 1) -
        (point.y + dragData.deltaY)
      );
    });
    let closestPointY = binarySearch(pointsY.sort(), 0, 0, pointsY.length - 1);
    // console.log(pointsY, closestPointY);
    if (Math.abs(closestPointY) <= SNAP_GAP) {
      isSnapY = true;
      snapYOffset = closestPointY;
    }

    // let closestPointX = binarySearch(otherX, newX, 0, otherX.length - 1);
    // if (closestPointX + SNAP_GAP >= newX && closestPointX - SNAP_GAP <= newX) {
    //   isSnapX = true;
    //   snapXOffset = closestPointX - newX;
    // }

    // let closestPointY = binarySearch(otherY, newY, 0, otherY.length - 1);
    // if (closestPointY + SNAP_GAP >= newY && closestPointY - SNAP_GAP <= newY) {
    //   isSnapY = true;
    //   snapYOffset = closestPointY - newY;
    // }

    this.setState({
      isSnapX,
      isSnapY,
      snapXOffset,
      snapYOffset,
      x: newX,
      y: newY,
      snapX: closestPointX,
      snapY: closestPointY
    });
  };

  onDragStart = () => {
    console.log("onDragStart");
  };

  onDragEnd = async () => {
    console.log("onDragEnd");
    const { isSnapX, isSnapY, x, y, snapXOffset, snapYOffset } = this.state;
    const snapObj = {
      isSnapX: false,
      isSnapY: false
    };

    if (isSnapX) {
      snapObj.x = x + snapXOffset;
    }
    if (isSnapY) {
      snapObj.y = y + snapYOffset;
    }
    await this.setState(() => {
      return snapObj;
    });
    this.props.onDragEnd(this.props.canvasModel.id, this.state.x, this.state.y);
  };

  render() {
    const {
      x,
      y,
      isSnapX,
      snapX,
      isSnapY,
      snapY,
      snapXOffset,
      snapYOffset
    } = this.state;
    const { canvasModel } = this.props;

    console.log(isSnapX ? x + snapXOffset : x, isSnapX, x, snapXOffset);

    return (
      <DraggableCore
        onStart={this.onDragStart}
        onDrag={this.onDrag}
        onStop={this.onDragEnd}
      >
        <g>
          <rect
            width={canvasModel.width}
            height={canvasModel.height}
            x={isSnapX ? x + snapXOffset : x}
            y={isSnapY ? y + snapYOffset : y}
            fill={style.fill}
          />
        </g>
      </DraggableCore>
    );
  }
}

// {
//   isSnapX && (
//     <line
//       y1={0}
//       y2={600}
//       x1={snapX}
//       x2={snapX}
//       stroke={style.stroke}
//       strokeWidth="1"
//     />
//   )
// }
// {
//   isSnapY && (
//     <line
//       y1={snapY}
//       y2={snapY}
//       x1={0}
//       x2={800}
//       stroke={style.stroke}
//       strokeWidth="1"
//     />
//   )
// }
