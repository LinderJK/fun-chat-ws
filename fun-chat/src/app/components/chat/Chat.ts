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
import { scrollToBottom } from '../../utils/utils';

/**
 * Represents a chat interface for communicating with users.
 */
class Chat {
    /** The username of the current user. */
    userName: string;

    /** The current user object. */
    user: User;

    /** The list of users, initially null. */
    users: User[] | null = null;

    /** The root element of the chat view. */
    view: HTMLElement;

    /** The component representing the active users list. */
    usersActiveList: IComponent | undefined = undefined;

    /** The component representing the offline users list. */
    usersOfflineList: IComponent | undefined = undefined;

    /** The component representing the search user list. */
    usersSearchList: IComponent | undefined = undefined;

    /** The input field for typing messages. */
    inputMessage: IInput | undefined = undefined;

    /** The about button component. */
    aboutBtn: IComponent | undefined = undefined;

    /** Indicates whether the user is logged in. */
    isLoggedIn: boolean = false;

    /** The chat field component. */
    chatField: IComponent | undefined = undefined;

    /** The communication instance for messages. */
    communication: Communication | null = null;

    /** The send message button component. */
    btnSend: IComponent | undefined = undefined;

    /** The input field for searching users. */
    searchUserInput: IInput | undefined = undefined;

    constructor(user: UserData, password: string) {
        this.user = new User(user, password);
        this.view = this.createView().element.getElement();
        this.userName = user.login;
        this.isLoggedIn = user.isLogined;
        this.chatInit();
        if (!this.communication) {
            this.btnSend?.setAttributes({ disabled: true });
        }
        this.searchUserInput?.addListener('input', (e) => {
            this.searchUser(e);
        });
    }

    /**
     * Finds a user by login name.
     * @param {string} userLogin - The login name of the user to find.
     * @returns {User | undefined} The found user object or undefined if not found.
     */
    findUser(userLogin: string) {
        return this.users?.find((el) => el.login === userLogin);
    }

    /**
     * Handles user search.
     * @param {Event} e - The input event.
     */
    searchUser(e: Event) {
        const inputField = e.target as HTMLInputElement;
        const inputValue = inputField.value;
        const usersCopy = this.users ? [...this.users] : [];
        if (usersCopy.length === 0 || inputValue.length === 0) {
            return;
        }
        const filteredUsers = usersCopy
            .slice()
            .filter((el) =>
                el.login.toLowerCase().includes(inputValue.toLowerCase())
            );
        if (filteredUsers.length > 0) {
            this.usersSearchList?.deleteChildren();
            this.renderFilteredUser(filteredUsers);
        }
    }

    /**
     * Renders filtered users.
     * @param {User[]} users - The filtered users.
     */
    renderFilteredUser(users: User[]) {
        users.forEach((el) => {
            if (el.view) {
                this.usersSearchList!.append(el.view);
            }
        });
    }

    /**
     * Initializes the chat.
     */
    chatInit() {
        this.usersActiveList?.deleteChildren();
        this.usersOfflineList?.deleteChildren();
        Network.send({ id: null, type: 'USER_ACTIVE', payload: null });
        Network.send({ id: null, type: 'USER_INACTIVE', payload: null });
    }

    /**
     * Renders the users.
     * @param {UserData[]} data - The user data array.
     */
    renderUsers(data: UserData[]) {
        this.users = [];
        data.forEach((el) => {
            if (el.login === this.user.login) {
                return;
            }
            const chatUser = new User(el);
            this.users?.push(chatUser);
            const viewUser = chatUser.render();
            chatUser.view?.addListener('click', () => this.startChat(el));
            if (chatUser.status) {
                this.usersActiveList!.append(viewUser);
            } else {
                this.usersOfflineList!.append(viewUser);
            }
        });
    }

    /**
     * Starts a chat session with the selected user.
     * @param {UserData} data - The user data of the selected user.
     */
    startChat(data: UserData) {
        this.communication = new Communication(
            this.user.login,
            data.login,
            data.isLogined
        );
        this.chatField?.deleteChildren();
        this.chatField?.append(this.communication.view);
        this.btnSend?.deleteAttribute('disabled');
        this.btnSend?.addListener('click', () => {
            this.sendMessage();
        });
        this.inputMessage?.addListener('keydown', (event) => {
            if ((event as KeyboardEvent).key === 'Enter') {
                this.sendMessage();
            }
        });
        this.communication.getHistory();
    }

    /**
     * Sends a message.
     */
    sendMessage() {
        const textMessage = this.getInputText();
        if (textMessage.length === 0) {
            return;
        }
        if (this.communication) {
            this.communication.send(textMessage);
        }
        this.inputMessage?.deleteValue();
        if (this.communication?.dialogContainer?.getElement()) {
            scrollToBottom(this.communication?.dialogContainer?.getElement());
        }
    }

    /**
     * Gets the input message text.
     * @returns {string} The input message text.
     */
    getInputText() {
        if (this.inputMessage) {
            return this.inputMessage.value.trim();
        }
        return '';
    }

    /**
     * Creates the chat view.
     * @returns {{element: HTMLElement, map: Map<string, HTMLElement>}} The chat view element and its map.
     */
    createView() {
        const btnLogout = button('chat-logout', 'Logout', () => {
            this.user.logout();
        });
        this.aboutBtn = button('about-chat', 'About', () => {});
        this.usersActiveList = div('users-active-field');
        this.usersSearchList = div('users-search-field');
        this.usersOfflineList = div('users-offline-field');
        this.chatField = div(
            'chat-content',
            p('', 'Select user for start message')
        );
        this.btnSend = button('send-message', 'Send', () => {});
        this.inputMessage = input('input-message', 'text', 'Write message', '');

        this.searchUserInput = input(
            'input-user-search',
            'text',
            'Search User',
            ''
        );

        const content = div(
            'container chat-container',
            nav(
                'nav chat-nav',
                p('user-name', `${this.user.login}`),
                p('app-name', `Fun-chat`),
                div('btn-chat-nav', btnLogout, this.aboutBtn)
            ),
            div(
                'chat-fields',

                div(
                    'users-fields col-3 border border-right-0 border-dark',
                    this.searchUserInput,
                    this.usersSearchList,
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
