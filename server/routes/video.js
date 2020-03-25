const express = require("express");
const router = express.Router();
var ffmpeg = require("fluent-ffmpeg");
const upload = require("../middleware/upload");

//mongoose model
const Video = require("../models/Video");
const Subscriber = require("../models/Subscriber");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//   upload file through form-data
//path,  /api/video/uploadfiles
//access, private
router.post("/uploadfiles", upload, async (req, res) => {
  try {
    const mime = req.file.mimetype;
    if (
      mime === "image/gif" ||
      mime === "image/png" ||
      mime === "image/jpg" ||
      mime === "image/jpeg" ||
      mime === "image/webp"
    ) {
      return res.json({
        success: true,
        isImage: true,
        filePath: req.file.path,
        fileType: req.file.mimetype
      });
    }

    let thumbsFilePath = "";
    let fileDuration = "";
    let fileSize = 0;

    //generate
    ffmpeg.ffprobe(req.file.path, function(err, metadata) {
      if (err) console.log(("ffprobe error", err));

      fileDuration = metadata.format.duration;
      fileSize = metadata.format.size;
    });

    ffmpeg(req.file.path)
      .on("filenames", function(filenames) {
        // console.log("Will generate " + filenames.join(", "));
        thumbsFilePath = "uploads/video/thumbnails/" + filenames[0];
      })
      .on("end", function() {
        // console.log("Screenshots taken");
        return res.json({
          success: true,
          thumbsFilePath: thumbsFilePath,
          fileDuration,
          filePath: req.file.path,
          fileSize,
          fileType: req.file.mimetype
        });
      })
      .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 1,
        timestamps: [0],
        folder: "uploads/video/thumbnails",
        size: "320x240",
        // %b input basename ( filename w/o extension )
        filename: "thumbnail-at-%s-seconds-%b.png"
      });
  } catch (err) {
    console.log(err.message);
    res.json({
      success: false,
      error: "failed to upload"
    });
  }
});

//   complete to upload with other fields
//path,  /api/video/uploadVideo
//access, private
router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body);
  // console.log("saved video to db", req.body);

  video.save((err, video) => {
    if (err) return res.status(400).json({ success: false, err });

    return res.status(200).json({
      success: true,
      desc: "success to get video info"
    });
  });
});

//   get and display all uploaded videos
//path,  /api/video/uploadVideo
//access, public
router.get("/getVideos", (req, res) => {
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos });
    });
});

//   get A specific video from mongoDB ID
//path,  /api/video/:videoId
//access,  public
router.get("/:videoId", (req, res) => {
  const doc = Video.findOne({ _id: req.params.videoId });

  doc.populate("writer").exec((err, video) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, msg: "video doesn't exist" });
    }

    res.status(200).json({ success: true, video });
  });
});

//   get all videos that you subscribe to uploader of
//path,  /api/video/getSubscriptionVideos
//access,  private
router.post("/getSubscriptionVideos", (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection
  const { userToken } = req.body;

  Subscriber.find({ subscribingUser: userToken }).exec((err, subscribers) => {
    if (err) {
      console.log(err.message);
      return res.status(400).send(err);
    }

    const uploaders = subscribers.map(subscriber => subscriber.uploader);

    // //Need to Fetch all of the Videos that belong to the Users that I found in previous step.
    Video.find({ writer: { $in: uploaders } })
      .populate("writer")
      .exec((err, videos) => {
        if (err) {
          console.log(err.message);
          return res.status(400).send(err);
        }
        res.status(200).json({ success: true, videos });
      });
  });
});

module.exports = router;
