import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

const Room: React.FC = () => {
  const { id } = useParams();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.emit("join-existing-room", { roomId: id });
  }, []);

  return <div>roomId: {id}</div>;
};

export default Room;
