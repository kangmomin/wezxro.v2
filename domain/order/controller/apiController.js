const app = require('express').Router()

const serviceService = require('../../service/service/serviceService')
const accountService = require('../../account/service/accountService')
const orderService = require('../service/orderService')
const SaveOrderDto = require('../dto/SaveOrderDto')
const ProviderApi = require('../../../global/util/providerApi')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const AddOrderException = require('../exception/AddOrderException')
const OrderMaxException = require('../exception/OrderMaxException')
const OrderMinException = require('../exception/OrderMinException')
const UpdateOrderDto = require('../dto/UpdateOrderDto')

app.post("/order/ajax_add_order", async (req, res) => {
  const { 
    category_id, 
    service_id, 
    link, 
    quantity, 
    total_charge,
    service_max,
    service_min 
  } = req.body

  try {
    if (!isValid(service_id, link, quantity, total_charge)) {
      res.send(JSON.stringify({
        status: "error", 
        message: '주문 값이 정상적으로 요청되지 않았습니다.'
      }))
      return
    }
    if (Number(service_max[0].replaceAll(",", "")) < quantity) throw new OrderMaxException()
    if (Number(service_min[0].replaceAll(",", "")) > quantity) throw new OrderMinException()

    const info = await accountService.info(req)

    if (req.session.rate !== null) total_charge = total_charge * req.session.rate / 100
    if (info.money < total_charge) {
      res.send(JSON.stringify({
        status: "error", 
        message: '잔액이 부족합니다.'
      }))
      return
    }
    const providerInfo = await serviceService.addOrderInfo(service_id)
    
    const api = new ProviderApi(providerInfo.apiKey, providerInfo.apiUrl)
  
    const data = await api.addOrder(providerInfo.apiServiceId, link, 
                quantity, total_charge)
                
    if (data.error !== undefined) {
      throw new AddOrderException(data.error)
    }

    const saveOrderDto = SaveOrderDto.builder()
      .setCategoryId(category_id)
      .setLink(link)
      .setQuantity(quantity)
      .setServiceId(service_id)
      .setTotalCharge(total_charge)
      .setUserId(req.session.userId)
      .setApiOrderId(data.order)
      .build()

    await orderService.saveOrder(saveOrderDto)
    await accountService.updateMoney(info.money - total_charge, req.session.userId)
  
    res.send(JSON.stringify({
      message: `주문이 성공적으로 완료되었습니다. 잔액[${info.money - total_charge}원]`,
      status: "success"
    }))
  } catch(e) {
    ExceptionHandler(res, e)
  }
})

app.post("/admin/order/store/", async (req, res) => {
  try {
    const updateOrderDto = new UpdateOrderDto(req.body)
    await orderService.updateOrder(updateOrderDto)
    
    res.send(JSON.stringify({
      message: "주문을 수정하였습니다.",
      status: "success"
    }))
  } catch(e) {
    ExceptionHandler(res, e)
  }
})

function validateService(service) {
  // Service ID는 양의 정수여야 합니다.
  return Number(service) > 0;
}

function validateLink(link) {
  try {
    // 링크가 유효한지 확인하기 위해 URL 객체 생성
    new URL(link);
    return true;
  } catch (e) {
    return false;
  }
}

function validateQuantity(quantity) {
  // Quantity는 양의 정수여야 합니다.
  return Number(quantity) > 0;
}

function validTotalCharge(charge) {
  return Number(charge) > 0;
}

function isValid(service, link, quantity, charge) {
  return (
    validateService(service) &&
    validateLink(link) &&
    validateQuantity(quantity) &&
    validTotalCharge(charge)
  );
}

module.exports = app