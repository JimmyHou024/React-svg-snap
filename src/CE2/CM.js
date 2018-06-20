export default class CanvasModel {
  constructor(index, width = 100, height = 50) {
    this.id = index;
    this.x = Math.round(Math.random() * 600 + 1);
    this.y = Math.round(Math.random() * 400 + 1);
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.outerPoints = this.rotateMartix(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.x,
      this.y,
      this.angle
    );
    this.innerPoints = this.rotateMartix(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.x,
      this.y,
      this.angle
    );
  }

  setNewPosition = (x, y) => {
    this.x = x;
    this.y = y;

    this.outerPoints = this.rotateMartix(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.x,
      this.y,
      this.angle
    );
    this.innerPoints = this.rotateMartix(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.x,
      this.y,
      this.angle
    );
  };

  /**
   *  旋轉矩陣公式
   * @param {number} centerX 四邊形的中心點 X 座標
   * @param {number} centerY 四邊形的中心點 Y 座標
   * @param {number} x 四邊形的左上角 X 座標
   * @param {number} y 四邊形的左上角 Y 座標
   * @param {number} angle 旋轉角度(順時鐘旋轉)
   */
  rotateMartix(centerX, centerY, x, y, angle) {
    const points = [
      { x: -(centerX - x), y: -(centerY - y) },
      { x: centerX - x, y: -(centerY - y) },
      { x: centerX - x, y: centerY - y },
      { x: -(centerX - x), y: centerY - y }
    ];
    const PI = Math.PI / 180;
    const rorateArray = [
      [Math.cos(angle * PI), -Math.sin(angle * PI)],
      [Math.sin(angle * PI), Math.cos(angle * PI)]
    ];

    // return points.map(item => ({
    //   x: Math.round((rotateArray[0][0] * item.x) + (rorateArray[0][1] * item.y) + centerX),
    //   y: Math.round((rorateArray[1][0] * item.x) + (rorateArray[1][1] * item.y) + centerY)
    // }));
    return points.map(item => ({
      x: Math.round(
        rorateArray[0][0] * item.x + rorateArray[0][1] * item.y + centerX
      ),
      y: Math.round(
        rorateArray[1][0] * item.x + rorateArray[1][1] * item.y + centerY
      )
    }));
  }
}
