const express = require('express')
const app = express.Router()

const serviceService = require('../service/serviceService')
const accountService = require('../../account/service/accountService')
const AddServiceDto = require('../dto/addServiceDto')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const isAdmin = require('../../../global/config/filter/isAdmin')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')

app.get('/admin/services', isAdmin, async (req, res) => {
    try {
        const categoryId = req.query.sort_by || 0
        
        const [services, category] = await adminService.getServices(categoryId)
        
        res.render('admin/services', {
            services, 
            category: category,
            sort_by: categoryId
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/services/store', isAdmin, async (req, res) => {
    try {
        const {
            id,
            category, 
            add_type,
            api_provider_id,
            api_service_id,
            original_price,
            min, 
            max, 
            name,
            price, 
            status, 
            desc
        } = req.body
    
        if (
            name === "" || 
            api_provider_id === "" || 
            api_service_id === "" ||
            status === "" ||
            !price || !min || !max || !original_price ||
            add_type === "" ||
            category === ""
        ) throw new NotEngoughArgsException()
    
        const addServiceDto = AddServiceDto.builder()
            .setAddType(add_type)
            .setApiProviderId(api_provider_id)
            .setApiServiceId(api_service_id[1])
            .setCategory(category)
            .setDesc(desc)
            .setMax(max)
            .setMin(min)
            .setName(name)
            .setOriginalPrice(original_price)
            .setPrice(price)
            .setStatus(status)
            .build()

        if (id == "" || !id) await serviceService.saveService(addServiceDto)
        else await serviceService.updateService(addServiceDto, id)
    
    
        res.send(JSON.stringify({message: "저장 성공하였습니다.", status: "success"}))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/service_detail/:serviceId', async (req, res) => {
    try {
        const detail = await serviceService.serviceDetail(req.params.serviceId || null, req.session.rate)

        res.render(__dirname + "/../view/assets/getServiceInfo", {
            name: detail.name,
            min: detail.min,
            max: detail.max,
            rate: detail.rate,
            description: detail.description,
        })

    } catch(e) {
        console.error(e)
        res.send()
    }
})

app.post('/services/sort/:categoryId', async (req, res) => {
    try {
        const user = await accountService.info(req)
        const [services, categoryName] = await serviceService.serviceList(req.params.categoryId, req.session.rate)

        res.render('assets/user_service_list', {
            ...user,
            categoryName,
            services
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/services/delete/:serviceId', isAdmin, async (req, res) => {
    try {

        await serviceService.deleteService(req.params.serviceId || null)

        res.send(JSON.stringify({
            message: "서비스를 삭제하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/services/change_status/:serviceId', isAdmin, async (req, res) => {
    try {
        const { status } = req.body
        await serviceService.updateStatus(req.params.serviceId || null, status)

        res.send(JSON.stringify({
            message: "서비스를 업데이트하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app