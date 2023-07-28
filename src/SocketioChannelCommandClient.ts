import { CommandClient } from "@thinairthings/command-client";
import { SocketioChannel } from "./Channel";


export class SocketioChannelCommandClient extends CommandClient {
    channel: SocketioChannel
    constructor(channel: SocketioChannel){
        super()
        this.channel = channel
    }
    // Do this for backwards compatibility
    sendMessage: SocketioChannel["sendMessage"] = (messageType, payload) => {
        this.channel.sendMessage(messageType, payload)
    }
    subscribe = <P extends Record<string, any>>(
        action: string, 
        callback: (event: P)=>void
    ) => {
        this.channel.addAction(action, (payload: P) => {
            callback(payload)
        })
        return {
            unsubscribe: () => {
                this.channel.removeAction(action)
            }
        }
    }
}