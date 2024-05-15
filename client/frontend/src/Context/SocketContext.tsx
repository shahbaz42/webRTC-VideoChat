import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";

const ws_server = "http://localhost:8000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(ws_server, {
  withCredentials: false,
  transports: ["polling", "websocket"],
});

interface props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<props> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();

  const fetchParticapantsList = ({
    roomId,
    participants,
  }: {
    roomId: string;
    participants: string[];
  }) => {
    console.log("Participants in room: ", roomId, participants);
  };

  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(stream);
  }

  useEffect(() => {
    const userId = uuidv4();
    const newpeer = new Peer(userId);
    setUser(newpeer);

    fetchUserFeed();

    const enterRoom = (roomId: string) => {
      navigate(`/room/${roomId}`);
    };
    socket.on("new-room-created", enterRoom); // if server emits new-room-created, enterRoom is called
    socket.on("get-users", fetchParticapantsList);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, user, stream }}>
      {children}
    </SocketContext.Provider>
  );
};
