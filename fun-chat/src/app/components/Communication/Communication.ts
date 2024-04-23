import './Communication.scss';
import { div, divText, p } from '../../page/components/BaseComponents';
import Network from '../../services/Network';
import { IComponent } from '../../types/components-types';
import { Message, ResponseData } from '../../types/response-type';
import { getDataFromTimeStamp, scrollToBottom } from '../../utils/utils';

class Communication {
    userTo: string;

    userFrom: string;

    statusUserTo: string;

    view;

    dialogContainer: IComponent | null = null;

    constructor(userFrom: string, userTo: string, statusUserTo: boolean) {
        this.userTo = userTo;
        this.userFrom = userFrom;
        this.statusUserTo = statusUserTo ? 'Online' : 'Offline';
        this.view = this.createView();
    }

    createView() {
        this.dialogContainer = div('dialog-container');
        return div(
            'dialog-view',
            div(
                'dialog-info',
                p('info-text', `${this.userTo} is ${this.statusUserTo}`)
            ),
            this.dialogContainer
        );
    }

    appendMessage(data: ResponseData) {
        if (data.type === 'MSG_SEND') {
            console.log(data, data.payload.message.from, this.userTo);
            // if (data.payload.message.from !== this.userTo) {
            //     return;
            // }
            this.createMessage(data.payload.message);
        }
    }

    createMessage(data: Message) {
        // if (data.from !== this.userTo) {
        //     return;
        // }
        let msgClass: string;
        if (data.from === this.userTo) {
            msgClass = 'message message--left';
        } else {
            msgClass = 'message message--right';
        }
        const view = div(
            `${msgClass}`,
            p('message__author', `${data.from}`),
            p('message__text', `${data.text}`),
            p(
                'message__time text-body-secondary',
                `${getDataFromTimeStamp(data.datetime)}`
            )
        );
        if (this.dialogContainer) {
            this.dialogContainer.append(view);
        }
        if (this.dialogContainer?.getElement()) {
            scrollToBottom(this.dialogContainer?.getElement());
        }
    }

    updateHistory(data: Message[]) {
        if (data.length === 0) {
            this.dialogContainer?.append(
                divText('', 'Its start dialog, go chatting')
            );
            return;
        }
        data.forEach((message) => {
            this.createMessage(message);
        });
        if (this.dialogContainer?.getElement()) {
            scrollToBottom(this.dialogContainer?.getElement());
        }
    }

    getHistory() {
        Network.send({
            id: '',
            type: 'MSG_FROM_USER',
            payload: {
                user: {
                    login: this.userTo,
                },
            },
        });
    }

    send(message: string) {
        Network.send({
            id: null,
            type: 'MSG_SEND',
            payload: {
                message: {
                    to: this.userTo,
                    text: message,
                },
            },
        });
    }
}

export default Communication;
