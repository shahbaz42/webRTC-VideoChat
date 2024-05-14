import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const roomHandler = (socket: Socket) => {

    // Below two function will be called
    // when the client emits the event to join or create a room
    const createNewRoom = () => {
        const roomId = uuidv4(); // Create a random room ID
        socket.join(roomId); // Join the room
        socket.emit("room-created", roomId); // Emit an event to the client with the room ID
        console.log("Room created", roomId)
    };

    const joinExistingRoom = () => {
        console.log("Joining room");
    };

    socket.on("create-new-room", createNewRoom);
    socket.on("join-existing-room", joinExistingRoom);
};

export default roomHandler;