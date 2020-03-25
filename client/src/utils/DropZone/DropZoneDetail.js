import React, { Fragment } from "react";

const DropZoneDetail = ({ acceptedFiles, rejectedFiles, myMaxsize }) => {
  const rejectedFilesItems = rejectedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const acceptedFilesItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const oversizeFilesItems = rejectedFiles.map(file => {
    console.log(file.size, myMaxsize);
    return (
      file.size > myMaxsize && (
        <li key={file.path}>
          {file.name} is too big to upload maximum size : {myMaxsize}
        </li>
      )
    );
  });

  return (
    <aside className="detail-container">
      {acceptedFiles.length !== 0 && (
        <Fragment>
          <h4>Accepted files</h4>
          <ul>{acceptedFilesItems}</ul>
        </Fragment>
      )}
      {rejectedFiles.length !== 0 && (
        <Fragment>
          <h4>Rejected files</h4>
          <ul>{rejectedFilesItems}</ul>
          <h4>Reject Issue</h4>
          <ul>{oversizeFilesItems}</ul>
        </Fragment>
      )}
    </aside>
  );
};

export default DropZoneDetail;
