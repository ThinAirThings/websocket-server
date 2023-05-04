import { Server } from "http"
import { Server as IoServer, Socket } from "socket.io"
import { rxToTx } from "./txRx"

export class SocketioServer {
    ioServer: IoServer
    constructor(httpServer: Server, actions: Record<string, 
        (payload: any, resources: {
            reply:(payload: Record<string, any>, status?: "COMPLETE"|"RUNNING"|"ERROR")=>void
            socket: Socket
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
                        socket.emit(rxPayload.messageId, {
                            messageId: rxPayload.messageId,
                            status,
                            txPayload
                        })
                    }
                    callback(rxPayload, {
                        reply,
                        socket
                    })
                })
            }
        })
    }
    sendMessage(action: string, payload: Record<string, any>){
        this.ioServer.emit(action, payload)
    }
}