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
    <div className="flex items-center justify-center h-screen w-screen">
      {/* roomId: {id} */}

      <div className="fixed bottom-2 max-w-40 right-2 p-0">
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
          <div key={peerId} className="py-1" >
            <UserFeedPlayer key={peerId} stream={peers[peerId].stream} muted={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Room;
