class UpdateDepositDto {
    constructor({ids, balance, amount, new_balance, status, note}) {
        this.ids = ids;
        this.balance = balance;
        this.amount = amount;
        this.new_balance = new_balance;
        this.status = status;
        this.note = note;
    }
}

module.exports = UpdateDepositDto