import { Server } from "http"
import { Server as IoServer, Socket } from "socket.io"
import { rxToTx } from "../../shared/txRx"
import { SocketioChannel } from "./Channel"

export class SocketioServer {
    ioServer: IoServer
    constructor(httpServer: Server, actions: Record<string, 
        (payload: any, resources: {
            reply:(payload: Record<string, any>, status?: "COMPLETE"|"RUNNING"|"ERROR")=>void
            rxSocket: Socket
        } )=>void
    >){
        this.ioServer = new IoServer(httpServer, {
            cors: {
                origin: '*',
            }
        })

        this.ioServer.on('connection', (socket: Socket) => {
            console.log('a user connected')
            for (const [action, callback] of Object.entries(actions)){
                socket.on(rxToTx(action), (rxPayload: {messageId: string}) => {
                    const reply = (txPayload: Record<string, any>, status?:"COMPLETE"|"RUNNING"|"ERROR") => {
                        if (isSerializable(txPayload)) {
                            socket.emit(rxPayload.messageId, {
                                messageId: rxPayload.messageId,
                                status,
                                payload: txPayload
                            })
                        } else {
                            console.log(`Non serializable object detected in txPayload for action: ${action}. Please check input for the txPayload.`);
                            socket.emit(rxPayload.messageId, {
                                messageId: rxPayload.messageId,
                                "status": "ERROR",
                                payload: {
                                    message: `Non serializable object detected in txPayload for action: ${action}. Please check input for the txPayload on the server side.`
                                }
                            })
                        }
                    }
                    callback(rxPayload, {
                        reply,
                        rxSocket: socket
                    })
                })
            }
        })
    }
    createChannel(channelId: string, opts?: {
        actions?: Record<string, 
            (payload: any, resources: {
                reply:(payload: Record<string, any>, status?: "COMPLETE"|"RUNNING"|"ERROR")=>void
                rxSocket: Socket
            } )=>void
        >
        connectionHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket)=>void
        disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket)=>void
    }){
        return new SocketioChannel(this.ioServer, channelId, opts)
    }
    sendMessage( action: string, payload: Record<string, any>){
        this.ioServer.emit(action, payload)
    }
    sendVolatileMessage(action: string, payload: Record<string, any>){
        this.ioServer.volatile.emit(action, payload)
    }
}

// Deal with sanitizing the txPayload as Socketio fails silently if it is not a plain object
export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable }
  | Buffer;

export function isSerializable(value: any): value is Serializable {
    if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        Buffer.isBuffer(value)
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.every(isSerializable);
    }

    if (typeof value === 'object' && value !== null) {
        return Object.values(value).every(isSerializable);
    }
    return false;
}

