import Login from './login/Login';
import Network from '../services/Network';
import Chat from './chat/Chat';
import User from './User';
import { ResponseData } from '../types/response-type';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    // router;
    user: User | undefined = undefined;

    login;

    network;

    chat: Chat | undefined = undefined;

    constructor() {
        // this.router = new Router();
        this.network = new Network(this.handleNetworkData.bind(this));
        this.login = new Login(this.startLogin.bind(this));
    }

    public start(): void {
        if (!this.root) {
            console.error('dont find root');
        }
        this.startLogin();
    }

    startLogin(): void {
        const user = this.login.getSessionUser();
        if (user) {
            this.network.setOnOpenCallback(() => {
                this.network.userAuth(user);
            });
        } else {
            this.render(this.login.view);
        }
    }

    handleNetworkData(data: ResponseData) {
        if (data.type === 'USER_LOGIN') {
            this.startChat(data.payload.user);
        }
    }

    startChat(user: { login: string; isLogined: boolean }) {
        this.user = new User(user.login);
        console.log(user, 'USERRR!!');
        this.chat = new Chat(user);
        this.render(this.chat.view);
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
