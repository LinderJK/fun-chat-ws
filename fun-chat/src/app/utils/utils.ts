export default function scrollToBottom(element: HTMLElement) {
    element.scrollTo({
        top: element.scrollHeight,
        // behavior: 'smooth',
    });
}
