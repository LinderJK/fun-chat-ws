import './chat.scss';
import {
    a,
    button,
    div,
    img,
    input,
    nav,
    p,
} from '../../page/components/BaseComponents';
import Network from '../../services/Network';
import { IComponent, IInput } from '../../types/components-types';
import { UserData } from '../../types/response-type';
import User from '../user/User';
import Communication from '../Communication/Communication';
import scrollToBottom from '../../utils/utils';

class Chat {
    userName: string;

    user;

    users: User[] | null = null;

    // users: User[];

    view: HTMLElement;

    usersActiveList: IComponent | undefined = undefined;

    usersOfflineList: IComponent | undefined = undefined;

    inputMessage: IInput | undefined = undefined;

    isLoggedIn: boolean = false;

    chatField: IComponent | undefined = undefined;

    communication: Communication | null = null;

    btnSend: IComponent | undefined = undefined;

    constructor(user: UserData, password: string) {
        this.user = new User(user, password);
        this.view = this.createView().element.getElement();
        this.userName = user.login;
        this.isLoggedIn = user.isLogined;
        this.chatInit();
        if (!this.communication) {
            this.btnSend?.setAttributes({ disabled: true });
        }
    }

    chatInit() {
        this.usersActiveList?.deleteChildren();
        this.usersOfflineList?.deleteChildren();
        Network.send({ id: null, type: 'USER_ACTIVE', payload: null });
        Network.send({ id: null, type: 'USER_INACTIVE', payload: null });
    }

    renderUsers(data: UserData[]) {
        // this.usersActiveList?.deleteChildren();
        // this.usersOfflineList?.deleteChildren();
        data.forEach((el) => {
            const chatUser = new User(el);
            const viewUser = chatUser.render();
            chatUser.view?.addListener('click', () => this.startChat(el));
            if (chatUser.status) {
                // this.usersActiveList?.deleteChildren();
                this.usersActiveList!.append(viewUser);
            } else {
                // this.usersOfflineList?.deleteChildren();
                this.usersOfflineList!.append(viewUser);
            }
        });
    }

    // updateMessage(data: ResponseData) {
    //     if (data.type === 'MSG_SEND') {
    //         this.communication?.appendMessage(data.payload.message.text);
    //     }
    // }

    private startChat(data: UserData) {
        console.log('chtat open');
        this.communication = new Communication(data.login, data.isLogined);
        this.chatField?.deleteChildren();
        this.chatField?.append(this.communication.view);
        this.btnSend?.deleteAttribute('disabled');
        this.btnSend?.addListener('click', () => {
            if (this.communication) {
                this.communication.send(this.getInputText());
            }
            this.inputMessage?.deleteValue();
            if (this.communication?.dialogContainer?.getElement()) {
                scrollToBottom(
                    this.communication?.dialogContainer?.getElement()
                );
            }
        });
        this.communication.getHistory();
    }

    getInputText() {
        if (this.inputMessage) {
            return this.inputMessage.value.trim();
        }
        return '';
    }

    createView() {
        const btnLogout = button('chat-logout', 'Logout', () => {
            this.user.logout();
        });
        const btnInfo = button('chat-info', 'Information', () => {});
        this.usersActiveList = div('users-active-field');
        this.usersOfflineList = div('users-offline-field');
        this.chatField = div(
            'chat-content',
            p('', 'Select user for start message')
        );
        this.btnSend = button('send-message', 'Send', () => {});
        this.inputMessage = input('input-message', 'text', 'Write message', '');

        const content = div(
            'container chat-container',
            nav(
                'nav chat-nav',
                p('user-name', `${this.user.login}`),
                p('app-name', `Fun-chat`),
                div('btn-chat-nav', btnLogout, btnInfo)
            ),
            div(
                'chat-fields',
                div(
                    'users-fields col-3 border border-right-0 border-dark',
                    p('', 'Users online'),
                    this.usersActiveList,
                    p('', 'Users offline'),
                    this.usersOfflineList
                ),
                div(
                    'd-flex flex-column justify-content-between col-9 border border-dark p-2 message-field',
                    this.chatField,
                    div(
                        'd-flex gap-2 input-message-container',
                        this.inputMessage,
                        this.btnSend
                    )
                )
            ),
            div(
                'd-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top footer',
                p('footer-year', '2024'),
                a('footer-author', 'LinderJK', 'https://github.com/LinderJK'),
                div(
                    'footer-img',
                    a(
                        'footer-school-link',
                        '',
                        'https://rs.school/courses/javascript-mentoring-program',
                        img('footer-school', './assets/img/rsschool.jpg')
                    )
                )
            )
        );

        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Chat;
