import './input.scss';
import Component from '../Component';

interface IInputConstructor {
    className: string;
    id?: string;
    type?: string;
    placeholder?: string;
}

class Input extends Component {
    constructor({
        className,
        id = '',
        type = '',
        placeholder = '',
    }: IInputConstructor) {
        super({
            tagName: 'input',
            className: `${className} input`,
            attributes: { id, type, placeholder },
        });
    }

    get value(): string {
        const inputElement = this.getElement() as HTMLInputElement;
        return inputElement.value;
    }

    get id(): string {
        const inputElement = this.getElement() as HTMLInputElement;
        return inputElement.id;
    }

    deleteValue() {
        const inputElement = this.getElement() as HTMLInputElement;
        inputElement.value = '';
    }
}

export default Input;
