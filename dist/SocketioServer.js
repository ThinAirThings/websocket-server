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
                socket.on((0, txRx_1.rxToTx)(action), (rxPayload) => {
                    const reply = (txPayload, status) => {
                        socket.emit(rxPayload.messageId, {
                            messageId: rxPayload.messageId,
                            status,
                            payload: serializableSanitize(action, txPayload)
                        });
                    };
                    callback(rxPayload, {
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
function serializableSanitize(action, obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (isSerializable(value)) {
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = Array.isArray(value) ? value.map(serializableSanitize) : serializableSanitize(action, value);
            }
            else {
                sanitized[key] = value;
            }
        }
        else {
            console.log(`Non serializable object detected in txPayload for action: ${action}. Attempting to remove object and send. Please check input at: Key: ${key}, Value: ${value}`);
        }
    }
    return sanitized;
}
