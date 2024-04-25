import './login.scss';
import {
    button,
    div,
    h1,
    input,
    p,
    span,
} from '../../page/components/BaseComponents';
import { IComponent, IInput } from '../../types/components-types';
import { CallbackFn, UserLoginData } from '../../types/other-types';

class Login {
    view: HTMLElement;

    isLogin: boolean;

    loginBtn: IComponent | undefined = undefined;

    inputs: { input: IInput; hint: IComponent }[] = [];

    // inputsFirstName: IComponent | undefined = undefined;
    //
    // inputLastName: IComponent | undefined = undefined;
    errorMessage: IComponent | undefined = undefined;

    callback: CallbackFn | null = null;

    constructor(callback: CallbackFn) {
        this.callback = callback;
        this.isLogin = false;
        this.view = this.createView().element.getElement();
    }

    login() {
        const valid = this.isValid();
        if (valid) {
            const inputData = this.collectInputData() as UserLoginData;
            sessionStorage.setItem('user', JSON.stringify(inputData));
            if (this.callback) {
                this.callback();
            }
        } else {
            console.error('failed login');
        }
        return false;
    }

    logout() {
        sessionStorage.clear();
    }

    addErrorMessage(message: string) {
        const error = span('error', `${message.toUpperCase()}`);
        this.errorMessage?.deleteChildren();
        this.errorMessage?.append(error);
    }

    getSessionUser() {
        const user = sessionStorage.getItem('user');
        if (user) {
            return JSON.parse(user) as UserLoginData;
        }
        return null;
    }

    collectInputData() {
        const inputData: { [key: string]: string } = {};
        this.inputs.forEach((el) => {
            inputData[el.input.id] = el.input.value;
        });
        return inputData;
    }

    isValid(): boolean {
        const valid = this.inputs.map((el) => {
            const { isValid, message } = this.validate(el.input);
            el.hint.setTextContent(message);
            return isValid;
        });
        return valid.every((el) => {
            return el;
        });
    }

    validate(element: IInput) {
        let message = '\u3164';
        let isValid = false;
        switch (true) {
            case element.value.length === 0:
                message = 'The field must not be empty';
                break;
            case element.id === 'login' && !/^[a-zA-Z-]+$/.test(element.value):
                message =
                    'Only letters of the English alphabet and the hyphen symbol';
                break;
            case element.id === 'login' && element.value.length < 3:
                message = 'Minimum length - 3 characters';
                break;
            case element.id === 'password' && element.value.length < 6:
                message = 'Minimum length - 6 characters';
                break;
            case element.id === 'login' && !/^[A-Z]/.test(element.value):
                message = 'The first letter must be in uppercase';
                break;
            case element.value.length > 10:
                message = 'Maximum length - 10 characters';
                break;
            default:
                isValid = true;
                break;
        }
        return { isValid, message };
    }

    createView() {
        this.loginBtn = button('btn btn-primary btn-login', 'Login', () => {
            this.login();
        });
        this.loginBtn.addListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
        const inputLogin = input(
            ' form-control input-login',
            'text',
            '',
            'login'
        );
        const inputLoginHint = span('form-text', '\u3164');

        this.errorMessage = div('error-message');

        const inputPassword = input(
            'form-control input-password',
            'password',
            '',
            'password'
        );
        const inputPasswordHint = span('form-text', '\u3164');
        this.inputs.push(
            { input: inputLogin, hint: inputLoginHint },
            { input: inputPassword, hint: inputPasswordHint }
        );

        const content = div(
            'container-fluid login-container',
            div(
                'login-content',
                h1('login-content__title', 'Welcome to FUN-CHAT'),
                p('login-content__description', 'Please login'),
                this.errorMessage,
                div(
                    'form mb-3 align-items-center',
                    div(
                        'input-group',
                        span('input-group-text', 'Login', 'login-first-name'),
                        inputLogin
                    ),
                    inputLoginHint
                ),

                div(
                    'form mb-3 align-items-center',
                    div(
                        'input-group col-8',
                        span(
                            'input-group-text',
                            'Password',
                            'login-second-name'
                        ),
                        inputPassword
                    ),
                    inputPasswordHint
                ),

                this.loginBtn
            )
        );
        content.addListener('keydown', (event) => {
            if ((event as KeyboardEvent).key === 'Enter') {
                event.preventDefault();
                this.login();
            }
        });
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Login;
