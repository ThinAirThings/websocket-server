/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer, Socket } from "socket.io";
type ActionCallback<P extends Record<string, any>> = (args: {
    payload: P;
    reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
    socket: Socket;
}) => void;
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: {
        [K in keyof Record<string, ActionCallback<any>>]: ActionCallback<any>;
    });
    sendMessage(action: string, payload: Record<string, any>): void;
}
export {};
