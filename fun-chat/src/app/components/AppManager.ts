import Login from './login/Login';
import Network from '../services/Network';
import Chat from './chat/Chat';
import { UserData } from '../types/response-type';
import Communication from './Communication/Communication';
import aboutPageView from '../page/about/about-page-view';
import { PageView } from '../types/components-types';
import reconnectPageView from '../page/reconnect/reconnect-page-view';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    // router;
    // user: User | undefined = undefined;

    login;

    // network;

    chat: Chat | undefined = undefined;

    aboutView: PageView | undefined = undefined;

    reconnectView: PageView | undefined = undefined;

    constructor() {
        // this.router = new Router();
        // this.network = Network();
        this.login = new Login(this.startLogin.bind(this));
        this.reconnectView = reconnectPageView();
        this.listenSocket();
        this.aboutView = aboutPageView(() => {
            if (this.chat?.user && this.chat.user.isLogined) {
                this.render(this.chat.view);
            } else if (!this.chat?.user.isLogined) {
                console.log(this.login.isLogin);
                this.render(this.login.view);
            }
        });
        this.addButtonListeners();
    }

    addButtonListeners() {
        console.log('work about');
        const viewAbout = this.aboutView?.element.getElement();
        if (viewAbout) {
            this.login.aboutBtn?.addListener('click', () =>
                this.render(viewAbout)
            );
            this.chat?.aboutBtn?.addListener('click', () =>
                this.render(viewAbout)
            );
        }
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
            // this.network.setOnOpenCallback(() => {
            //     this.network.userAuth(user);
            // });
            Network.userAuth(user);
            // this.startChat({ login: user.login, isLogined: true });
        } else {
            this.render(this.login.view);
        }
    }

    listenSocket() {
        Network.socket.onmessage = (event) => {
            // console.log('WORK LOGGER', event.data);
            this.messageHandler(event);
        };

        Network.socket.onopen = () => {
            console.log('WORK OPEN RECONNECT');
            this.startLogin();
        };

        Network.socket.onclose = () => {
            const viewReconnect = this.reconnectView?.element.getElement();
            if (viewReconnect) {
                this.render(viewReconnect);
                Network.tryReconnect(
                    this.startLogin.bind(this),
                    this.listenSocket.bind(this)
                );
            }
        };
    }

    messageHandler(event: MessageEvent) {
        console.log('WORK LOGGER', event.data);
        const data = JSON.parse(event.data);
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
            if (
                data.payload.message.from !==
                    this.chat?.communication?.userFrom &&
                data.payload.message.from !== this.chat?.communication?.userTo
            ) {
                // const otherMessage = new Communication(
                //     data.payload.message.from,
                //     this.chat?.user.login,
                //     this.chat?.user.
                // );
                if (this.chat) {
                    const com = new Communication(
                        data.payload.message.from,
                        this.chat?.user.login,
                        this.chat?.user.status
                    );
                    com.createMessage(data.payload.message);

                    const user = this.chat?.findUser(data.payload.message.from);
                    if (user) {
                        user.increaseUnreadMessageCount();
                    }
                    return;
                }
            }
            this.chat?.communication?.appendMessage(data);
        }
        if (data.type === 'MSG_FROM_USER') {
            this.chat?.communication?.updateHistory(data.payload.messages);
        }
        if (data.type === 'ERROR') {
            console.log(data.payload);
            if (this.login) {
                this.login.addErrorMessage(data.payload.error);
                this.login.logout();
            }
        }
    }

    startChat(user: UserData) {
        const pass = this.login.getSessionUser()?.password;
        if (pass) {
            this.chat = new Chat(user, pass);
            this.render(this.chat.view);
            this.addButtonListeners();
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
