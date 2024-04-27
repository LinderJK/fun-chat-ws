import { div } from '../components/BaseComponents';

const mainPageView = () => {
    const content = div(
        'container-fluid p-0 app-container',
        div('app-content', div('main'))
    );
    return { element: content.getElement(), map: content.getAllChildrenMap() };
};

export default mainPageView;
