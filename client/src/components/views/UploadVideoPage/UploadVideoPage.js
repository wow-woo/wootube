import React, { useState } from "react";
import { Typography, Button, Form, Input } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";

//components
import DropZone from "../../../utils/DropZone/DropZone";

const { Title } = Typography;
const { TextArea } = Input;

const Private = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" }
];

const Catogory = [
  { value: 0, label: "Film & Animation" },
  { value: 0, label: "Autos & Vehicles" },
  { value: 0, label: "Music" },
  { value: 0, label: "Pets & Animals" },
  { value: 0, label: "Sports" }
];

function UploadVideoPage({ history }) {
  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(0);
  const [Categories, setCategories] = useState("Film & Animation");

  //react-redux
  const user = useSelector(state => state.user);
  const video = useSelector(state => state.video);

  const handleChangeTitle = event => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeDecsription = event => {
    setDescription(event.currentTarget.value);
  };

  const handleChangeOne = event => {
    setPrivacy(event.currentTarget.value);
  };

  const handleChangeTwo = event => {
    setCategories(event.currentTarget.value);
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (user.userData && !user.userData.isAuth) {
      history.push("/login");
    }
    // field validation marker

    const fieldData = {
      writer: user.userData._id,
      title: title,
      description: Description,
      privacy: privacy,
      category: Categories,
      duration: video.Duration,
      thumbnail: video.Thumbnail,
      filePath: video.FilePath
    };

    const config = {
      "Content-Type": "application/json"
    };

    try {
      const res = await axios.post("/api/video/uploadVideo", fieldData, config);
      const data = await res.data;

      console.log(data);

      console.log("video Uploaded Successfully");
      history.push("/");
    } catch (err) {
      console.log(err.message);
      console.log("Failed to upload video");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <DropZone />

        <div className="field-group">
          <label>Title</label>
          <Input onChange={handleChangeTitle} value={title} />
        </div>

        <div className="field-group">
          <label>Description</label>
          <TextArea onChange={handleChangeDecsription} value={Description} />
        </div>

        <div className="field-group">
          <select onChange={handleChangeOne}>
            {Private.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <select onChange={handleChangeTwo}>
            {Catogory.map((item, index) => (
              <option key={index} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <Button type="primary" size="large" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UploadVideoPage;
