import { div, p } from '../../page/components/BaseComponents';

class Chat {
    userName: string;

    view: HTMLElement;

    isLoggedIn: boolean = false;

    constructor(user: { login: string; isLogined: boolean }) {
        this.view = this.createView().element.getElement();
        this.userName = user.login;
        this.isLoggedIn = user.isLogined;
    }

    createView() {
        const content = div(
            'container-fluid chat-container',
            p('text', 'welcome to the chat')
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Chat;
