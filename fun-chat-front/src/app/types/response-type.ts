export type ResponseData =
    | UserLoginResponse
    | UserLogoutResponse
    | UserActiveResponse
    | UserInactiveResponse
    | MessageSendResponse
    | MsgFromUserResponse;

export type UserLoginData = { login: string; password: string };

type UserLoginResponse = {
    id: string;
    type: 'USER_LOGIN';
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
};

type UserLogoutResponse = {
    id: string;
    type: 'USER_LOGOUT';
    payload: {
        user: {
            login: string;
            isLogined: boolean;
        };
    };
};

type UserActiveResponse = {
    id: string;
    type: 'USER_ACTIVE';
    payload: {
        users: string[];
    };
};

type UserInactiveResponse = {
    id: string;
    type: 'USER_INACTIVE';
    payload: {
        users: string[];
    };
};

export type MessageSendResponse = {
    id: string;
    type: 'MSG_SEND';
    payload: {
        message: {
            id: string;
            from: string;
            to: string;
            text: string;
            datetime: number;
            status: {
                isDelivered: boolean;
                isReaded: boolean;
                isEdited: boolean;
            };
        };
    };
};

type MsgFromUserResponse = {
    id: string;
    type: 'MSG_FROM_USER';
    payload: {
        messages: Message[];
    };
};

export type Message = {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
    };
};

export type ServerRequest<T> = {
    id: string | null;
    type: string;
    payload: T;
};

export type UserData = {
    login: string;
    isLogined: boolean;
};
