class Helper {

    handleGetUserFromLocal = () => {
        const user = localStorage.getItem("user-detail");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser;
        }

        return null;
    }

}

const helper = new Helper();
export { helper }