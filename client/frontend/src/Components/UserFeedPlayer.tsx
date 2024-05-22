import { useEffect, useRef } from "react";

const UserFeedPlayer: React.FC<{ stream?: MediaStream, muted?:boolean }> = ({ stream, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <video
        className="rounded-xl object-cover "
        ref={videoRef}
        style={{  }}
        muted={muted}
        autoPlay
      />
    </>
  );
};

export default UserFeedPlayer;
