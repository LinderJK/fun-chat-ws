export function scrollToBottom(element: HTMLElement): void {
    element.scrollTo({
        top: element.scrollHeight,
    });
}

export function getDataFromTimeStamp(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
}
