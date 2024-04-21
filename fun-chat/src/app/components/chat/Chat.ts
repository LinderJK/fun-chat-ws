import './chat.scss';
import { button, div, nav, p } from '../../page/components/BaseComponents';
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
            )
        );

        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Chat;
