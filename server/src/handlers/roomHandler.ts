import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

const rooms : Record<string, string[]> = {}; // To-do store room data in DB

const roomHandler = (socket: Socket) => {
    // Below two function will be called
    // when the client emits the event to join or create a room
    const createNewRoom = () => {
        const roomId = uuidv4(); // Create a random room ID
        socket.join(roomId); // Join the room
        rooms[roomId] = []; // create new room in DB
        socket.emit("new-room-created", roomId); // Emit an event to the client with the room ID
    };

    /*
    * This function will be called each and every time a user joins an existing room
    */
    const joinExistingRoom = ({roomId, peerId}: IRoomParams) => {
        if (rooms[roomId]){ // if given room exist in DB
            // console.log("User has joined the room: ", roomId, peerId);
            rooms[roomId].push(peerId); // Add the peer ID to the room
            socket.join(roomId); // Join the room

            socket.emit("get-users", {
                participants: rooms[roomId]
            });
        }
    };

    socket.on("create-new-room", createNewRoom);
    socket.on("join-existing-room", joinExistingRoom);
};

export default roomHandler;