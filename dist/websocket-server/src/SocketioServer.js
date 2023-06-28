"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSerializable = exports.SocketioServer = void 0;
const socket_io_1 = require("socket.io");
const txRx_1 = require("../../shared/txRx");
const Channel_1 = require("./Channel");
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
                socket.on((0, txRx_1.rxToTx)(action), (rxPayload) => {
                    const reply = (txPayload, status) => {
                        if (isSerializable(txPayload)) {
                            socket.emit(rxPayload.messageId, {
                                messageId: rxPayload.messageId,
                                status,
                                payload: txPayload
                            });
                        }
                        else {
                            console.log(`Non serializable object detected in txPayload for action: ${action}. Please check input for the txPayload.`);
                            socket.emit(rxPayload.messageId, {
                                messageId: rxPayload.messageId,
                                "status": "ERROR",
                                payload: {
                                    message: `Non serializable object detected in txPayload for action: ${action}. Please check input for the txPayload on the server side.`
                                }
                            });
                        }
                    };
                    callback(rxPayload, {
                        reply,
                        rxSocket: socket
                    });
                });
            }
        });
    }
    createChannel(channelId, opts) {
        return new Channel_1.SocketioChannel(this.ioServer, channelId, opts);
    }
    sendMessage(action, payload) {
        this.ioServer.emit(action, payload);
    }
    sendVolatileMessage(action, payload) {
        this.ioServer.volatile.emit(action, payload);
    }
}
exports.SocketioServer = SocketioServer;
function isSerializable(value) {
    if (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        Buffer.isBuffer(value)) {
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
exports.isSerializable = isSerializable;
