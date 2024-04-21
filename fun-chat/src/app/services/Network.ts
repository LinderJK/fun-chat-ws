import {
    CallbackDataFn,
    CallbackFn,
    UserLoginData,
} from '../types/other-types';
import { ServerRequest } from '../types/response-type';

class Network {
    static socket = new WebSocket('ws://localhost:4000');

    static message = null;

    static isConnected = false;

    static onOpenCallback: CallbackFn | null = null;

    static onMessageCallback: CallbackDataFn | null = null;

    constructor() {
        Network.subscribe();
    }

    // setOnOpenCallback(callback: CallbackFn) {
    //     Network.onOpenCallback = callback;
    // }

    static subscribe() {
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            Network.isConnected = true;
            // if (this.onOpenCallback) {
            //     this.onOpenCallback();
            // }
        };
        this.socket.onmessage = (event) => {
            console.log('Message received:', event.data);
            // const data = JSON.parse(event.data);
            // this.handleMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
            Network.isConnected = false;
        };
    }

    // static handleMessage(data: ResponseData) {
    //     if (Network.onMessageCallback) {
    //         Network.onMessageCallback(data);
    //     }
    // }

    // get userLogin() {
    //     if (Network.message) {
    //         const data = JSON.parse(Network.message);
    //         console.log(data);
    //         if (data.type === 'USER_LOGIN') {
    //             return data;
    //         }
    //     }
    //     return null;
    // }

    // static updateData(data: Event) {
    //     const data = JSON.parse(data);
    //     switch (data.type) {
    //       case 'USER_LOGIN':
    //         Network.
    //     }
    // }

    // generateRequest() {}

    userAuth(user: UserLoginData) {
        const request = {
            id: Network.generateUniqueId(),
            type: 'USER_LOGIN',
            payload: {
                user,
            },
        };
        console.log('send user', user);
        if (Network.socket.readyState === WebSocket.OPEN) {
            Network.socket.send(JSON.stringify(request));
        }
    }

    static send<T>(req: ServerRequest<T>) {
        if (Network.socket.readyState === WebSocket.OPEN) {
            Network.socket.send(JSON.stringify(req));
        }
    }

    static generateUniqueId() {
        return 'unique_id';
    }
}

export default Network;
