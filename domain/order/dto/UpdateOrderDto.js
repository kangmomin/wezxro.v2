class UpdateOrderDto {
    constructor({id,
        charge, quantity, link,
        start_counter, remains, status}) {
        this.orderId = id
        this.totalCharge = charge
        this.quantity = quantity
        this.link = link
        this.startCnt = start_counter
        this.remain = remains
        this.status = status
    }
}

module.exports = UpdateOrderDto