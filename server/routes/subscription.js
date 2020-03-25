const express = require("express");
const router = express.Router();

const Subscriber = require("../models/Subscriber");

const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

//   subscribe to uploader
// path,    /api/subscription/subscribe
// access private
router.post("/subscribe", (req, res) => {
  const { uploader, user } = req.body;

  const subscribe = new Subscriber({
    subscribingUser: user,
    uploader
  });

  subscribe.save((err, doc) => {
    if (err) {
      console.log(err.message);
      return res.json({ success: false, err });
    }
    res.status(200).json({ success: true, doc });
  });
});

//   check if subscribing the uploader
// path,    /api/subscription/subscribed
// access private
router.post("/subscribed", (req, res) => {
  const { uploader, user } = req.body;

  Subscriber.find({
    subscribingUser: user,
    uploader
  }).exec((err, subscribe) => {
    if (err) {
      console.log(err.message);
      return res
        .status(400)
        .json({ success: false, msg: "fail to check if subscribing" });
    }

    if (subscribe.length === 0) {
      return res.status(200).json({ success: true, subscribed: false });
    }

    res.status(200).json({ success: true, subscribed: true });
  });
});

//   check if subscribing the uploader
// path,    /api/subscription/subscribed
// access private
router.post("/unSubscribe", (req, res) => {
  const { uploader, user } = req.body;

  Subscriber.findOneAndDelete({
    subscribingUser: user,
    uploader
  }).exec((err, doc) => {
    if (err) {
      console.log(err.message);
      return res.status(400).json({ success: false, err });
    }

    res.status(200).json({ success: true, subscribed: false, doc });
  });
});

module.exports = router;
