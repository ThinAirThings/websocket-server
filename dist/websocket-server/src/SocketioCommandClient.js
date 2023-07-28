"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioCommandClient = void 0;
const command_client_1 = require("@thinairthings/command-client");
class SocketioCommandClient extends command_client_1.CommandClient {
    constructor(channel) {
        super();
        // Do this for backwards compatibility
        this.sendMessage = (messageType, payload) => {
            this.channel.sendMessage(messageType, payload);
        };
        this.channel = channel;
    }
}
exports.SocketioCommandClient = SocketioCommandClient;
