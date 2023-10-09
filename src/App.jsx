import { useRef, useState } from "react";
import { Button, TextField, Grid } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const App = () => {
  const videoRef = useRef(null);
  //state:
  const [text, setText] = useState("");
  const [posX, setPosX] = useState("10%"); // start text at 10% from right
  const [posY, setPosY] = useState("10%"); // start text at 10% from Top
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [fontSize, setFontSize] = useState(32);
  const [isTextVisible, setIsTextVisible] = useState(false); // to show and Hide Text

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    const videoPlayer = videojs(videoRef.current.id);
    const videoSource = videoPlayer.src([
      { type: file.type, src: URL.createObjectURL(file) }, // place the source video
    ]);
    videoPlayer.load();
    videoSource.type = file.type;
  };

  const handleInsertText = () => {
    const videoPlayer = videojs(videoRef.current.id);
    let overlay = null;

    const handleTimeUpdate = () => {
      const currentTime = videoPlayer.currentTime();
      // show text
      if (
        currentTime >= startTime &&
        currentTime < startTime + duration &&
        !isTextVisible
      ) {
        overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = posY;
        overlay.style.left = posX;
        overlay.style.fontSize = `${fontSize}px`;
        overlay.style.color = "red";
        overlay.innerText = text;
        videoPlayer.el().appendChild(overlay);
        setIsTextVisible(true);
      }
      // hide text
      else if (
        currentTime >= startTime + duration &&
        isTextVisible &&
        overlay
      ) {
        overlay.remove();
        setIsTextVisible(false);
      }
    };

    videoPlayer.on("timeupdate", handleTimeUpdate);

    return () => {
      videoPlayer.off("timeupdate", handleTimeUpdate);
    };
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      style={{ marginTop: "20px" }}
    >
      <Grid item xs={12}>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Position X"
          value={posX}
          onChange={(event) => setPosX(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Position Y"
          value={posY}
          onChange={(event) => setPosY(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Start Time (seconds)"
          type="number"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Duration (seconds)"
          type="number"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Font Size"
          type="number"
          value={fontSize}
          onChange={(event) => setFontSize(event.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Send />}
          onClick={handleInsertText}
        >
          Send
        </Button>
      </Grid>
      <Grid item xs={12}>
        <video
          ref={videoRef}
          id="videoPlayer"
          className="video-js vjs-default-skin vjs-big-play-centered"
          controls
        >
          <source src="" type="video/mp4" />
        </video>
      </Grid>
    </Grid>
  );
};

export default App;
