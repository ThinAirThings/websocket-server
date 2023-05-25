/// <reference types="node" />
import { Server } from "http";
import { Server as IoServer, Socket } from "socket.io";
export declare class SocketioServer {
    ioServer: IoServer;
    constructor(httpServer: Server, actions: Record<string, (payload: any, resources: {
        reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
        rxSocket: Socket;
    }) => void>);
    createChannel(channelId: string, actions: ConstructorParameters<typeof SocketioServer>[1], { disconnectHandler }: {
        disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
    }): {
        channel: import("socket.io").Namespace<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>;
        sendMessage: (action: string, payload: Record<string, any>) => void;
        sendVolatileMessage: (action: string, payload: Record<string, any>) => void;
    };
    sendMessage(action: string, payload: Record<string, any>): void;
    sendVolatileMessage(action: string, payload: Record<string, any>): void;
}
