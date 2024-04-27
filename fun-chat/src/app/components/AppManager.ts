import Login from './login/Login';
import Network from '../services/Network';
import Chat from './chat/Chat';
import { UserData } from '../types/response-type';
import Communication from './Communication/Communication';
import aboutPageView from '../page/about/about-page-view';
import { PageView } from '../types/components-types';
import reconnectPageView from '../page/reconnect/reconnect-page-view';

class AppManager {
    /**
     * The root HTML element where the application is rendered.
     */
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    /**
     * The login component instance.
     */
    login: Login;

    /**
     * The chat component instance.
     */
    chat: Chat | undefined = undefined;

    /**
     * The about page view.
     */
    aboutView: PageView | undefined = undefined;

    /**
     * The reconnect page view.
     */
    reconnectView: PageView | undefined = undefined;

    constructor() {
        this.login = new Login(this.startLogin.bind(this));
        this.reconnectView = reconnectPageView();
        this.listenSocket();
        this.aboutView = aboutPageView(() => {
            if (this.chat?.user && this.chat.user.isLogined) {
                this.render(this.chat.view);
            } else if (!this.chat?.user.isLogined) {
                this.render(this.login.view);
            }
        });
        this.addButtonListeners();
    }

    // Initialize components event listeners
    addButtonListeners() {
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

    /**
     * Initializes the application.
     */
    public start(): void {
        if (!this.root) {
            console.error('dont find root');
        }
        this.startLogin();
    }

    /**
     * Initiates the login process.
     */
    startLogin(): void {
        const user = this.login.getSessionUser();
        if (user) {
            Network.userAuth(user);
        } else {
            this.render(this.login.view);
        }
    }

    /**
     * Listens for socket events.
     */
    listenSocket() {
        Network.socket.onmessage = (event) => {
            this.messageHandler(event);
        };

        Network.socket.onopen = () => {
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

    /**
     * Handles incoming socket messages.
     * @param {MessageEvent} event - The socket message event.
     */
    messageHandler(event: MessageEvent) {
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
            if (this.login) {
                this.login.addErrorMessage(data.payload.error);
                this.login.logout();
            }
        }
    }

    /**
     * Initiates a chat session with the specified user.
     * @param {UserData} user - The user data for the chat session.
     */
    startChat(user: UserData) {
        const pass = this.login.getSessionUser()?.password;
        if (pass) {
            this.chat = new Chat(user, pass);
            this.render(this.chat.view);
            this.addButtonListeners();
        }
    }

    /**
     * Renders the specified HTML element in the application.
     * @param {HTMLElement} element - The HTML element to render.
     */
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
