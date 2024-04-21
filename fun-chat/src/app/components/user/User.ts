import './user.scss';
import { UserData } from '../../types/response-type';
import { div, p, span } from '../../page/components/BaseComponents';
import { IComponent } from '../../types/components-types';
import Network from '../../services/Network';

class User {
    private readonly privateName: string;

    private readonly privatelogin: string;

    isLogined: boolean;

    view: IComponent | undefined = undefined;

    iconColor: string;

    private readonly password: string = '';

    constructor(data: UserData, password: string = '') {
        this.privatelogin = data.login;
        this.privateName = data.login;
        this.isLogined = data.isLogined;
        this.iconColor = this.randomColor();
        this.password = password;
    }

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
                span('user-item__status', `${this.createStatusView()}`)
            )
        );
        this.view.addListener('click', () => {
            console.log('GOO Message');
        });
        return this.view;
    }

    logout() {
        this.isLogined = false;
        console.log('logout');
        const payloadObj = {
            user: {
                login: this.login,
                password: this.password,
            },
        };
        Network.send({ id: '', type: 'USER_LOGOUT', payload: payloadObj });
    }

    createStatusView() {
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

    get login() {
        return this.privatelogin;
    }

    randomColor(): string {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
}

export default User;
