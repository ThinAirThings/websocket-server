import { CommandClient } from "@thinairthings/command-client";
import { SocketioChannel } from "./Channel";
export declare class SocketioChannelCommandClient extends CommandClient {
    channel: SocketioChannel;
    constructor(channel: SocketioChannel);
    sendMessage: SocketioChannel["sendMessage"];
    subscribe: <P extends Record<string, any>>(action: string, callback: (event: P) => void) => {
        unsubscribe: () => void;
    };
}
