import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "antd";
import axios from "axios";

//components
import ProgressBar from "../../components/views/ProgressBar/ProgressBar";
import DropZoneDetail from "./DropZoneDetail";

//redux
import { connect } from "react-redux";
import { getVideoInfo } from "../../_actions/videoAction";

//dropzone with image preview system
function DropZone({ getVideoInfo }) {
  const [Percent, setPercent] = useState(0);
  const [files, setFiles] = useState([]);
  const [UploadError, setUploadError] = useState("");
  const [UploadMode, setUploadMode] = useState(true);
  const [Thumbnail, setThumbnail] = useState("");

  //mode change when to click button
  const uploadMore = e => {
    e.preventDefault();

    setThumbnail("");
    setPercent(0);
    acceptedFiles.length = 0;
    rejectedFiles.length = 0;
    setUploadMode(true);
  };

  //configuring dropzone
  //define variable to get value of maxSize
  const myMaxsize = 3000000000;

  const {
    acceptedFiles,
    rejectedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    //✔ behave depends on file or drag
    getRootProps,
    getInputProps
  } = useDropzone({
    //set file type to accept
    // accept: "image/*",
    multiple: true,
    maxSize: myMaxsize,

    //define what to fire off when add file
    onDrop: async acceptedFiles => {
      try {
        //initialize video thumbnail
        setThumbnail("");
        setPercent(0);

        //generate preview thumbnail for image file
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );

        if (acceptedFiles[0] === undefined) {
          setUploadError("error : no files");
          return console.log("acceptedFiles[0]", acceptedFiles[0]);
        }

        let formData = new FormData();

        console.log(acceptedFiles);
        formData.append("file", acceptedFiles[0]);

        const config = {
          header: { "content-type": "multipart/form-data" },
          onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            const per = ((loaded * 100) / total).toFixed(2);
            if (per < 100) setPercent(per);
          }
        };
        const res = await axios.post(
          "/api/video/uploadfiles",
          formData,
          config
        );
        const data = await res.data;
        setPercent(100);

        console.log("data", data);
        const { filePath, thumbsFilePath, fileDuration } = data;

        setThumbnail(thumbsFilePath);

        //redux
        getVideoInfo(filePath, thumbsFilePath, fileDuration);

        // generate thumbnail with this file path !
        setUploadMode(false);
      } catch (err) {
        console.log(err.message);
      }
    }
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="dropzone-container">
      <div>
        {UploadMode ? (
          <>
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {isDragReject && <p>Some files will be rejected</p>}
              {isDragAccept && <p>All files will be accepted</p>}
              {!isDragActive && (
                <p>Drag 'n' drop files here, or click to select files</p>
              )}
              <Icon className="plus" type="plus" style={{ fontSize: "3rem" }} />
            </div>
          </>
        ) : (
          <div className="thumbnail-container">
            <span onClick={uploadMore}>Upload More</span>
            {/*video thumbnail*/
            Thumbnail && (
              <div className="video-thumbnail">
                <img src={`/${Thumbnail}`} alt="video thumbnail" />
              </div>
            )}
            {!Thumbnail && (
              <div className="img-thumb">
                {files.map(file => (
                  <div key={file.name}>
                    <img src={file.preview} alt="retrieve fail" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <ProgressBar p={Percent} />
        <DropZoneDetail
          acceptedFiles={acceptedFiles}
          rejectedFiles={rejectedFiles}
          myMaxsize={myMaxsize}
        />
      </div>
    </section>
  );
}

export default connect(null, { getVideoInfo })(DropZone);
