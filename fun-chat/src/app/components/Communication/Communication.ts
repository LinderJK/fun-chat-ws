import './Communication.scss';
import { div, divText, p } from '../../page/components/BaseComponents';
import Network from '../../services/Network';
import { IComponent } from '../../types/components-types';
import { Message, ResponseData } from '../../types/response-type';
import { getDataFromTimeStamp, scrollToBottom } from '../../utils/utils';

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
        return div(
            'dialog-view',
            div(
                'dialog-info',
                p('info-text', `${this.sendTo} is ${this.status}`)
            ),
            this.dialogContainer
        );
    }

    appendMessage(data: ResponseData) {
        if (data.type === 'MSG_SEND') {
            if (data.payload.message.from !== this.sendTo) {
                return;
            }
            this.createMessage(data.payload.message);
        }
    }

    createMessage(data: Message) {
        // if (data.to !== this.sendTo) {
        //     return;
        // }
        let msgClass: string;
        if (data.from === this.sendTo) {
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
        console.log(data, 'MYY DATA!!!');
        if (data.length === 0) {
            this.dialogContainer?.append(
                divText('', 'Its start dialog, go chatting')
            );
            return;
        }
        data.forEach((message) => {
            this.createMessage(message);
        });

        console.log(data, 'update history');
        if (this.dialogContainer?.getElement()) {
            scrollToBottom(this.dialogContainer?.getElement());
        }
        // const { messages } = data.payload;
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
