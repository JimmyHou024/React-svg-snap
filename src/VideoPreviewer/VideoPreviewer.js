import React from "react";
import { DraggableCore } from "react-draggable";
import videoList from "./videoDataSet";
import "./VideoPreviewer.css";

const VIDEO_WIDTH = 600;
const MEDIA_TYPE = {
  IMAGE: "i",
  VIDEO: "v"
};

class ImgPlayer {
  constructor(ontimeupdate, onended, interval) {
    this.onended = onended;
    this.ontimeupdate = ontimeupdate;
    this.currentTime = 0;
    this.interval = interval;
    this.id = 0;
  }

  play = () => {
    console.log(this.currentTime);
    this.id = setInterval(() => {
      if (this.currentTime / 10 === this.interval) {
        clearInterval(this.id);
        this.onended();
      } else {
        this.ontimeupdate(this.currentTime / 10);
        this.currentTime += 1;
      }
    }, 100);
  };

  pause = () => {
    clearInterval(this.id);
  };

  reset = (currentTime, interval = this.interval) => {
    this.pause();
    this.currentTime = currentTime * 10;
    this.interval = interval;
    this.play();
  };
}

export default class VideoPreviewer extends React.Component {
  constructor(props) {
    super(props);
    // 計算影片總播放時間
    const totalDuration = this.props.mediaList.reduce(
      (total, v) => (total += v.length),
      0
    );

    // 建立圖片播放器
    this.ImgPlayer = new ImgPlayer(
      nowTick => this.ontimeupdate(nowTick),
      this.onended,
      0
    );

    this.state = {
      totalDuration,
      isMovingProgress: false,
      nowPlayIndex: 0,
      isPlaying: false
      // remains: 0,
      // totalRemains: 0
    };
  }

  nowPlayIndex = 0;

  componentDidMount() {
    if (videoList.length <= 0) return;

    this.addVideoEventListener();
    this.addImgEventListener();

    this.onNextMedia(0);
  }

  addVideoEventListener = () => {
    const videoDom = this.videoDom;
    videoDom.onloadeddata = () => {
      videoDom.play();
    };
    // 監聽video 播放進度
    videoDom.ontimeupdate = () => this.ontimeupdate(videoDom.currentTime);
    videoDom.onended = this.onended;
  };

  addImgEventListener = () => {
    const imgDom = this.imgDom;
    imgDom.onload = () => {
      // this.ImgPlayer.play();
      // const accTime =
      //   videoList
      //     .slice(0, this.nowPlayIndex)
      //     .reduce((acc, v) => acc + v.length, 0) + (imgDom.currentTime || 0);
      // this.setVideoProgressAdjuster(accTime);
    };
  };

  ontimeupdate = currentTime => {
    // console.log("currentTime", currentTime);
    const accTime =
      videoList
        .slice(0, this.nowPlayIndex)
        .reduce((acc, v) => acc + v.length, 0) + currentTime;
    this.setVideoProgressAdjuster(accTime);
  };

  onended = () => {
    this.nowPlayIndex = this.nowPlayIndex + 1;
    this.onNextMedia(0);
  };

  onClickProgressBar = (e, media, index) => {
    // 元件距離左邊界的距離
    const offsetLeft = e.target.getBoundingClientRect().left;
    const newPlayTime = e.clientX - offsetLeft;

    if (this.nowPlayIndex !== index) {
      this.nowPlayIndex = index;
    }
    console.log("newPlayTime", newPlayTime);
    this.onNextMedia(newPlayTime);
    // 設定播放指示棒
    // const videoProgressBarDom = document.querySelector(".videoProgressBar");
    // this.setVideoProgressAdjuster(
    //   e.clientX -
    //     videoProgressBarDom.getBoundingClientRect().left +
    //     videoProgressBarDom.scrollLeft
    // );
  };

