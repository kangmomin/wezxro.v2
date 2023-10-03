const status = require("../../../global/entity/status")
const formatDateTime = require("../../../global/util/formatDateTime")
const newsStatus = require("../entity/constant/newsStatus")
const News = require("../entity/news")

const ex = module.exports = {}

ex.getNews = async () => {
    const news = await News.findAll()
    
    const statusCnt = {
        activeCnt: 0,
        deactiveCnt: 0
    }
    
    news.map(val => {
        val.status == newsStatus.active ? statusCnt.activeCnt++ : statusCnt.deactiveCnt++

        val.createdAt = formatDateTime(val.createdAt)
        val.updatedAt = formatDateTime(val.updatedAt)

        return val
    })

    return {
        news,
        ...statusCnt
    }
}