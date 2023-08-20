class GenericException extends Error {
    constructor(code) {
        super(code);
        this.code = code;
    }
}

module.exports = GenericException