  onNextMedia = currentTime => {
    if (this.nowPlayIndex >= videoList.length) return;
    const media = videoList[this.nowPlayIndex];

    if (media.type === MEDIA_TYPE.VIDEO) {
      this.ImgPlayer.pause();
      this.videoDom.style.display = "block";
      this.imgDom.style.display = "none";
      this.videoDom.setAttribute(
        "src",
        videoList[this.nowPlayIndex].sources[0]
      );
      this.videoDom.currentTime = currentTime;
      this.state.isPlaying ? this.videoDom.play() : this.videoDom.pause();
    } else if (media.type === MEDIA_TYPE.IMAGE) {
      this.videoDom.pause();
      this.videoDom.style.display = "none";
      this.imgDom.style.display = "block";
      this.imgDom.setAttribute("src", videoList[this.nowPlayIndex].sources[0]);
      // this.ImgPlayer.pause();
      console.log("onNextMedia", currentTime);
      this.ImgPlayer.reset(currentTime, media.length);
      // this.ImgPlayer.play();
    }
  };

  /**
   * 移動播放指示棒
   */
  setVideoProgressAdjuster = x => {
    const videoProgressAdjusterDom = document.querySelector(
      "#videoProgressAdjuster"
    );
    videoProgressAdjusterDom.setAttribute("transform", `translate(${x},0)`);
  };

  renderProgressBar = () => {
    let accumulatedLength = 0;
    return videoList.map((video, index) => {
      accumulatedLength += video.length;
      return (
        <rect
          key={video.title}
          x={accumulatedLength - video.length}
          y="2.5"
          rx="5"
          ry="5"
          width={video.length}
          height="35"
          stroke="red"
          onClick={e => this.onClickProgressBar(e, video, index)}
          data-media={video}
        />
      );
    });
  };

  /**
   * 播放/暫停影片
   */
  togglePlay = () => {
    const { isPlaying } = this.state;
    const media = videoList[this.nowPlayIndex];

    if (media.type === MEDIA_TYPE.VIDEO) {
      this.state.isPlaying ? this.videoDom.pause() : this.videoDom.play();
    } else if (media.type === MEDIA_TYPE.IMAGE) {
      this.state.isPlaying ? this.ImgPlayer.pause() : this.ImgPlayer.play();
    }

    this.setState({
      isPlaying: !isPlaying
    });
  };

  render() {
    const { isPlaying } = this.state;
    return (
      <div className="videoContainer">
        <div className="videoViewer">
          <svg width="800" height="500" id="svg">
            <g>
              <foreignObject x="100" y="0" width={VIDEO_WIDTH} height="500">
                <video
                  width={VIDEO_WIDTH}
                  height="400"
                  // controls
                  muted
                  ref={video => {
                    this.videoDom = video;
                  }}
                  style={{ display: "none" }}
                >
                  <source src="" type="video/mp4" />
                </video>
                <img
                  alt=""
                  width={VIDEO_WIDTH}
                  height="400"
                  style={{ display: "none" }}
                  ref={img => {
                    this.imgDom = img;
                  }}
                />
              </foreignObject>
            </g>
          </svg>
        </div>
        <div className="viewerToolbar">2</div>
        <div className="videoToolbar">
          <div className="videoOperateButton">
            <button onClick={this.togglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
          <div className="videoProgressBar">
            <svg
              width={this.state.totalDuration}
              height="40"
              style={{
                minWidth: "100%",
                backgroundColor: "#F3F7FA",
                borderRadius: "5px"
              }}
              fill="white"
            >
              {this.renderProgressBar()}
              <g transform="translate(0,0)" id="videoProgressAdjuster">
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
                      cx="0"
                      cy="0"
                      r="5"
                      fill="pink"
                      className="videoProgressAdjusterBall"
                    />
                    <line
                      className="videoProgressAdjusterBar"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="50"
                      strokeWidth="3"
                      stroke="pink"
                    />
                  </g>
                </DraggableCore>
              </g>
            </svg>
          </div>
          <div className="frameRate"> 12333</div>
        </div>
      </div>
    );
  }
}
