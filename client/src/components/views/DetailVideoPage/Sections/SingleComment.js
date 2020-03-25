import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";
import ReplyComment from "./ReplyComment";

const { TextArea } = Input;

function SingleComment({
  comment,
  CommentLists,
  rootComment,
  postId,
  addComment
}) {
  const user = useSelector(state => state.user);

  const [CommentValue, setCommentValue] = useState("");
  const [OpenReply, setOpenReply] = useState(false);

  const handleChange = e => {
    setCommentValue(e.currentTarget.value);
  };

  const openReply = () => {
    setOpenReply(!OpenReply);
  };

  const onSubmit = async e => {
    e.preventDefault();

    const payload = {
      writer: user.userData._id,
      postId: postId,
      content: CommentValue,
      responseTo: comment._id,
      rootComment
    };

    try {
      const res = await axios.post("/api/comment/addComment", payload);
      const data = await res.data;

      console.log("data", data);

      setCommentValue("");
      setOpenReply(!OpenReply);
      addComment(data.result);
    } catch (err) {
      console.log(err.message);
      console.log("Failed to save Comment");
    }
  };

  const actions = [
    <LikeDislikes
      type="comment"
      comment
      commentId={comment._id}
      userId={localStorage.getItem("userId")}
    />,
    <span onClick={openReply} key="comment._id">
      Reply to
    </span>
  ];

  return (
    comment && (
      <div>
        <Comment
          actions={actions}
          author={comment.writer.name}
          avatar={<Avatar src={comment.writer.image} alt="image" />}
          content={<p>{comment.content}</p>}
        ></Comment>

        {OpenReply && (
          <form style={{ display: "flex" }}>
            <TextArea
              style={{
                width: "100%",
                borderRadius: "5px"
              }}
              onChange={handleChange}
              value={CommentValue}
              placeholder="write some comments"
            />
            <br />
            <Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
              Submit
            </Button>
          </form>
        )}
        <ReplyComment
          CommentLists={CommentLists}
          postId={postId}
          parentCommentId={comment._id}
          addComment={addComment}
          rootComment={rootComment}
        />
      </div>
    )
  );
}

export default SingleComment;
