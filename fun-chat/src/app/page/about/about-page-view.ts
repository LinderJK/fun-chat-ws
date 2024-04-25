import './about-page.scss';
import { button, div, h1, p } from '../components/BaseComponents';
import { CallbackFn } from '../../types/other-types';

const aboutPageView = (callback: CallbackFn) => {
    const content = div(
        'container-fluid p-0 app-container',
        div(
            'container about-content my-5',
            div(
                'main',
                h1('about-title', 'Welcome to Fun-chat'),
                p(
                    'about-description',
                    '"Fun Chat" is an application for communicating with friends and loved ones in real-time. With its help, users can exchange messages, share their thoughts, impressions, and emotions.'
                )
            ),
            button('about-btn', 'Back', callback)
        )
    );
    return { element: content, map: content.getAllChildrenMap() };
};

export default aboutPageView;
