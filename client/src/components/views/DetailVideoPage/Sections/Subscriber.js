import React, { useEffect, useState } from "react";
import axios from "axios";
function Subscriber({ uploader, user }) {
  const [Subscribed, setSubscribed] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const onSubscribe = async () => {
    if (Subscribed) {
      //when you are subscribing the uploader already
      try {
        const res = await axios.post("/api/subscription/unSubscribe", {
          uploader,
          user
        });
        const data = await res.data;
        console.log("data", data);

        setSubscribed(!Subscribed);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      //you are not subscribing yet
      try {
        const res = await axios.post(
          "/api/subscription/subscribe",
          { uploader, user },
          config
        );

        const data = await res.data;
        console.log("data", data);

        setSubscribed(!Subscribed);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const getSubscription = async () => {
    try {
      const res = await axios.post(
        "/api/subscription/subscribed",
        { uploader, user },
        config
      );
      const data = await res.data;

      console.log("data", data);
      setSubscribed(data.subscribed);
    } catch (err) {
      console.log("Failed to get Subscribed Information");
    }
  };

  useEffect(() => {
    getSubscription();

    //eslint-disable-next-line
  }, []);

  if (uploader === user)
    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "3px 12px",
            color: "white",
            backgroundColor: "blue"
          }}
        >
          분석
        </div>
        <div
          style={{
            padding: "3px 12px",
            marginLeft: "4px",
            color: "white",
            backgroundColor: "blue"
          }}
        >
          동영상 수정
        </div>
      </div>
    );
  return (
    <div>
      <button
        onClick={onSubscribe}
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`,
          borderRadius: "4px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase"
        }}
      >
        {Subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscriber;
