module.exports = class ApiOrderDto {
    constructor(charge, start_count, status, remains, currency) {
        this.charge = charge;
        this.start_count = start_count;
        this.status = status;
        this.remains = remains;
        this.currency = currency;
    }

    static builder() {
        return new ApiOrderDtoBuilder()
    }
}

class ApiOrderDtoBuilder {
    constructor() {
        this.charge = null;
        this.start_count = null;
        this.status = null;
        this.remains = null;
        this.currency = null;
    }

    withCharge(charge) {
        this.charge = charge;
        return this;
    }

    withStartCount(start_count) {
        this.start_count = start_count;
        return this;
    }

    withStatus(status) {
        this.status = status;
        return this;
    }

    withRemains(remains) {
        this.remains = remains;
        return this;
    }

    withCurrency(currency) {
        this.currency = currency;
        return this;
    }

    build() {
        return new Charge(
            this.charge,
            this.start_count,
            this.status,
            this.remains,
            this.currency
        );
    }
}