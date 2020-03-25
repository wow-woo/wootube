import React from "react";

const ProgressBar = ({ p }) => {
  return (
    p > 0 && (
      <div className="progress-container">
        <span className="progress-number">{p} %</span>
        <div
          className="progress-bar"
          style={{
            border: "none",
            width: `${p}%`,
            backgroundColor: p === 100 ? "blue" : "red"
          }}
        ></div>
      </div>
    )
  );
};

export default ProgressBar;
