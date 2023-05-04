/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer, Socket } from "socket.io";
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: Record<string, <P>(payload: P, { reply, socket }: {
        reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
        socket: Socket;
    }) => void>);
    sendMessage(action: string, payload: Record<string, any>): void;
}
