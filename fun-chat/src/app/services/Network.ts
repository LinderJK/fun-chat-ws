class Network {
    static client = null;

    static socket = new WebSocket('ws://localhost:4000');

    constructor() {
        Network.subscribe();
    }

    static subscribe() {
        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };
        this.socket.onmessage = (event) => {
            console.log('Message received:', event.data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
        };
    }
}

export default Network;
