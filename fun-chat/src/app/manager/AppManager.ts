import Router from '../services/Router';
import Login from '../page/login-page/login';
import Network from '../services/Network';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    router;

    login;

    network;

    constructor() {
        this.router = new Router();
        this.login = new Login();
        this.network = new Network();
    }

    clearRoot(): void {
        if (!this.root) {
            console.error('dont find root');
            return;
        }
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    }

    public start(): void {
        if (!this.root) {
            console.error('dont find root');
        }
        document.addEventListener('DOMContentLoaded', this.router.start);
        this.renderLogin();
    }

    renderLogin(): void {
        this.clearRoot();
        this.root?.append(this.login.view.element.getElement());
    }
}

export default AppManager;
