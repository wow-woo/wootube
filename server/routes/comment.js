const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

router.post("/addComment", (req, res) => {
  const comment = new Comment(req.body);

  comment.save((err, comment) => {
    if (err) {
      console.log(err.message);
      return res.json({ success: false, err });
    }

    Comment.find({ _id: comment._id })
      .populate("writer")
      .exec((err, result) => {
        if (err) {
          console.log(err.message);
          return res.json({ success: false, err });
        }

        return res.status(200).json({ success: true, result });
      });
  });
});

router.post("/getComments", (req, res) => {
  const videoId = req.body.videoId;

  Comment.find({ postId: videoId })
    .populate("writer")
    .exec((err, comments) => {
      if (err) {
        console.log(err.message);
        return res.status(400).send(err);
      }

      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
