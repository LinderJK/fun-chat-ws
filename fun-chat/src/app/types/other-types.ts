import { ResponseData } from './response-type';

export type CallbackDataFn = (data: ResponseData) => void;

export type UserLoginData = { login: string; password: string };

export type CallbackFn = () => void;
