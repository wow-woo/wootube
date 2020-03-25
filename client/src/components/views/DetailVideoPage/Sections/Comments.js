import React, { useState } from "react";
import { Button, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
const { TextArea } = Input;

function Comments({ CommentLists, postId, addComment }) {
  const user = useSelector(state => state.user);

  const [Comment, setComment] = useState("");

  const changeHandler = e => {
    setComment(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();

    const payload = {
      content: Comment,
      writer: user.userData._id,
      postId: postId
    };

    try {
      const res = await axios.post("/api/comment/addComment", payload);
      const data = await res.data;

      addComment(data.result);
      setComment("");
    } catch (err) {
      console.log(err.message);
      console.log("Failed to save Comment");
    }
  };

  return (
    <div>
      <br />
      <p> replies</p>
      <hr />

      {CommentLists &&
        CommentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <SingleComment
                key={index}
                comment={comment}
                CommentLists={CommentLists}
                postId={postId}
                addComment={addComment}
                rootComment={comment._id}
              />
            )
        )}

      {/* Root Comment Form */}
      <form style={{ display: "flex", marginTop: "15%" }}>
        <TextArea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={changeHandler}
          value={Comment}
          placeholder="write some comments"
        />
        <br />
        <Button
          type="button"
          style={{ width: "20%", height: "52px" }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Comments;
