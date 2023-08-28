class OrderViewDto {
    constructor(order_id, service_id, service_name, 
        total_charge, quantity, link, created, api_order_id,
        api_key, api_url, status) {
        this.order_id = order_id
        this.service_id = service_id
        this.service_name = service_name
        this.total_charge = total_charge
        this.quantity = quantity
        this.link = link
        this.created = created
        this.api_order_id = api_order_id
        this.api_key = api_key
        this.api_url = api_url
        this.status = status
    }

    static builder() {
        return new OrderViewBuilder()
    }

    /**
     * @param {Array} res 
     */
    static mapping(res) {
        let order = []
        res.forEach(e => {
            order.push(
                new this(
                    e.order_id,
                    e.service_id,
                    e.service_name,
                    e.total_charge,
                    e.quantity,
                    e.link,
                    e.created,
                    e.api_order_id,
                    e.api_key,
                    e.api_url)
            )
        })

        return order
    }
}

class OrderViewBuilder {
    constructor() {
      this.service_id = undefined
      this.service_name = undefined
      this.total_charge = undefined
      this.quantity = undefined
      this.link = undefined
      this.created = undefined
      this.api_order_id = undefined
    }
  
    setServiceId(serviceId) {
      this.service_id = serviceId
      return this
    }
  
    setServiceName(serviceName) {
      this.service_name = serviceName
      return this
    }
  
    setTotalCharge(totalCharge) {
      this.total_charge = totalCharge
      return this
    }
  
    setQuantity(quantity) {
      this.quantity = quantity
      return this
    }
  
    setLink(link) {
      this.link = link
      return this
    }
  
    setCreated(created) {
      this.created = created
      return this
    }

    setApiOrderId(api_order_id) {
      this.api_order_id = api_order_id
      return this
    }
  
    build() {
      return new OrderViewDto(
        this.service_id,
        this.service_name,
        this.total_charge,
        this.quantity,
        this.link,
        this.created,
        this.api_order_id,
      )
    }
  }

module.exports = OrderViewDto