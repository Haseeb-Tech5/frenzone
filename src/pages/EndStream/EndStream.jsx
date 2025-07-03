import React, { useEffect, useState, useRef } from "react";
import "./end.css";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import Swal from "sweetalert2";

const EndStream = () => {
  const selectedUser = useSelector((state) => state.user.selectedUser);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [agoraClient, setAgoraClient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const once = useRef(null);

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
          setStreamData(null);
        }
      } catch (error) {
        console.error("Failed to fetch stream data:", error);
        setStreamData(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser && once.current == null) {
      fetchStreamData();
      once.current = true;
    }
  }, [selectedUser]);

  useEffect(() => {
    const initAgora = async () => {
      if (streamData && !agoraClient) {
        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        setAgoraClient(client);

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
                remoteVideoTrack.play("end-stream-player", {
                  fit: "contain",
                });
                remoteVideoTrack.on("track-ended", () => {
                  console.log("Video track ended");
                  setVideoPlaying(false);
                });
                setVideoPlaying(true);
              } else {
                console.error("No video track found");
                setVideoPlaying(false);
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
          setVideoPlaying(false);
        }
      }
    };

    initAgora();

    return () => {
      if (agoraClient) {
        agoraClient.remoteUsers.forEach((user) => {
          if (user.videoTrack) user.videoTrack.stop();
          if (user.audioTrack) user.audioTrack.stop();
        });
      }
    };
  }, [streamData, agoraClient]);

  useEffect(() => {
    return () => {
      if (agoraClient) {
        agoraClient.leave();
        agoraClient.removeAllListeners();
        setAgoraClient(null);
      }
    };
  }, []);

  const handleDeleteStream = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `https://api.frenzone.live/stream/deleteStreamByAdmin/${streamData._id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        console.log("Stream deleted successfully");
        setStreamData(null);
        await Swal.fire({
          title: "Success!",
          text: "The stream has been deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Failed to delete stream");
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete the stream. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting stream:", error);
      await Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the stream.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="end-spinner-container">
        <div className="end-spinner"></div>
      </div>
    );
  }

  if (!streamData) {
    return <div className="end-no-stream">No live stream data available.</div>;
  }

  return (
    <div className="end-stream-container">
      <div className="end-stream-header">
        <div className="end-stream-title">
          <h2>Live Stream for {selectedUser.username}</h2>
        </div>
        <div className="end-stream-actions">
          <button
            onClick={handleDeleteStream}
            disabled={deleting}
            className="end-delete-btn"
          >
            {deleting ? "Deleting..." : "Delete Stream"}
          </button>
        </div>
      </div>
      <div id="end-stream-player" className="end-stream-player">
        {!videoPlaying && (
          <div className="end-no-stream">No live video stream available.</div>
        )}
      </div>
    </div>
  );
};

export default EndStream;
