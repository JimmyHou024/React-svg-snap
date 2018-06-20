import React from "react";
import { DraggableCore } from "react-draggable";
import videoList from "./videoDataSet";
import "./VideoPreviewer.css";

const totalDuration = videoList.reduce(
  (total, v) => (total = v.length + total),
  0
);

const VIDEO_WIDTH = 600;
const MEDIA_TYPE = {
  IMAGE: "i",
  VIDEO: "v"
};

class Timer {
  constructor(func, cb, interval) {
    this.cb = cb;
    this.func = func;
    this.nowTick = 1;
    this.interval = interval;
    this.id = 0;
  }

  play = () => {
    this.id = setInterval(() => {
      if (this.nowTick === this.interval) {
        clearInterval(this.id);
        this.cb();
      } else {
        this.func();
      }
      console.log(this.nowTick);
      this.nowTick += 1;
    }, 1000);

    console.log(this.id);
  };

  pause = () => {
    console.log(this.id);
    clearInterval(this.id);
  };
}

export default class VideoPreviewer extends React.Component {
  state = {
    isMovingProgress: false,
    nowPlayIndex: 0,
    isPlaying: false,
    remains: 0,
    totalRemains: 0
  };

  nowPlayIndex = 0;

  componentDidMount() {
    const mediaDom =
      videoList[0].type === MEDIA_TYPE.IMAGE ? this.imgDom : this.videoDom;

    if (videoList.length) {
      mediaDom.setAttribute("src", videoList[0].sources);
      mediaDom.style.display = "block";
      // videoDom.play();
    }
    this.addVideoEventListener();
    this.addImgEventListener();
  }

  addVideoEventListener = () => {
    const videoDom = this.videoDom;
    videoDom.onloadeddata = () => {
      videoDom.play();
    };

    // 監聽video 播放進度
    videoDom.ontimeupdate = () => {
      const duration = videoDom.duration;

      if (duration > 0) {
        const accTime =
          videoList
            .slice(0, this.nowPlayIndex)
            .reduce((acc, v) => acc + v.length, 0) + videoDom.currentTime;
        this.setVideoProgressAdjuster(accTime);
      }
    };

    videoDom.onended = () => {
      this.nowPlayIndex = this.nowPlayIndex + 1;
      this.onNextMedia();
    };
  };

  timer = null;

  addImgEventListener = () => {
    const imgDom = this.imgDom;

    imgDom.onload = () => {
      const accTime =
        videoList
          .slice(0, this.nowPlayIndex)
          .reduce((acc, v) => acc + v.length, 0) + (imgDom.currentTime || 0);
      this.setVideoProgressAdjuster(accTime);
    };
  };

  onChangeSource = (e, media, index) => {
    // 元件距離左邊界的距離
    const offsetLeft = e.target.getBoundingClientRect().left;
    const newPlayTime = e.clientX - offsetLeft;

    if (this.nowPlayIndex !== index) {
      this.nowPlayIndex = index;
    }
    this.onNextMedia(newPlayTime);
    // 設定播放指示棒
    const videoProgressBarDom = document.querySelector(".videoProgressBar");
    this.setVideoProgressAdjuster(
      e.clientX -
        videoProgressBarDom.getBoundingClientRect().left +
        videoProgressBarDom.scrollLeft
    );
  };

