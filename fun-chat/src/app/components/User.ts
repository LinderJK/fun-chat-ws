class User {
    name: string;

    login: string;

    // isLogin: boolean;

    constructor(login: string) {
        this.login = login;
        this.name = login;
    }
}

export default User;
