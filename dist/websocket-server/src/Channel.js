"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioChannel = void 0;
const SocketioServer_1 = require("./SocketioServer");
const txRx_1 = require("../../shared/txRx");
class SocketioChannel {
    constructor(ioServer, channelId, opts) {
        this.channelId = channelId;
        this.addAction = (action, callback) => {
            this._actions[action] = callback;
            this.updateActions();
        };
        this.removeAction = (action) => {
            delete this._actions[action];
            this.updateActions();
        };
        // NOTE: THIS IS BROKEN AND NEEDS TO BE FIXED
        this.addActions = (actions) => {
            this._actions = {
                ...this._actions,
                ...actions
            };
            this.updateActions();
        };
        this.sendMessage = (action, payload) => {
            this._channel.emit((0, txRx_1.rxToTx)(action), payload);
        };
        this.updateActions = () => {
            this._channel.removeAllListeners().on('connection', (socket) => {
                console.log(`a user connected to channel: ${this.channelId}`);
                console.log(`Number of users in channel: ${this.channelId}: ${this._channel.sockets.size}`);
                this._connectionHandler?.(this._channel, socket);
                this.updateSocketListeners(socket);
            });
            this._channel.sockets.forEach((socket) => {
                socket.removeAllListeners();
                this.updateSocketListeners(socket);
            });
        };
        this.updateSocketListeners = (socket) => {
            this._actions && Object.entries(this._actions).forEach(([action, callback]) => {
                socket.on((0, txRx_1.rxToTx)(action), (rxPayload) => {
                    const reply = (txPayload, status) => {
                        if ((0, SocketioServer_1.isSerializable)(txPayload)) {
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
            });
            socket.on('disconnect', () => {
                console.log(`a user disconnected from channel: ${this.channelId}`);
                console.log(`Number of users in channel: ${this.channelId}: ${this._channel.sockets.size}`);
                this._disconnectHandler?.(this._channel, socket);
            });
        };
        this._channel = ioServer.of(channelId);
        this._actions = opts?.actions || {};
        this._connectionHandler = opts?.connectionHandler;
        this._disconnectHandler = opts?.disconnectHandler;
        this.updateActions();
    }
}
exports.SocketioChannel = SocketioChannel;
