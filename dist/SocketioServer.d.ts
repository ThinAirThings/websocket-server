/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer } from "socket.io";
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: Record<string, (payload: any, reply: (messageId: string, payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void) => void>);
    sendMessage(action: string, payload: Record<string, any>): void;
}