  onNextMedia = currentTime => {
    const media = videoList[this.nowPlayIndex];

    if (media.type === MEDIA_TYPE.VIDEO) {
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
      this.imgDom.currentTime = currentTime;
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
          x={accumulatedLength - video.length}
          y="2.5"
          rx="5"
          ry="5"
          width={video.length}
          height="35"
          stroke="red"
          onClick={e => this.onChangeSource(e, video, index)}
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

    if (!this.timer) {
      this.timer = new Timer(() => {
        console.log("down");
      }, 10);
    }

    if (isPlaying) this.videoDom.pause();
    if (!isPlaying) this.videoDom.play();
    // if (isPlaying) this.timer.pause();
    // if (!isPlaying) this.timer.play();

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
                  src
                  alt
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
              width={totalDuration}
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
                  // onDrag={this.onDragProgressBar}
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

// componentDidMount() {
//   const videoDom = this.videoDom;
//   const videoToolBarDom = document.querySelector(".videoToolBar");
//   videoDom.onprogress = () => {
//     const duration = videoDom.duration;
//     // const videoToolBarDomLength = videoToolBarDom.width.baseVal.value;
//     const videoToolBarDomLength = totalDuration;
//     const videoDownloadDom = document.querySelector(".videoDownload");
//     if (duration > 0) {
//       for (let i = 0; i < videoDom.buffered.length; i++) {
//         if (
//           videoDom.buffered.start(videoDom.buffered.length - 1 - i) <
//           videoDom.currentTime
//         ) {
//           videoDownloadDom.setAttribute(
//             "width",
//             `${videoDom.buffered.end(videoDom.buffered.length - 1 - i) /
//               totalDuration *
//               videoToolBarDomLength}px`
//           );
//           break;
//         }
//       }
//     }
//   };

//   videoDom.ontimeupdate = () => {
//     const duration = videoDom.duration;
//     // const videoToolBarDomLength = videoToolBarDom.width.baseVal.value;
//     const videoToolBarDomLength = totalDuration;
//     const videoProgressDom = document.querySelector(".videoProgress");

//     if (duration > 0) {
//       videoProgressDom.setAttribute(
//         "width",
//         `${videoDom.currentTime / totalDuration * videoToolBarDomLength}px`
//       );
//       if (!this.state.isMovingProgress) {
//         this.setProgressAdjusterPosition(
//           videoDom.currentTime / duration * videoToolBarDomLength
//         );
//       }
//     }
//   };
// }

// onAdjustProgress = async (e, id) => {
//   const videoDom = this.video;
//   if (this.state.nowPlayIndex !== id) {
//     videoDom.setAttribute("src", videoList[id].sources);
//     // await this.setState(() => ({ nowPlayIndex: id }));
//   }

//   const targetPosition = e.clientX - e.target.getBoundingClientRect().left;
//   const videoToolBarDomLength = totalDuration;
//   videoDom.currentTime =
//     // newVideo.duration / videoToolBarDomLength * targetPosition;
//     totalDuration / videoToolBarDomLength * targetPosition;
// };

// onDragProgressBar = (e, dragData) => {
//   const videoDom = this.video;
//   const videoToolBarDomLength = document.querySelector(".videoToolBar").width
//     .baseVal.value;
//   let targetPosition = dragData.x - videoDom.getBoundingClientRect().left;
//   targetPosition =
//     targetPosition >= 0 && targetPosition <= videoToolBarDomLength
//       ? targetPosition
//       : targetPosition < 0 ? 0 : videoToolBarDomLength;

//   this.setProgressAdjusterPosition(targetPosition);
//   videoDom.currentTime =
//     videoDom.duration / videoToolBarDomLength * targetPosition;
// };

// setProgressAdjusterPosition = x => {
//   document
//     .querySelector(".videoProgressAdjusterBall")
//     .setAttribute("cx", x + 100);
//   document
//     .querySelector(".videoProgressAdjusterBar")
//     .setAttribute("x1", x + 100);
//   document
//     .querySelector(".videoProgressAdjusterBar")
//     .setAttribute("x2", x + 100);
// };

// renderProgressBar = () => {
//   let accumulatedLength = 0;
//   return videoList.map((video, index) => {
//     accumulatedLength += video.length;
//     return (
//       <g>
//         <rect
//           x="100"
//           y="420"
//           width="0"
//           height="20"
//           fill="gray"
//           className="videoDownload"
//         />
//         <rect
//           x="100"
//           y="420"
//           width="0"
//           height="20"
//           fill="black"
//           className="videoProgress"
//         />
//         <rect
//           x={100 + accumulatedLength - video.length}
//           y="420"
//           width={video.length}
//           height="20"
//           fill="transparent"
//           stroke="red"
//           className="videoToolBar"
//           onClick={e => this.onAdjustProgress(e, index)}
//         />
//       </g>
//     );
//   });
// };

/*
<svg width="800" height="600" id="svg">
  <g>
    <foreignObject x="100" y="0" width={VIDEO_WIDTH} height="400">
      <video
        width={VIDEO_WIDTH}
        height="400"
        controls
        ref={video => {
          this.video = video;
        }}
      >
        <source src="" type="video/mp4" />
      </video>
    </foreignObject>
    <g>{this.renderProgressBar()}</g>
    <g>
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
    </g>
  </g>
</svg>
*/
