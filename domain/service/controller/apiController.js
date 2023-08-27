const express = require('express')
const app = express.Router()

const adminService = require('../service/adminService')
const serviceService = require('../service/serviceService')
const CategoryIdNotFoundError = require('../exception/category/categoryIdNotFound')
const AddServiceDto = require('../dto/service/addServiceDto')
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

// app.get('/admin/services/provider_services', async (req, res) => {
//     const { provider_id } = req.body | null

//     try {
//         if (!provider_id) throw new Error("argError")

//         const htmlCode = await adminService.providerServices(provider_id)

//         res.send(htmlCode)
//     } catch (e) {
//         let errMsg = "something wrong"
//         let status = 500

//         if (e.toString() === "Error: argError") {
//             errMsg = "missing provider_id"
//             status = 400
//         }

//         res.status(status).json({ message: errMsg })
//     }
// }
// )
// app.get('/admin/services/update', async (req, res) => {
//     try {
//         const [category, provider] = await adminService.addServiceRender()
                   
//         res.render('admin/assets/services_update', {
//             category, 
//             providers: provider
//         })
//     } catch(e) {
//         const errInfo = {
//             status: 400, 
//             title: "Services", 
//             content: e.toString()
//         }
//         console.log(e)

//         res.render("error", errInfo)
//     }
// })

// /**
//  * 카테고리에 속하는 서비스 목록 요청
//  * HTML 코드 리턴
// */
// app.post('/order/get_services/:categoryId', async (req, res) => {
//     try {
//         const categoryId = req.params.categoryId || null
        
//         const htmlCode = await serviceService.findByCategoryIdFormat(categoryId)
        
//         res.send(htmlCode)
//     } catch(e) {
//         let message = ""
//         if (typeof e === CategoryIdNotFoundError) {
//             message = "카테고리 아이디가 필요합니다."
//         } else {
//             console.error(e)
//         }
        
//         res.send(message)
//     }
// })

// app.post('/admin/services/store', async (req, res) => {
//     const {
//         category, 
//         add_type,
//         api_provider_id,
//         api_service_id,
//         original_price,
//         min, 
//         max, 
//         name,
//         price, 
//         status, 
//         desc
//     } = req.body

//     try {
//         if (name === "") throw new Error("name is required")

//         const addServiceDto = AddServiceDto.builder()
//             .setAddType(add_type)
//             .setApiProviderId(api_provider_id)
//             .setApiServiceId(api_service_id[1])
//             .setCategory(category)
//             .setDesc(desc)
//             .setMax(max)
//             .setMin(min)
//             .setName(name)
//             .setOriginalPrice(original_price)
//             .setPrice(price)
//             .setStatus(status)
//             .build()

//         await serviceService.saveService(addServiceDto)

//         res.send(JSON.stringify({message: "저장 성공하였습니다.", status: "success"}))
//     } catch(e) {
//         if (!["name is required"].includes(e.toString().split("Error: ")[1]))
//             console.error(e)
            
//         res.send(JSON.stringify({message: "저장 실패하였습니다.", status: "error"}))
//     }
// })

// app.post('/add-order/get_service/:serviceId', async (req, res) => {
//     try {
//         const detail = await serviceService.serviceDetail(req.params.serviceId || 0)

//         res.render("assets/ejs/getServiceInfo", detail)

//     } catch(e) {
//         console.error(e)
//         res.send()
//     }
// })

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