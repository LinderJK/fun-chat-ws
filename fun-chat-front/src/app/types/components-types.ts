export interface IComponent {
    elem: HTMLElement;
    children: IComponent[];

    getElement(): HTMLElement;

    delete(): void;

    deleteChildren(): void;

    deleteChild(child: IComponent): void;

    setAttributes(attributes: { [x: string]: string | boolean }): void;

    append(element: IComponent): void;

    deleteAttribute(attribute: string): void;

    getTextContent(): string | null;

    getAllChildrenMap(): Map<string, IComponent>;

    appendChildren(children: IComponent[]): void;

    addListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options?: boolean
    ): void;

    removeListener(
        event: keyof HTMLElementEventMap,
        listener: EventListener,
        options?: boolean
    ): void;

    addStyle(styles: { [key: string]: string }): void;

    setTextContent(textContent: string): void;

    getWidth(): number;
}

export interface IInput extends IComponent {
    get value(): string;

    get id(): string;

    deleteValue(): void;
}

export type ComponentMap = Map<string, IComponent> | undefined;

export type PageView = {
    element: IComponent;
    map: ComponentMap;
};
