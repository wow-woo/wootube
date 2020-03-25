import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Avatar, Row, Col } from "antd";
import SideVideo from "./Sections/SideVideo";
import Subscriber from "./Sections/Subscriber";
import Comments from "./Sections/Comments";
import LikeDislikes from "./Sections/LikeDislikes";

function DetailVideoPage(props) {
  const [Video, setVideo] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);

  const addComment = newComment => {
    setCommentLists(CommentLists.concat(newComment));
  };

  const videoId = props.match.params.videoId;

  const videoInfo = async () => {
    try {
      //   const pathname = window.location.pathname;

      const res = await axios.get("/api/video/" + videoId);
      const data = await res.data;

      setVideo(data.video);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getComments = async () => {
    try {
      const res = await axios.post("/api/comment/getComments", { videoId });
      const data = await res.data;
      console.log("response.data.comments", data.comments);

      setCommentLists(data.comments);
    } catch (err) {
      console.log(err.message);
      console.log("Failed to get video comment");
    }
  };

  useEffect(() => {
    videoInfo();
    getComments();

    //eslint-disable-next-line
  }, []);

  if (Video.writer) {
    return (
      <Row>
        <Col lg={15} xs={24}>
          <div
            className="postPage"
            style={{ width: "100%", padding: "3rem 4em" }}
          >
            <video
              style={{ width: "100%" }}
              src={`/${Video.filePath}`}
              controls
            ></video>

            <List.Item
              actions={[
                <LikeDislikes
                  type="video"
                  video
                  videoId={videoId}
                  userId={localStorage.getItem("userId")}
                />,
                <Subscriber
                  uploader={Video.writer._id}
                  user={localStorage.getItem("userId")}
                />
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer && Video.writer.image} />}
                title={<a href="https://ant.design">{Video.title}</a>}
                description={Video.description}
              />
              <div></div>
            </List.Item>

            <Comments
              CommentLists={CommentLists}
              postId={Video._id}
              addComment={addComment}
            />
          </div>
        </Col>
        <Col lg={9} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default DetailVideoPage;
