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

        val.created = formatDateTime(val.start)
        val.updated = formatDateTime(val.end)

        return val
    })

    return {
        news,
        ...statusCnt
    }
}

/**
 * 
 * @param {AddNewsDto} addNewsDto 
 */
ex.addNews = async (addNewsDto) => {
    const start = addNewsDto.start.split("/")
    const end = addNewsDto.end.split("/")
    addNewsDto.start = new Date(start[2], start[1], start[0])
    addNewsDto.end = new Date(end[2], end[1], end[0])
    
    const news = await News.create(addNewsDto)

    return news
}