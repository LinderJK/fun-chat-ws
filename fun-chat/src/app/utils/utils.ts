export function scrollToBottom(element: HTMLElement) {
    element.scrollTo({
        top: element.scrollHeight,
        // behavior: 'smooth',
    });
}

export function getDataFromTimeStamp(timestamp: number) {
    const date = new Date(timestamp);
    // const year = date.getFullYear();
    // const month = date.getMonth()
    // const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
}
