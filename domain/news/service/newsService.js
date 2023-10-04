const { Op } = require("sequelize")
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
    const expiredNews = []
    
    news.map(val => {
        val.status == newsStatus.active ? statusCnt.activeCnt++ : statusCnt.deactiveCnt++

        val.created = formatDate(formatDateTime(val.start))
        val.updated = formatDate(formatDateTime(val.end))

        if (new Date() < val.end) {
            expiredNews.push(val.newsId)
            return
        }

        return val
    })

    News.update({
        status: newsStatus.expire
    }, {
        where: { newsId: expiredNews }
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
        where: { newsId: addNewsDto.id }
    }) 
    else await News.create(addNewsDto)
}

ex.detail = async (newsId = null) => {
    if (!newsId) throw new NotEngoughArgsException()
    
    const news = await News.findByPk(newsId)
    news.created = formatDate(formatDateTime(news.start))
    news.updated = formatDate(formatDateTime(news.end))

    
    return news
}

ex.delete = async (newsId = null) => {
    if (!newsId) throw new NotEngoughArgsException()
    
    await News.destroy({
        where: { newsId }
    })
}

ex.newses = async () => {
    const news = await News.findAll({
        where: {
            status: newsStatus.active,
            start: {
                [Op.lte]: new Date()
            }
        }
    })
    
    news.map(val => {
        val.created = formatDateTime(val.start)
        val.updated = formatDateTime(val.end)
        
        return val
    })
    
    return news
}

/**
 * 
 * @returns {boolean} is there unread notice, return true. otherwise return false
*/
ex.checkUnread = async () => {
    const news = await News.count({
        where: {
            status: newsStatus.active
        },
    })
    
    return news > 0
}

function formatDate(date) {
    const dateParts = date.split("-");
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}