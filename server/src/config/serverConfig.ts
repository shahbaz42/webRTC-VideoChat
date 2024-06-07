import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.PORT);

export default {
    PORT: process.env.PORT || 8007,
    PEER_PORT: process.env.PEER_PORT || 8008,
};