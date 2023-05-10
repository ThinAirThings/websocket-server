/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer, Socket } from "socket.io";
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: Record<string, (payload: any, resources: {
        reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
        rxSocket: Socket;
    }) => void>);
    createChannel(channelId: string, actions: Record<string, (payload: any) => void>): {
        sendMessage: (action: string, payload: Record<string, any>) => void;
        sendVolatileMessage: (action: string, payload: Record<string, any>) => void;
    };
    sendMessage(action: string, payload: Record<string, any>): void;
    sendVolatileMessage(action: string, payload: Record<string, any>): void;
}
