class SaveOrderDto {
    constructor(service_id, category_id, 
        user_id,total_charge, quantity, link,
        api_order_id) {
        this.service_id = service_id
        this.category_id = category_id
        this.user_id = user_id
        this.total_charge = total_charge
        this.quantity = quantity
        this.link = link
        this.api_order_id = api_order_id
    }

    static builder() {
        return new SaveOrderDtoBuilder()
    }
}

class SaveOrderDtoBuilder {
    constructor() {
      this._service_id = null;
      this._category_id = null;
      this._user_id = null;
      this._total_charge = null;
      this._quantity = null;
      this._link = null;
      this._api_order_id = null;
    }
  
    setServiceId(service_id) {
      this._service_id = service_id;
      return this;
    }
  
    setCategoryId(category_id) {
      this._category_id = category_id;
      return this;
    }
  
    setUserId(user_id) {
      this._user_id = user_id;
      return this;
    }
  
    setTotalCharge(total_charge) {
      this._total_charge = total_charge;
      return this;
    }
  
    setQuantity(quantity) {
      this._quantity = quantity;
      return this;
    }
  
    setLink(link) {
      this._link = link;
      return this;
    }
    setApiOrderId(api_order_id) {
      this._api_order_id = api_order_id;
      return this;
    }
  
    build() {
      return new SaveOrderDto(
        this._service_id,
        this._category_id,
        this._user_id,
        this._total_charge,
        this._quantity,
        this._link,
        this._api_order_id
      );
    }
  }

module.exports = SaveOrderDto