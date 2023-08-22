class SaveProviderDto {
    constructor({ id, token, name, url, key, status, description }, userId) {
        this.id = id;
        this.token = token;
        this.name = name;
        this.url = url;
        this.key = key;
        this.status = status;
        this.userId = userId;
        this.description = description;
    }
}

module.exports = SaveProviderDto