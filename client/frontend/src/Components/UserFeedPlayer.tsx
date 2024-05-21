import { useEffect, useRef } from "react";

const UserFeedPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
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
        muted={false}
        autoPlay
      />
    </>
  );
};

export default UserFeedPlayer;
