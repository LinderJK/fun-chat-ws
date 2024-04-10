import './login.scss';
import {
    button,
    div,
    divText,
    h1,
    input,
    span,
} from '../../page/components/BaseComponents';
import { PageView } from '../../types/components-types';

class Login {
    view: PageView;

    constructor() {
        this.view = this.createView();
    }

    createView() {
        const handleLoginClick = () => {
            document.dispatchEvent(new Event('loginClicked'));
        };
        const content = div(
            'container-fluid login-container',
            div(
                'login-content',
                h1('login-content__title', 'Welcome to FUN-CHAT'),
                span('login-content__description', 'Please login'),

                div(
                    'form  mb-3 align-items-center',
                    div(
                        'input-group',
                        span(
                            'input-group-text',
                            'First Name',
                            'login-first-name'
                        ),
                        input(' form-control', 'text', '', 'input-first-name')
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
                        input('form-control', 'text', '', 'input-second-name')
                    ),
                    divText('form-text', '')
                ),
                button('btn btn-primary btn-login', 'Login', handleLoginClick)
            )
        );
        return {
            element: content,
            map: content.getAllChildrenMap(),
        };
    }
}

export default Login;
