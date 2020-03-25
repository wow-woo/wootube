import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment({
  CommentLists,
  rootComment,
  postId,
  parentCommentId,
  addComment
}) {
  const [Reply, setReply] = useState([]);
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    const filteredList = CommentLists.filter(
      comment => comment.responseTo === parentCommentId
    );

    setReply(filteredList);
    setChildCommentNumber(filteredList.length);
  }, [CommentLists, parentCommentId]);

  const changeHandler = () => {
    setOpenReplyComments(!OpenReplyComments);
  };

  return (
    <div>
      {ChildCommentNumber > 0 && (
        <p
          style={{
            fontSize: "14px",
            margin: 0,
            color: "gray"
          }}
          onClick={changeHandler}
        >
          <span
            style={{
              cursor: "pointer"
            }}
          >
            View {ChildCommentNumber} more comment(s)
          </span>
        </p>
      )}

      {OpenReplyComments &&
        Reply.map((comment, index) => {
          return (
            <div style={{ width: "80%", marginLeft: "40px" }}>
              <SingleComment
                key={index}
                comment={comment}
                postId={postId}
                addComment={addComment}
                CommentLists={CommentLists}
                rootComment={rootComment}
              />
            </div>
          );
        })}
    </div>
  );
}

export default ReplyComment;
