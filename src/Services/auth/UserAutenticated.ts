
interface userData {
    email: String;
    role: String;
    _id: String;
    name: String;
}


class UserAutenticated {
    checkUser = (): userData | null => {
        const user: userData | null = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
        return user;
    }

    isAdmin = () => {
        return this.checkUser()?.role === "admin"
    }
};

export const userAutenticated = new UserAutenticated();