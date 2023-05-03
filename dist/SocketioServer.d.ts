/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer, Socket } from "socket.io";
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: Record<string, (payload: any, socket?: Socket) => void>);
    sendMessage(action: string, payload: Record<string, any>): void;
}
