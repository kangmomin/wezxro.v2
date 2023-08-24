const status = require('../../../global/entity/status')
const categoryRepository = require('../entity/category')

const ex = module.exports = {}

ex.findAllCategory = async () => {
    const category = await categoryRepository.findAll()
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
    const conn = await new DB().getConn()
    
    const result = await categoryRepository.findById(conn, categoryId)

    conn.release()
    return result
}