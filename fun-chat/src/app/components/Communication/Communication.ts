import './Communication.scss';
import { div, divText, p } from '../../page/components/BaseComponents';
import Network from '../../services/Network';
import { IComponent } from '../../types/components-types';
import { Message, ResponseData } from '../../types/response-type';
import { getDataFromTimeStamp, scrollToBottom } from '../../utils/utils';

class Communication {
    /**
     * The username of the recipient user.
     * @type {string}
     */
    userTo: string;

    /**
     * The username of the sender user.
     * @type {string}
     */
    userFrom: string;

    /**
     * The status of the recipient user.
     * @type {string}
     */
    statusUserTo: string;

    /**
     * The view element representing the communication dialog.
     * @type {IComponent}
     */
    view;

    /**
     * The container element for displaying dialog messages.
     * @type {IComponent | null}
     */
    dialogContainer: IComponent | null = null;

    constructor(userFrom: string, userTo: string, statusUserTo: boolean) {
        this.userTo = userTo;
        this.userFrom = userFrom;
        this.statusUserTo = statusUserTo ? 'Online' : 'Offline';
        this.view = this.createView();
    }

    /**
     * Creates the view element for the communication dialog.
     * @returns {IComponent} The view element.
     */
    createView(): IComponent {
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

    /**
     * Appends a message to the communication dialog.
     * @param {ResponseData} data The message data.
     */
    appendMessage(data: ResponseData) {
        if (data.type === 'MSG_SEND') {
            this.createMessage(data.payload.message);
        }
    }

    /**
     * Creates a message element and appends it to the dialog.
     * @param {Message} data The message data.
     */
    createMessage(data: Message) {
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

    /**
     * Updates the communication dialog with message history.
     * @param {Message[]} data The message history data.
     */
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

    /**
     * Retrieves the message history from the server.
     */
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

    /**
     * Sends a message to the recipient user.
     * @param {string} message The message to send.
     */
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
