import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket, user, stream, peers } = useContext(SocketContext);

  useEffect(() => {
    if (user) {
      socket.emit("join-existing-room", {
        roomId: id,
        peerId: user._id,
      });
    }
  }, [id, user, socket]);

  return (
    <div>
      roomId: {id}
      <UserFeedPlayer stream={stream} />
      <br />
      <div>
        Other Users in the Room:
        {Object.keys(peers).map((peerId) => (
          <>
            <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
          </>
        ))}
      </div>
    </div>
  );
};

export default Room;
