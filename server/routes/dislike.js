const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Dislike = require("../models/Dislike");

const { auth } = require("../middleware/auth");

//=================================
//               DisLikes
//=================================

//  add A dislike
//path:    /api/dislike/addDisLike
//access: private
router.post("/addDisLike", (req, res) => {
  const disLike = new Dislike(req.body);

  disLike.save((err, dislikeResult) => {
    if (err) {
      console.log(err.message);
      return res
        .status(400)
        .json({ success: false, msg: "fail to add A dislike" });
    }

    //In case Like Button is already clicked, we need to decrease the like by 1
    Like.findOneAndDelete(req.body).exec((err, likeResult) => {
      if (err) return res.status(400).json({ success: false, err });

      res.status(200).json({ success: true });
    });
  });
});

//  give all dislikes
//path:    /api/dislike/getDislikes
//access: private
router.post("/getDislikes", (req, res) => {
  Dislike.find(req.body).exec((err, dislikes) => {
    if (err) {
      console.log(err.message);
      return res.status(400).send(err);
    }

    res.status(200).json({ success: true, dislikes });
  });
});

//  cancel A dislike
//path:    /api/dislike/unDisLike
//access: private
router.post("/unDisLike", (req, res) => {
  Dislike.findOneAndDelete(req.body).exec((err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(400).json({ success: false, err });
    }

    res.status(200).json({ success: true });
  });
});

module.exports = router;
