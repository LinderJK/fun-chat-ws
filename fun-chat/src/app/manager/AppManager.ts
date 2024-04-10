import Router from '../services/Router';

class AppManager {
    root: HTMLElement | null = document.querySelector('#root'); // The root HTML element.

    router;

    constructor() {
        this.router = new Router();
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
    }
}

export default AppManager;
