import SocketIoClient from 'socket.io-client';
import { createContext } from 'react';

const ws_server = 'http://localhost:8000';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(ws_server);

interface props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<props> = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};