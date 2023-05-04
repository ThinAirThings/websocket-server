"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioServer = void 0;
const socket_io_1 = require("socket.io");
const txRx_1 = require("./txRx");
class SocketioServer {
    constructor(httpServer, actions) {
        this.ioServer = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
            }
        });
        this.ioServer.on('connection', (socket) => {
            console.log('a user connected');
            for (const [action, callback] of Object.entries(actions)) {
                socket.on((0, txRx_1.rxToTx)(action), (payload) => {
                    const reply = (payload, status) => {
                        socket.emit(payload.messageId, {
                            messageId: payload.messageId,
                            status,
                            payload
                        });
                    };
                    callback(payload, {
                        reply,
                        socket
                    });
                });
            }
        });
    }
    sendMessage(action, payload) {
        this.ioServer.emit(action, payload);
    }
}
exports.SocketioServer = SocketioServer;
