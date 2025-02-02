import { useContext } from "react";
import { SocketContext, SocketContextType } from "../Context/SocketContext";

const CreateRoom: React.FC = () => {
    const { socket } = useContext(SocketContext) as SocketContextType;

    const initRoom = () => {
        socket.emit('create-new-room', {
            room: 'room1'
        })
    }

    return (
        <button 
            onClick={initRoom}
            className="btn btn-primary"
        >
            Start a new meeting in a new room.
        </button>
    )
}

export default CreateRoom;