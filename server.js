const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/stream/:videoId", function (req, res) {
  try {
    res.set({ "Content-Type": "audio/mpeg" });
    res.set({ "Access-Control-Allow-Origin": "https://d9wfb1.csb.app" });
    getAudio(req.params.videoId, res);
  } catch (error) {
    res.status(400).send({
      error: true
    });
  }
});

app.get("/search/:text", async function (req, res) {
  try {
    const filters1 = await ytsr.getFilters(req.params.text);
    const filter1 = filters1.get("Type").get("Video");
    const data = await ytsr(filter1.url, req.query);
    res.send(data.items);
  } catch (error) {
    res.status(400).send({
      error: true,
      msg: error.stack
    });
  }
});

app.get("/info/:videoId", async function (req, res) {
  try {
    const meta = await ytdl.getInfo(
      `https://www.youtube.com/watch?v=${req.params.videoId}`
    );
    const {
      player_response: {
        videoDetails: {
          lengthSeconds: length,
          title,
          author,
          thumbnail: { thumbnails }
        }
      }
    } = meta;
    const formed = {
      length: Number(length),
      author,
      title,
      thumbnails
    };
    res.send(formed);
  } catch (error) {
    res.status(400).send({
      error: true
    });
  }
});

const getAudio = (id, res) => {
  ytdl(`https://www.youtube.com/watch?v=${id}`, {
    quality: "lowestaudio",
    filter: "audioonly"
  }).pipe(res);
};
