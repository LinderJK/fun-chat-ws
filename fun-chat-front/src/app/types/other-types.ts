import { ResponseData } from './response-type';

export type CallbackDataFn = (data: ResponseData) => void;

export type CallbackFn = () => void;

export type HandlerFn = (evt: Event) => void;
