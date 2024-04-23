import './Communication.scss';
import { div, p } from '../../page/components/BaseComponents';
import Network from '../../services/Network';
import { IComponent } from '../../types/components-types';
import { Message, ResponseData } from '../../types/response-type';
import { scrollToBottom, getDataFromTimeStemp } from '../../utils/utils';

class Communication {
    sendTo;

    status: string;

    view;

    dialogContainer: IComponent | null = null;

    constructor(login: string, status: boolean) {
        this.sendTo = login;
        this.status = status ? 'Online' : 'Offline';
        this.view = this.createView();
    }

    createView() {
        this.dialogContainer = div('dialog-container');
        const view = div(
            'dialog-view',
            div(
                'dialog-info',
                p('info-text', `${this.sendTo} is ${this.status}`)
            ),
            this.dialogContainer
        );
        return view;
    }

    appendMessage(message: ResponseData) {
        if (message.type === 'MSG_SEND') {
            if (message.payload.message.to !== this.sendTo) {
                return;
            }
            const view = div(
                'message message--right',
                p('message__author', `${message.payload.message.from}`),
                p('message__text', `${message.payload.message.text}`),
                p(
                    'message__time',
                    `${getDataFromTimeStemp(message.payload.message.datetime)}`
                )
            );
            if (this.dialogContainer) {
                this.dialogContainer.append(view);
            }
        }
    }

    createMessage(data: Message) {
        let msgclass: string;
        if (data.from === this.sendTo) {
            msgclass = 'message message--left';
        } else {
            msgclass = 'message message--right';
        }
        const view = div(
            `${msgclass}`,
            p('message__author', `${data.from}`),
            p('message__text', `${data.text}`),
            p('message__time', `${getDataFromTimeStemp(data.datetime)}`)
        );
        if (this.dialogContainer) {
            this.dialogContainer.append(view);
        }
    }

    getHistory() {
        Network.send({
            id: '',
            type: 'MSG_FROM_USER',
            payload: {
                user: {
                    login: this.sendTo,
                },
            },
        });
    }

    updateHistory(data: ResponseData) {
        if (data.type === 'MSG_FROM_USER') {
            const { messages } = data.payload;
            messages.forEach((message) => {
                this.createMessage(message);
            });
        }
        console.log(data, 'update history');
        if (this.dialogContainer?.getElement()) {
            scrollToBottom(this.dialogContainer?.getElement());
        }
        // const { messages } = data.payload;
    }

    send(message: string) {
        console.log(message);
        Network.send({
            id: null,
            type: 'MSG_SEND',
            payload: {
                message: {
                    to: this.sendTo,
                    text: message,
                },
            },
        });
    }
}

export default Communication;
