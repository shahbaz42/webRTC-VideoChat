import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Peer } from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { peerReducer } from "../Reducers/peerReducers";
import { addPeerAction } from "../Actions/peerAction";

const ws_server = "webrtcserver.shahbaz42.live";

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

  const [peers, dispatch] = useReducer(peerReducer, {});

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
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(stream);
  };

  useEffect(() => {
    const userId = uuidv4();
    const newpeer = new Peer(userId,
      {
      host: "webrtcserver.shahbaz42.live",
      port: 443,
      path: "/myapp",
      secure: true,
    } 
  );
    setUser(newpeer);

    fetchUserFeed();

    const enterRoom = (roomId: string) => {
      navigate(`/room/${roomId}`);
    };
    socket.on("new-room-created", enterRoom); // if server emits new-room-created, enterRoom is called
    socket.on("get-users", fetchParticapantsList);
  }, []);

  useEffect(() => {
    if (!user || !stream) return;

    socket.on("user-joined", ({ peerId }) => {
      const call = user.call(peerId, stream);
      console.log("calling the new peer", peerId);

      call.on("stream", (stream) => {
        dispatch(addPeerAction(peerId, stream));
      });
    });

    user.on("call", (call) => {
      // what to do when other group call you  when you joined.
      console.log("receiving call from ", call.peer);

      call.answer(stream);
      call.on("stream", (stream) => {
        dispatch(addPeerAction(call.peer, stream));
      });
    });

    socket.emit("ready");
  }, [user, stream]);

  return (
    <SocketContext.Provider value={{ socket, user, stream, peers }}>
      {children}
    </SocketContext.Provider>
  );
};
