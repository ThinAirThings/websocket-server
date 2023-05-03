import { Server } from "http"
import { Server as IoServer, Socket } from "socket.io"
import { rxToTx } from "./txTx"

export class WebsocketServer{
    ioServer: IoServer
    constructor(httpServer: Server, actions: Record<string, (payload: any)=>void>){
        this.ioServer = new IoServer(httpServer, {
            cors: {
                origin: '*',
            }
        })
        this.ioServer.on('connection', (socket: Socket) => {
            console.log('a user connected')
            for (const [action, callback] of Object.entries(actions)){
                socket.on(rxToTx(action), callback)
            }
        })

    }
    sendMessage(action: string, payload: Record<string, any>){
        this.ioServer.emit(action, payload)
    }
}