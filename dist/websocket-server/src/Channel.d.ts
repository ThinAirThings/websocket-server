import { Server as IoServer, Socket } from "socket.io";
import { SocketioServer } from "./SocketioServer";
export declare class SocketioChannel {
    channelId: string;
    _channel: ReturnType<SocketioServer['ioServer']['of']>;
    _actions: Record<string, (payload: any, resources: {
        reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
        rxSocket: Socket;
    }) => void>;
    _connectionHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
    _disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
    constructor(ioServer: IoServer, channelId: string, opts?: {
        actions?: Record<string, (payload: any, resources: {
            reply: (payload: Record<string, any>, status?: "COMPLETE" | "RUNNING" | "ERROR") => void;
            rxSocket: Socket;
        }) => void>;
        connectionHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
        disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket) => void;
    });
    addAction: (action: string, callback: (payload: any) => void) => void;
    removeAction: (action: string) => void;
    addActions: (actions: Record<string, (payload: any) => void>) => void;
    sendMessage: (action: string, payload: Record<string, any>) => void;
    private updateActions;
    private updateSocketListeners;
}
