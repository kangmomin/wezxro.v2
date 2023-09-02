const { Op } = require('sequelize')
const status = require('../../../global/entity/status')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const categoryRepository = require('../entity/category')

const ex = module.exports = {}

ex.findAllCategory = async () => {
    const category = await categoryRepository.findAll({ 
        where: {
            status: {
                [Op.notLike]: status.deleted
            }
        },
        order: [["sort", "ASC"]] 
    })
    // active 상태인 카테고리의 수량
    let activeCnt = 0
    category.forEach(e => e.status == status.active ? activeCnt++ : null)
    
    return [category, activeCnt]
}


/**
 * 카테고리 수정 페이지 리턴 
 * @param {Number} categoryId
 */
ex.editCategory = async (categoryId) => {
    
    const result = await categoryRepository.findById(conn, categoryId)

    return result
}

/**
 * 카테고리를 저장하거나 Id가 body에 같이 들어오면 업데이트 해줌
 */
ex.addCategory = async ({ id, name, sort, status }) => {
    // id 값도 body에 같이 들어오면 update
    // 프론트가 이래 돼있었음,.,,
    if (id != null && id !== '') {
        categoryRepository.update({ name, sort, status })
    } else {
        id = categoryRepository.create({
            name, 
            sort, 
            status
        })
    }
}

ex.deleteCategory = async (categoryId) => {
    if (!categoryId) throw new NotEngoughArgsException()
    
    await categoryRepository.update({ 
        status: status.deleted
    }, {
        where: { categoryId }
    })
}