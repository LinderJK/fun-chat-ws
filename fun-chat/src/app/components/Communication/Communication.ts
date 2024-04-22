import './Communication.scss';
import { div, p } from '../../page/components/BaseComponents';

class Communication {
    sendTo;

    status: string;

    view;

    constructor(login: string, status: boolean) {
        this.sendTo = login;
        this.status = status ? 'Online' : 'Offline';
        this.view = this.createView();
    }

    createView() {
        const dialogContainer = div('dialog-container');
        const view = div(
            'dialog-view',
            div(
                'dialog-info',
                p('info-text', `${this.sendTo} is ${this.status}`)
            ),
            dialogContainer
        );
        return view;
    }
}

export default Communication;
