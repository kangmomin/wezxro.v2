class SaveDepositDto {
    constructor(builder) {
        this.user_id = builder.user_id,
            this.rname = builder.rname,
            this.pay = builder.pay,
            this.type = builder.type,
            this.agree = builder.agree,
            this.business_name = builder.business_name,
            this.business_regno = builder.business_regno,
            this.business_owner = builder.business_owner,
            this.business_phone = builder.business_phone,
            this.business_email = builder.business_email,
            this.personal_phone = builder.personal_phone
    }

    static fromRequest(req) {
        const {
            payname,
            payamount,
            type,
            agree,
            business_name,
            business_regno,
            business_owner,
            business_phone,
            business_email,
            personal_phone,
        } = req.body;

        return new SaveDepositDto({
            userId: null,
            rname: payname,
            pay: payamount,
            type: type,
            agree: agree,
            businessName: business_name,
            businessRegno: business_regno,
            businessOwner: business_owner,
            businessPhone: business_phone,
            businessEmail: business_email,
            personalPhone: personal_phone,
        });
    }

    static get Builder() {
        class Builder {
            constructor() { }

            withUserId(user_id) {
                this.user_id = user_id;
                return this;
            }

            withRname(rname) {
                this.rname = rname;
                return this;
            }

            withPay(pay) {
                this.pay = pay;
                return this;
            }

            withType(type) {
                this.type = type;
                return this;
            }

            withAgree(agree) {
                this.agree = agree;
                return this;
            }

            withBusinessName(business_name) {
                this.business_name = business_name;
                return this;
            }

            withBusinessRegno(business_regno) {
                this.business_regno = business_regno;
                return this;
            }

            withBusinessOwner(business_owner) {
                this.business_owner = business_owner;
                return this;
            }

            withBusinessPhone(business_phone) {
                this.business_phone = business_phone;
                return this;
            }

            withBusinessEmail(business_email) {
                this.business_email = business_email;
                return this;
            }

            withPersonalPhone(personal_phone) {
                this.personal_phone = personal_phone;
                return this;
            }

            build() {
                return new SaveDepositDto(this);
            }
        }
        return Builder;
    }
}

module.exports = SaveDepositDto