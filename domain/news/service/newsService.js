const status = require("../../../global/entity/status")
const formatDateTime = require("../../../global/util/formatDateTime")
const News = require("../entity/news")

const ex = module.exports = {}

ex.getNews = async () => {
    const news = await News.findAll()
    
    const stautsCnt = {
        activeCnt: 0,
        deactiveCnt: 0
    }
    
    news.map(val => {
        val.stauts == status.active ? stautsCnt.activeCnt++ : stautsCnt.deactiveCnt++

        val.createdAt = formatDateTime(val.createdAt)
        val.updatedAt = formatDateTime(val.updatedAt)

        return val
    })

    return {
        news,
        ...stautsCnt
    }
}