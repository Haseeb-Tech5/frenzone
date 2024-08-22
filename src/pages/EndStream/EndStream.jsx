import React, { useEffect, useState } from "react";
import "./end.css";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";

const EndStream = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [agoraClient, setAgoraClient] = useState(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        const response = await fetch(
          `https://api.frenzone.live/stream/getStreamByUserIDByAdmin/${selectedUser._id}`
        );
        const data = await response.json();
        if (data && data.stream) {
          setStreamData(data.stream);
        } else {
          console.error("No stream data found");
        }
      } catch (error) {
        console.error("Failed to fetch stream data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [selectedUser]);

  useEffect(() => {
    if (streamData) {
      const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      setAgoraClient(client);

      const initAgora = async () => {
        try {
          await client.join(
            "5d2e580f5cbe44688693c2928d2984b2",
            streamData.channelName,
            streamData.token,
            null
          );

          client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);
            console.log("Successfully subscribed to remote user:", user);

            if (mediaType === "video") {
              const remoteVideoTrack = user.videoTrack;
              if (remoteVideoTrack) {
                remoteVideoTrack.play("agora-local-stream", { fit: "contain" });
                remoteVideoTrack.on("play", () => {
                  setVideoPlaying(true);
                });
              }
            }

            if (mediaType === "audio") {
              const remoteAudioTrack = user.audioTrack;
              if (remoteAudioTrack) {
                remoteAudioTrack.play();
              }
            }
          });

          client.on("user-unpublished", (user) => {
            console.log("User unpublished:", user);
            setVideoPlaying(false);
          });
        } catch (error) {
          console.error("Failed to initialize Agora:", error);
        }
      };

      initAgora();

      return () => {
        if (client) {
          client.leave();
          client.removeAllListeners();
        }
      };
    }
  }, [streamData]);

  if (loading) {
    return (
      <div className="spinner-set">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!streamData) {
    return (
      <div className="live-steam-onlu">No live stream data available.</div>
    );
  }

  if (!videoPlaying) {
    return (
      <div className="spinner-set">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="live-stream-oracle">
      <h2>Live Stream for {selectedUser.username}</h2>
      <div
        id="agora-local-stream"
        style={{ width: "100%", height: "1000px" }}
      ></div>
    </div>
  );
};

export default EndStream;
