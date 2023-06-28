/// <reference types="node" />
/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer, Socket } from "socket.io";
import { SocketioChannel } from "./Channel";
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: Record<string, (payload: any, resources: {
        reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
        rxSocket: Socket;
    }) => void>);
    createChannel(channelId: string, opts?: {
        actions?: Record<string, (payload: any, resources: {
            reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
            rxSocket: Socket;
        }) => void>;
        connectionHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
        disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
    }): SocketioChannel;
    sendMessage(action: string, payload: Record<string, any>): void;
    sendVolatileMessage(action: string, payload: Record<string, any>): void;
}
export type Serializable = string | number | boolean | null | Serializable[] | {
    [key: string]: Serializable;
} | Buffer;
export declare function isSerializable(value: any): value is Serializable;
