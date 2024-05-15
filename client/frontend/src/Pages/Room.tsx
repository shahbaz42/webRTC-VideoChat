import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket, user } = useContext(SocketContext);

  useEffect(() => {
    if (user){
      socket.emit("join-existing-room", {
        roomId: id,
        peerId: user._id,
      });

    }
  }, [id, user, socket]);

  return <div>roomId: {id}</div>;
};

export default Room;
