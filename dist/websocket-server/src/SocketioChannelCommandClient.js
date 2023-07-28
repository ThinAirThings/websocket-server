"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioChannelCommandClient = void 0;
const command_client_1 = require("@thinairthings/command-client");
class SocketioChannelCommandClient extends command_client_1.CommandClient {
    constructor(channel) {
        super();
        // Do this for backwards compatibility
        this.sendMessage = (messageType, payload) => {
            this.channel.sendMessage(messageType, payload);
        };
        this.subscribe = (action, callback) => {
            this.channel.addAction(action, (payload) => {
                callback(payload);
            });
            return {
                unsubscribe: () => {
                    this.channel.removeAction(action);
                }
            };
        };
        this.channel = channel;
    }
}
exports.SocketioChannelCommandClient = SocketioChannelCommandClient;
