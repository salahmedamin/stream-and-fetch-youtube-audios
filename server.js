const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");
// const { default: httpAdapter } = require("axios/lib/adapters/http");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => res.send("HELLO AND WELCOME"));

app.get("/stream/:videoId", async function (req, res) {
  try {
    res.set({ "Access-Control-Allow-Origin": "*" });
    // getAudio(req.params.videoId, res);
    const meta = await ytdl.getInfo(
      `https://www.youtube.com/watch?v=${req.params.videoId}`
    );
    const audio = meta.formats.find((e) => e.mimeType.startsWith("audio/"));
    if (!audio) throw new Error("Can't find an audio file");
    res.send(audio);
  } catch (error) {
    res.status(400).send({
      error: true,
      message: error.message,
      stack: error.stack,
    });
  }
});

app.get("/search/:text", async function (req, res) {
  try {
    const filters1 = await ytsr.getFilters(req.params.text);
    const filter1 = filters1.get("Type").get("Music");
    const data = await ytsr(filter1.url, req.query);
    res.send(data.items);
  } catch (error) {
    res.status(400).send({
      error: true,
      msg: error.stack,
    });
  }
});

app.get("/info/:videoId", async function (req, res) {
  try {
    const meta = await ytdl.getInfo(
      `https://www.youtube.com/watch?v=${req.params.videoId}`
    );
    /*const {
      player_response: {
        videoDetails: {
          lengthSeconds: length,
          title,
          author,
          thumbnail: { thumbnails },
        },
      },
    } = meta;
    const formed = {
      length: Number(length),
      author,
      title,
      thumbnails,
    };*/
    res.send(meta);
  } catch (error) {
    res.status(400).send({
      error: true,
    });
  }
});
