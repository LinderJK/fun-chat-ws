import './user.scss';
import { UserData } from '../../types/response-type';
import { div, p, span } from '../../page/components/BaseComponents';
import { IComponent } from '../../types/components-types';
import Network from '../../services/Network';

/**
 * Represents a user in the chat.
 */
class User {
    /**
     * @type {string} The private name of the user.
     */
    private readonly privateName: string;

    /**
     * @type {string} The private login of the user.
     */
    private readonly privatelogin: string;

    /**
     * @type {boolean} Indicates whether the user is logged in.
     */
    isLogined: boolean;

    /**
     * The view component representing the user.
     * @type {IComponent | undefined}
     */
    view: IComponent | undefined = undefined;

    /**
     * The color of the user's icon.
     * @type {string}
     */
    iconColor: string;

    /**
     * @type {string} The password of the user.
     */
    private readonly password: string = '';

    /**
     * The number of unread messages for the user.
     * @type {number}
     */
    unreadMessageCount: number = 0;

    constructor(data: UserData, password: string = '') {
        this.privatelogin = data.login;
        this.privateName = data.login;
        this.isLogined = data.isLogined;
        this.iconColor = this.randomColor();
        this.password = password;
    }

    /**
     * Renders the user.
     * @returns {IComponent} The rendered user component.
     */
    render() {
        const icon = div(
            'flex-shrink-0 me-2 user-item__icon',
            p('user-item__icon-text', `${this.shortName()}`)
        );
        icon.setAttributes({
            style: `background-color: ${this.iconColor};`,
        });

        this.view = div(
            'd-flex text-muted pt-3 user-item',
            icon,
            div(
                'pb-3 mb-0 small lh-sm w-100',
                p('user-item__name', `${this.privateName}`),
                span('user-item__status', `${this.createStatusString()}`)
            ),
            span(
                'mx-2 unread-count',
                `${this.unreadMessageCount === 0 ? `` : `${this.unreadMessageCount}`} `
            )
        );
        this.view.addListener('click', () => {});
        return this.view;
    }

    /**
     * Logs out the user.
     */
    logout() {
        this.isLogined = false;
        const payloadObj = {
            user: {
                login: this.login,
                password: this.password,
            },
        };
        Network.send({ id: '', type: 'USER_LOGOUT', payload: payloadObj });
    }

    /**
     * Creates the status for the user.
     * @returns {string} The status.
     */
    createStatusString() {
        return this.status ? 'Online' : 'Offline';
    }

    shortName() {
        return this.privateName[0];
    }

    get status() {
        return this.isLogined;
    }

    get name() {
        return this.privateName;
    }

    get login(): string {
        return this.privatelogin;
    }

    randomColor(): string {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    increaseUnreadMessageCount() {
        this.unreadMessageCount += 1;
    }
}

export default User;
