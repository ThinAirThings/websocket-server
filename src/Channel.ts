import { Server as IoServer, Socket} from "socket.io"
import { SocketioServer, isSerializable } from "./SocketioServer";
import { rxToTx } from "../../shared/txRx";

export class SocketioChannel {
    _channel: ReturnType<SocketioServer['ioServer']['of']>
    _actions: Record<string,
        (payload: any, resources: {
            reply:(payload: Record<string, any>, status?: "COMPLETE"|"RUNNING"|"ERROR")=>void
            rxSocket: Socket
        } )=>void
    >
    _connectionHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket)=>void
    _disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket)=>void
    constructor(
        ioServer: IoServer, 
        public channelId: string,
        opts?: {
            actions?: Record<string, 
                (payload: any, resources: {
                    reply:(payload: Record<string, any>, status?: "COMPLETE"|"RUNNING"|"ERROR")=>void
                    rxSocket: Socket
                } )=>void
            >
            connectionHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket)=>void
            disconnectHandler?: (channel: ReturnType<SocketioServer['ioServer']['of']>, socket: Socket)=>void
        }
    ){
        this._channel = ioServer.of(channelId)
        this._actions = opts?.actions || {}
        this._connectionHandler = opts?.connectionHandler
        this._disconnectHandler = opts?.disconnectHandler
        this.updateActions()
    }
    addAction = (action: string, callback: (payload: any)=>void) => {
        this._actions[action] = callback
        this.updateActions()
    }   
    removeAction = (action: string) => {
        delete this._actions[action]
        this.updateActions()
    }
    // NOTE: THIS IS BROKEN AND NEEDS TO BE FIXED
    addActions = (actions: Record<string, (payload: any)=>void>) => {
        this._actions = {
            ...this._actions,
            ...actions
        }
        this.updateActions()
    }
    sendMessage = (action: string, payload: Record<string, any>) => {
        this._channel.emit(rxToTx(action), payload)
    }
    private updateActions = () => {
        this._channel.removeAllListeners().on('connection', (socket: Socket) => {
            console.log(`a user connected to channel: ${this.channelId}`)
            console.log(`Number of users in channel: ${this.channelId}: ${this._channel.sockets.size}`)
            this._connectionHandler?.(this._channel, socket)
            this.updateSocketListeners(socket)
        })
        this._channel.sockets.forEach((socket) => {
            socket.removeAllListeners()
            this.updateSocketListeners(socket)
        })
    }
    private updateSocketListeners = (socket: Socket) => {
        this._actions && Object.entries(this._actions).forEach(([action, callback]) => {
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
        })
        socket.on('disconnect', () => {
            console.log(`a user disconnected from channel: ${this.channelId}`)
            console.log(`Number of users in channel: ${this.channelId}: ${this._channel.sockets.size}`)
            this._disconnectHandler?.(this._channel, socket)
        })
    }
}