import SocketIoClient from "socket.io-client";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  useEffect(() => {
    const enterRoom = (roomId: string) => {
      navigate(`/room/${roomId}`);
    };
    socket.on("new-room-created", enterRoom); // if server emits new-room-created, enterRoom is called
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
