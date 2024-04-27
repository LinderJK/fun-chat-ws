import { CallbackFn } from '../types/other-types';
import { ServerRequest, UserLoginData } from '../types/response-type';

/**
 * Handles network communication with the server using WebSocket.
 */
class Network {
    /**
     * The WebSocket instance for communication with the server.
     */
    static socket = new WebSocket('ws://localhost:4000');

    /**
     * Attempts to reconnect to the server.
     * @param {CallbackFn} callback - The callback function to execute after successful reconnection.
     * @param {CallbackFn} newListener - The callback function to set new listeners after reconnection.
     * @static
     */
    static tryReconnect(callback: CallbackFn, newListener: CallbackFn) {
        const reconnect = setInterval(() => {
            Network.socket = new WebSocket('ws://localhost:4000');
            Network.socket.onopen = () => {
                setTimeout(() => {
                    newListener();
                    callback();
                }, 5000);
                clearInterval(reconnect);
            };
        }, 5000);
    }

    /**
     * Sends a user authentication request to the server.
     * @param {UserLoginData} user - The user login data for authentication.
     * @static
     */
    static userAuth(user: UserLoginData) {
        const request = {
            id: Network.generateUniqueId(),
            type: 'USER_LOGIN',
            payload: {
                user,
            },
        };
        if (Network.socket.readyState === WebSocket.OPEN) {
            Network.socket.send(JSON.stringify(request));
        }
    }

    /**
     * Sends a generic server request to the server.
     * @param {ServerRequest<T>} req - The server request to send.
     * @static
     */
    static send<T>(req: ServerRequest<T>) {
        if (Network.socket.readyState === WebSocket.OPEN) {
            Network.socket.send(JSON.stringify(req));
        }
    }

    /**
     * Generates a unique ID for user Auth.
     * @returns {string} The unique ID.
     * @static
     */
    static generateUniqueId() {
        return 'unique_id';
    }
}

export default Network;
