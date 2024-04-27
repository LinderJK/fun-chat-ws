import { div, h1, p } from '../components/BaseComponents';

const reconnectPageView = () => {
    const content = div(
        'container-fluid p-0 app-container',
        div(
            'container reconnect-content my-5',
            div(
                'main',
                h1('reconnect-title', 'Welcome to Fun-chat'),
                p(
                    'reconnect-description',
                    'SERVER CONNECTION PROBLEM, PLEASE STEND BY'
                ),
                p('reconnect-description', 'TRY TO RECONNECT EVERY 5 SECONDS')
            )
        )
    );
    return { element: content, map: content.getAllChildrenMap() };
};

export default reconnectPageView;
