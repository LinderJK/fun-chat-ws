import Login from './login/Login';
import Network from '../services/Network';
import Chat from './chat/Chat';
import { UserData } from '../types/response-type';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    // router;
    // user: User | undefined = undefined;

    login;

    network;

    chat: Chat | undefined = undefined;

    constructor() {
        // this.router = new Router();
        this.network = new Network();
        this.login = new Login(this.startLogin.bind(this));
        this.listenSocket();
    }

    public start(): void {
        if (!this.root) {
            console.error('dont find root');
        }
        this.startLogin();
    }

    startLogin(): void {
        const user = this.login.getSessionUser();
        console.log(user, 'USER SESSION');
        if (user) {
            // this.network.setOnOpenCallback(() => {
            //     this.network.userAuth(user);
            // });
            this.network.userAuth(user);
            // this.startChat({ login: user.login, isLogined: true });
        } else {
            this.render(this.login.view);
        }
    }

    listenSocket() {
        Network.socket.onmessage = (event) => {
            console.log('WORK LOGGER', event.data);
            this.messageHandler(event);
        };

        Network.socket.onopen = () => {
            this.startLogin();
        };
    }

    messageHandler(event: MessageEvent) {
        const data = JSON.parse(event.data);
        console.log('DATA!!!', data);
        if (data.type === 'USER_LOGIN') {
            this.startChat(data.payload.user);
        }
        if (data.type === 'USER_LOGOUT') {
            this.login.logout();
            this.render(this.login.view);
        }
        if (data.type === 'USER_ACTIVE') {
            this.chat?.renderUsers(data.payload.users);
        }
        if (data.type === 'USER_INACTIVE') {
            this.chat?.renderUsers(data.payload.users);
        }
        if (data.type === 'USER_EXTERNAL_LOGOUT') {
            this.chat?.chatInit();
        }
        if (data.type === 'USER_EXTERNAL_LOGIN') {
            this.chat?.chatInit();
        }
        if (data.type === 'MSG_SEND') {
            this.chat?.communication?.createMessage(data.payload.message);
        }
        if (data.type === 'MSG_FROM_USER') {
            this.chat?.communication?.updateHistory(data.payload.messages);
        }
    }

    // handleNetworkData(data: ResponseData) {
    //     if (data.type === 'USER_LOGIN') {
    //         this.startChat(data.payload.user);
    //     }
    // }

    startChat(user: UserData) {
        const pass = this.login.getSessionUser()?.password;
        if (pass) {
            this.chat = new Chat(user, pass);
            this.render(this.chat.view);
        }
    }

    render(element: HTMLElement) {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
        this.root.append(element);
    }
}

export default AppManager;
