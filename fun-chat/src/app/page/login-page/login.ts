import './login.scss';
import {
    button,
    div,
    divText,
    h1,
    input,
    span,
} from '../components/BaseComponents';
import { IComponent, IInput, PageView } from '../../types/components-types';

class Login {
    view: PageView;

    loginBtn: IComponent | undefined = undefined;

    inputs: IInput[] = [];

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
        const createHint = (message: string) => {
            return span('input-hint', `${message}`);
        };

        let valid = false;
        this.inputs.forEach((el) => {
            const { isValid, message } = this.validate(el);
            valid = isValid;
            el.deleteChildren();
            el.append(createHint(message));
        });
        return valid;
    }

    validate(element: IInput) {
        let message = '';
        let isValid = false;
        switch (true) {
            case element.value.length === 0:
                message = 'The field must not be empty';
                break;
            case !/^[a-zA-Z-]+$/.test(element.value):
                message =
                    'Only letters of the English alphabet and the hyphen symbol';
                break;
            case element.value === 'input-first-name' &&
                element.value.length < 3:
                message = 'Minimum length - 3 characters';
                break;
            case element.value === 'input-second-name' &&
                element.value.length < 4:
                message = 'Minimum length - 4 characters';
                break;
            case !/^[A-Z]/.test(element.value):
                message = 'The first letter must be in uppercase';
                break;
            case element.value.length > 15:
                message = 'Maximum length - 15 characters';
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
        const inputLastName = input(
            'form-control',
            'text',
            '',
            'input-second-name'
        );
        this.inputs.push(inputFirstName, inputLastName);

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
                    divText('form-text', '')
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
                    divText('form-text', ''),
                    this.loginBtn
                )
            )
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Login;
