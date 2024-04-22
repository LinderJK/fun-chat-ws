import './chat.scss';
import {
    a,
    button,
    div,
    img,
    nav,
    p,
} from '../../page/components/BaseComponents';
import Network from '../../services/Network';
import { IComponent } from '../../types/components-types';
import { UserData } from '../../types/response-type';
import User from '../user/User';

class Chat {
    userName: string;

    user;

    users: User[] | null = null;

    // users: User[];

    view: HTMLElement;

    usersActiveList: IComponent | undefined = undefined;

    usersOfflineList: IComponent | undefined = undefined;

    isLoggedIn: boolean = false;

    constructor(user: UserData, password: string) {
        this.user = new User(user, password);
        this.view = this.createView().element.getElement();
        this.userName = user.login;
        this.isLoggedIn = user.isLogined;
        this.chatInit();
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
            if (chatUser.status) {
                // this.usersActiveList?.deleteChildren();
                this.usersActiveList!.append(viewUser);
            } else {
                // this.usersOfflineList?.deleteChildren();
                this.usersOfflineList!.append(viewUser);
            }
        });

        // this.users = data.map((el) => {
        //     // console.log(user);
        //     const chatUser = new User(el);
        //     const viewUser = chatUser.render();
        //     if (chatUser.status) {
        //         this.usersActiveList?.deleteChildren();
        //         this.usersActiveList!.append(viewUser);
        //     } else {
        //         this.usersOfflineList?.deleteChildren();
        //         this.usersOfflineList!.append(viewUser);
        //     }
        //     return chatUser;
        //     // console.log(user);
        // });

        console.log(this.users);
    }

    createView() {
        const btnLogout = button('chat-logout', 'Logout', () => {
            this.user.logout();
        });
        const btnInfo = button('chat-info', 'Information', () => {});
        this.usersActiveList = div('users-active-field');
        this.usersOfflineList = div('users-offline-field');

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
                div('message-field col-9 border border-dark', p('', 'message'))
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
