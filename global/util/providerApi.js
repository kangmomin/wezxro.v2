const axios = require('axios')

class ProviderApi {

  /**
   * @param {String} API_KEY 도매처 key
   * @param {String} API_URL 도매처 링크 
   */
  constructor(API_KEY, API_URL, IsFormData = false) {
    this.API_URL = API_URL
    this.API_KEY = API_KEY
    this.IsFormData = IsFormData
  }
  
  async fetchApi(action, params = {}) {
    const data = { key: this.API_KEY , action, ...params };
    
    const headers = this.IsFormData ? {
      'Content-Type': 'multipart/form-data'
    } : {}

    const response = await axios.post(this.API_URL, data, headers);
    return response.data;
  }
  
  /**
   * 서비스 가져오기
   * @returns services
   */
  async getServices() {
    return this.fetchApi('services');
  }
  
  /**
   * 주문 추가 
   * @param {Number} service
   * @param {String} link
   * @param {Number} quantity 주문량 
   * @param {*} runs ?? 
   * @param {Number} interval 실행 간격(분단위)
   * @returns order id
   */
  async addOrder(service, link, quantity) {
    return this.fetchApi('add', { service, link, quantity });
  }
  
  /**
   * @param {Number} order
   * @returns 
   */
  async getOrderStatus(order) {
    return this.fetchApi('status', { order });
  }
  
  /**
   * 다중 주문 하기
   * @param {Number[]} orders 최대 100개 
   * @returns 
   */
  async getMultipleOrdersStatus(orders) {
    return this.fetchApi('status', { orders: orders.join(',') });
  }
  
  async createRefill(order) {
    return this.fetchApi('refill', { order });
  }
  
  async createMultipleRefills(orders) {
    return this.fetchApi('refill', { orders: orders.join(',') });
  }
  
  async getRefillStatus(refill) {
    return this.fetchApi('refill_status', { refill });
  }
  
  async getMultipleRefillStatus(refills) {
    return this.fetchApi('refill_status', { refills: refills.join(',') });
  }
  
  /**
   * 
   * @returns 잔액 
   */
  async getUserBalance() {
    return this.fetchApi('balance');
  }
}


module.exports = ProviderApi