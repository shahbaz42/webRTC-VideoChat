import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext, SocketContextType } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";
import { useNavigate } from "react-router-dom";

const Room: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    socket,
    user,
    stream,
    setStream,
    peers,
    muteAudio,
    setMuteAudio,
    muteVideo,
    setMuteVideo,
    peerCallMap,
    setPeerCallMap
  } = useContext(SocketContext) as SocketContextType;

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  const stopResumeVideo = async () => {
    const videoTracks = stream?.getVideoTracks();
    if(!videoTracks) return;

    if(videoTracks[0].readyState === "live") {
      videoTracks[0].stop();

      Object.keys(peerCallMap).forEach((peerId) => {
        const call = peerCallMap[peerId];
        call.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(videoTracks[0]);
          }
        });
      });

      setMuteVideo(true);
    } else {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream?.removeTrack(videoTracks[0]);
      stream?.addTrack(newStream.getVideoTracks()[0]);

      Object.keys(peerCallMap).forEach((peerId) => {
        const call = peerCallMap[peerId];
        call.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(newStream.getVideoTracks()[0]);
          }
        });
      });
      setMuteVideo(false);
    }
  };

  const stopResumeAudio = async () => {
    const audioTracks = stream?.getAudioTracks();
    if(!audioTracks) return;

    if(audioTracks[0].readyState === "live") {
      audioTracks[0].stop();

      Object.keys(peerCallMap).forEach((peerId) => {
        const call = peerCallMap[peerId];
        call.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "audio") {
            sender.replaceTrack(audioTracks[0]);
          }
        });
      });
      setMuteAudio(true);

    } else {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      stream?.removeTrack(audioTracks[0]);
      stream?.addTrack(newStream.getAudioTracks()[0]);

      Object.keys(peerCallMap).forEach((peerId) => {
        const call = peerCallMap[peerId];
        call.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "audio") {
            sender.replaceTrack(newStream.getAudioTracks()[0]);
          }
        });
      });
      setMuteAudio(false);
    }
  }

  const disconnectCall = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }

    if (!user) return;
    console.log("This user is attempting to disconnect call");
    const peerId = (user as any)._id;
    socket.emit("disconnect-request", {
      roomId: id,
      peerId,
    });

    setPeerCallMap((prev) => {
      delete prev[peerId];
      return prev;
    });
    user.destroy();
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      socket.emit("join-existing-room", {
        roomId: id,
        peerId: (user as any)._id,
      });
    }
  }, [id, user, socket]);

  useEffect(() => {
    fetchUserFeed();
    const handleUnload = () => {
      disconnectCall();
    };
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      {/* roomId: {id} */}

      {/* self-view box */}
      <div className="fixed bottom-24 max-w-52 max-h-36 right-2 p-0">
        <UserFeedPlayer stream={stream} muted={true} />
      </div>

      <div className="flex flex-col items-center justify-center px-2">
        {Object.keys(peers).length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl text-center mb-4">
              No participants in the room
            </h1>

            <div className="flex items-center justify-center">
              <input
                type="text"
                value={window.location.href}
                onChange={() => {}}
                className="mr-2 input input-bordered input-primary w-full max-w-xs"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="btn btn-primary"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {Object.keys(peers).map((peerId) => (
          <div key={peerId} className="py-1">
            <UserFeedPlayer
              key={peerId}
              stream={peers[peerId].stream}
              muted={false}
            />
          </div>
        ))}
      </div>

      {/* meet controls box */}
      <div className="fixed bottom-5 w-screen">
        {/* mute audio button */}
        <button
          className={`btn btn-circle mx-1 ${
            muteAudio ? "bg-red-500 hover:bg-red-400" : ""
          } `}
          onClick={() => stopResumeAudio()}
        >
          {muteAudio ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              className=""
              stroke="white"
              strokeWidth="0"
            >
              <path d="M0 0h24v24H0zm0 0h24v24H0z" fill="none"></path>
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"></path>
            </svg>
          ) : (
            <svg
              focusable="false"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className=""
              stroke="white"
              strokeWidth="0"
              fill="white"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path>
            </svg>
          )}
        </button>

        {/* mute video button */}
        <button
          className={`btn btn-circle mx-1 ${
            muteVideo ? "bg-red-500 hover:bg-red-400" : ""
          } `}
          onClick={() => stopResumeVideo()}
        >
          {muteVideo ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              aria-hidden="true"
              data-slot="icon"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              ></path>
            </svg>
          )}
        </button>

        <button className={`btn btn-circle mx-1 `}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </button>

        {/* disconnect button */}
        <button
          onClick={disconnectCall}
          className="btn rounded-full bg-red-500 hover:bg-red-400 mx-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Room;
