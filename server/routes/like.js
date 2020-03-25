const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Dislike = require("../models/Dislike");

const { auth } = require("../middleware/auth");

//=================================
//             Likes
//=================================

//  add A like
//path:    /api/like/addLike
//access: private
router.post("/addLike", (req, res) => {
  const like = new Like(req.body);

  like.save((err, likeResult) => {
    if (err) return res.json({ success: false, err });

    //In case disLike Button is already clicked, we need to decrease the dislike by 1
    Dislike.findOneAndDelete(req.body).exec((err, disLikeResult) => {
      if (err) {
        console.log(err.message);
        return res
          .status(400)
          .json({ success: false, msg: "fail to add A like" });
      }
      res.status(200).json({ success: true });
    });
  });
});

//  get All likes
//path:    /api/like/getLikes
//access: private
router.post("/getLikes", (req, res) => {
  Like.find(req.body).exec((err, likes) => {
    if (err) {
      console.log(err.message);
      return res.status(400).send(err);
    }

    res.status(200).json({ success: true, likes });
  });
});

//  cancel A like
//path:    /api/like/unLike
//access: private
router.post("/unLike", (req, res) => {
  Like.findOneAndDelete(req.body).exec((err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(400).json({ success: false, err });
    }

    res.status(200).json({ success: true });
  });
});

module.exports = router;
