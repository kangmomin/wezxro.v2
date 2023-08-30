const express = require('express')
const app = express.Router()

const serviceService = require('../service/serviceService')
const AddServiceDto = require('../dto/addServiceDto')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')

app.get('/admin/services', async (req, res) => {
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

app.post('/admin/services/store', async (req, res) => {
    try {
        const {
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
    
        if (name === "") throw new NOT_ENOUGH_ARGS()
    
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
    
        await serviceService.saveService(addServiceDto)
    
        res.send(JSON.stringify({message: "저장 성공하였습니다.", status: "success"}))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/service_detail/:serviceId', async (req, res) => {
    try {
        const detail = await serviceService.serviceDetail(req.params.serviceId || 0)

        res.render("assets/getServiceInfo", {
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

// app.post('/admin/services/change_status/:id', async (req, res) => {
//     const serviceId = req.params.id || null
//     const status = req.body.status == 1

//     try {
//         if (isNaN(Number(serviceId))) throw new Error("service id is not number")

//         await serviceService.updateStatus(serviceId, status)
        
//         res.send(JSON.stringify({ 
//             message: "status가 업데이트 되었습니다.", 
//             status: "success" 
//         }))
//     } catch(e) {
//         let errMsg = "something wrong"

//         const error404 = isSame(e.toString(),
//             [
//                 "Error: service is not exist",
//                 "Error: service id is null",
//                 "Error: service id is not number",
//                 "Error: status is not number",
//                 "Error: status is null"
//             ], true)

//         if (!error404) console.log(e)
        
//         res.send(JSON.stringify({
//             message: error404 ?
//                 e.toString().split("Error: ")[1] :
//                 errMsg,
//             status: "error"
//         }))
//     }
// })

module.exports = app