import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from "antd";
import moment from "moment";

const { Title } = Typography;
function LandingPage() {
  const { Meta } = Card;

  const [Videos, setVideos] = useState([]);

  const getVideoInfoFromDB = async () => {
    try {
      const res = await axios.get("/api/video/getVideos");
      const data = await res.data;

      console.log(data.videos);
      setVideos(data.videos);
    } catch (err) {
      console.log(err.message);
      console.log("Failed to get Videos");
    }
  };

  useEffect(() => {
    getVideoInfoFromDB();
  }, []);

  const renderCards = Videos.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={video._id} lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <Link to={`/video/${video._id}`}>
            <img
              style={{ width: "100%" }}
              alt="thumbnail"
              src={`/${video.thumbnail}`}
            />
            <div
              className=" duration"
              style={{
                bottom: 0,
                right: 0,
                position: "absolute",
                margin: "4px",
                color: "#fff",
                backgroundColor: "rgba(17, 17, 17, 0.8)",
                opacity: 0.8,
                padding: "2px 4px",
                borderRadius: "2px",
                letterSpacing: "0.5px",
                fontSize: "12px",
                fontWeight: "500",
                lineHeight: "12px"
              }}
            >
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </Link>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: "3rem" }}> {video.views}</span>-{" "}
        <span> {moment(video.createdAt).format("MMM Do YY")} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Recommended </Title>
      <hr />

      <Row gutter={16}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
