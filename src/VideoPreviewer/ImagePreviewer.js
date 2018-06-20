export default class Media {
  constructor(dom) {
    this.dom = dom;
    this.currentTime = 0;
    this.duration = 0;
  }

  play() {
    if (this.dom instanceof HTMLVideoElement) this.dom.play();
  }

  pause() {}
}
