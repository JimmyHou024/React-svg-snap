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

const SNAP_GAP = 8;
export default class Canvas extends React.Component {
  state = {
    x: this.props.canvasModel.x,
    y: this.props.canvasModel.y,
    snapXOffset: 0,
    snapYOffset: 0,
    isSnapX: false,
    isSnapY: false
  };

  onDrag = async (e, dragData) => {
    const { x, y, snapXOffset, snapYOffset } = this.state;
    const { otherX, otherY, canvasModel } = this.props;
    let newIsSnapX = false;
    let newIsSnapY = false;
    let newSnapXOffset = snapXOffset;
    let newSnapYOffset = snapYOffset;

    let newX = x + dragData.deltaX;
    let newY = y + dragData.deltaY;

    canvasModel.setNewPosition(newX, newY);

    const closestPointX = canvasModel.innerPoints.reduce(
      (acc, point) => {
        if (
          Math.abs(
            binarySearch(otherX, point.x, 0, otherX.length - 1) - point.x
          ) < Math.abs(acc.xOffset)
        ) {
          return {
            x: point.x,
            xOffset:
              binarySearch(otherX, point.x, 0, otherX.length - 1) - point.x
          };
        }
        return acc;
      },
      { x: Number.MAX_SAFE_INTEGER, xOffset: Number.MAX_SAFE_INTEGER }
    );

    console.log(closestPointX);

    if (Math.abs(closestPointX.xOffset) <= SNAP_GAP) {
      newIsSnapX = true;
      newSnapXOffset = closestPointX;
    }

    const closestPointY = canvasModel.innerPoints.reduce(
      (acc, point) => {
        if (
          Math.abs(
            binarySearch(otherY, point.y, 0, otherY.length - 1) - point.y
          ) < Math.abs(acc.yOffset)
        ) {
          return {
            y: point.y,
            yOffset:
              binarySearch(otherY, point.y, 0, otherY.length - 1) - point.y
          };
        }
        return acc;
      },
      { y: Number.MAX_SAFE_INTEGER, yOffset: Number.MAX_SAFE_INTEGER }
    );

    if (Math.abs(closestPointY.yOffset) <= SNAP_GAP) {
      newIsSnapY = true;
      newSnapYOffset = closestPointY;
    }
    this.setState({
      isSnapX: newIsSnapX,
      isSnapY: newIsSnapY,
      snapXOffset: newSnapXOffset,
      snapYOffset: newSnapYOffset,
      x: newX,
      y: newY
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
      snapObj.x = x + snapXOffset.xOffset;
    }
    if (isSnapY) {
      snapObj.y = y + snapYOffset.yOffset;
    }
    await this.setState(() => {
      return snapObj;
    });
    this.props.onDragEnd(this.props.canvasModel.id, this.state.x, this.state.y);
  };

  render() {
    const { x, y, isSnapX, isSnapY, snapXOffset, snapYOffset } = this.state;
    const { canvasModel } = this.props;

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
            x={isSnapX ? x + snapXOffset.xOffset : x}
            y={isSnapY ? y + snapYOffset.yOffset : y}
            fill={style.fill}
            transform={`rotate(${canvasModel.angle},${
              isSnapX
                ? canvasModel.center.x + snapXOffset.xOffset
                : canvasModel.center.x
            },
            ${
              isSnapY
                ? canvasModel.center.y + snapYOffset.yOffset
                : canvasModel.center.y
            })`}
          />
          {isSnapX && (
            <line
              y1={0}
              y2={600}
              x1={snapXOffset.x + snapXOffset.xOffset}
              x2={snapXOffset.x + snapXOffset.xOffset}
              stroke={style.stroke}
              strokeWidth="1"
            />
          )}
          {isSnapY && (
            <line
              y1={snapYOffset.y + snapYOffset.yOffset}
              y2={snapYOffset.y + snapYOffset.yOffset}
              x1={0}
              x2={800}
              stroke={style.stroke}
              strokeWidth="1"
            />
          )}
        </g>
      </DraggableCore>
    );
  }
}
