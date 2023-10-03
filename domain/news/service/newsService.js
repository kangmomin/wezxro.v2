const status = require("../../../global/entity/status")
const NotEngoughArgsException = require("../../../global/error/exception/NotEnoughArgsException")
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
    
    if (addNewsDto.id) await News.update(addNewsDto, {
        where: {
            newsId: addNewsDto.id
        }
    }) 
    else await News.create(addNewsDto)
}

ex.detail = async (newsId = null) => {
    if (!newsId) throw new NotEngoughArgsException()
    
    const news = await News.findByPk(newsId)
    news.created = formatDateTime(news.start)
    news.updated = formatDateTime(news.end)
    
    return news
}

ex.delete = async (newsId = null) => {
    if (!newsId) throw new NotEngoughArgsException()
    
    await News.destroy({
        where: { newsId }
    })
}