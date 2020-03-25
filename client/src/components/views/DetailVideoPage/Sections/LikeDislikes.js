import React, { useEffect, useState, Fragment } from "react";
import { Tooltip, Icon } from "antd";
import axios from "axios";

function LikeDislikes(props) {
  const [stateLike, setLike] = useState(false);
  const [sateDislike, setDislike] = useState(false);
  const [stateLikeScore, setLikeScore] = useState(0);
  const [stateDislikeScore, setDislikeScore] = useState(0);

  const payload = {
    type: props.type,
    userId: props.userId,
    [props.videoId && "videoId"]: props.videoId,
    [props.commentId && "commentId"]: props.commentId
  };

  const getLike = async () => {
    try {
      const res = await axios.post("/api/like/getLikes", payload);
      const data = await res.data;

      const likeNumber = await data.likes.length;

      //How many likes does this video or comment have
      await setLikeScore(likeNumber);

      //if I already click this like button or not
      data.likes.map(like => {
        if (like.userId === props.userId) {
          setLike(true);
        }
      });
    } catch (err) {
      console.log(err.message);
      console.log("Failed to get likes");
    }
  };

  const getDislike = async () => {
    try {
      const res = await axios.post("/api/dislike/getDislikes", payload);
      const data = await res.data;

      console.log("getDislike client", data);
      const { dislikes } = data;

      //How many dislikes does this video or comment have
      setDislikeScore(dislikes.length);

      //if I already click this like button or not
      dislikes.map(dislike => {
        if (dislike.userId === props.userId) {
          setDislike(true);
        }
      });
    } catch (err) {
      console.log(err.message);
      console.log("Failed to get dislikes");
    }
  };

  useEffect(() => {
    getLike();
    getDislike();
  }, []);

  const onLike = async () => {
    if (!sateDislike && !stateLike) {
      await axios.post("/api/like/addLike", payload);
      //   const data = await res.data;

      setLikeScore(stateLikeScore + 1);
      setLike(true);
    } else if (!sateDislike && stateLike) {
      await axios.post("/api/like/unLike", payload);
      //   const data = await res.data;

      setLikeScore(stateLikeScore - 1);

      setLike(false);
    } else {
      await axios.post("/api/like/addLike", payload);
      //   const data = await res.data;

      setLikeScore(stateLikeScore + 1);
      setDislikeScore(stateDislikeScore - 1);

      setLike(true);
      setDislike(false);
    }
  };

  const onDislike = async () => {
    try {
      if (!stateLike && !sateDislike) {
        await axios.post("/api/dislike/addDisLike", payload);
        // const data = await res.data;

        setDislikeScore(stateDislikeScore + 1);
        setDislike(true);
      } else if (!stateLike && sateDislike) {
        await axios.post("/api/dislike/unDisLike", payload);
        // const data = await res.data;

        setDislikeScore(stateDislikeScore - 1);
        setDislike(false);
      } else {
        await axios.post("/api/dislike/addDisLike", payload);
        // const data = await res.data;

        setDislikeScore(stateDislikeScore + 1);
        setLikeScore(stateLikeScore - 1);

        setDislike(true);
        setLike(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={stateLike ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>
          {stateLikeScore}
        </span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={sateDislike ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>
          {stateDislikeScore}
        </span>
      </span>
    </Fragment>
  );
}

export default LikeDislikes;
