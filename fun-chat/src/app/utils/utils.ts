export function scrollToBottom(element: HTMLElement) {
    element.scrollTo({
        top: element.scrollHeight,
        // behavior: 'smooth',
    });
}

export function getDataFromTimeStemp(timestamp: number) {
    const sec = timestamp / 1000;
    const date = new Date(sec);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
}
