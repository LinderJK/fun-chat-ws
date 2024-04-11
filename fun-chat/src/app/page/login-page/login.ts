import './login.scss';
import { button, div, h1, input, span } from '../components/BaseComponents';
import { IComponent, IInput, PageView } from '../../types/components-types';

class Login {
    view: PageView;

    loginBtn: IComponent | undefined = undefined;

    inputs: { input: IInput; hint: IComponent }[] = [];

    inputsFirstName: IComponent | undefined = undefined;

    inputLastName: IComponent | undefined = undefined;

    constructor() {
        this.view = this.createView();
    }

    login() {
        const valid = this.isValid();
        if (valid) {
            // const data = [];
            // this.inputs.forEach((input) => {
            //     data.push({input.value, input.id})
            // });
            console.log('login');
        } else {
            console.log('failed login');
        }
        return false;
    }

    isValid(): boolean {
        let valid = false;
        this.inputs.forEach((el) => {
            const { isValid, message } = this.validate(el.input);
            valid = isValid;
            el.hint.setTextContent(message);
        });
        return valid;
    }

    validate(element: IInput) {
        let message = '\u3164';
        let isValid = false;
        switch (true) {
            case element.value.length === 0:
                message = 'The field must not be empty';
                break;
            case !/^[a-zA-Z-]+$/.test(element.value):
                message =
                    'Only letters of the English alphabet and the hyphen symbol';
                break;
            case element.value.length < 3:
                message = 'Minimum length - 3 characters';
                break;
            case !/^[A-Z]/.test(element.value):
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
        const inputFirstName = input(
            ' form-control',
            'text',
            '',
            'input-first-name'
        );
        const inputFirstNameHint = span('form-text', '\u3164');

        const inputLastName = input(
            'form-control',
            'text',
            '',
            'input-second-name'
        );
        const inputLastNameHint = span('form-text', '\u3164');
        this.inputs.push(
            { input: inputFirstName, hint: inputFirstNameHint },
            { input: inputLastName, hint: inputLastNameHint }
        );

        const content = div(
            'container-fluid login-container',
            div(
                'login-content',
                h1('login-content__title', 'Welcome to FUN-CHAT'),
                span('login-content__description', 'Please login'),

                div(
                    'form mb-3 align-items-center',
                    div(
                        'input-group',
                        span(
                            'input-group-text',
                            'First Name',
                            'login-first-name'
                        ),
                        inputFirstName
                    ),
                    inputFirstNameHint
                ),

                div(
                    'form mb-3 align-items-center',
                    div(
                        'input-group col-8',
                        span(
                            'input-group-text',
                            'Surname',
                            'login-second-name'
                        ),
                        inputLastName
                    ),
                    inputLastNameHint
                ),
                this.loginBtn
            )
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Login;
