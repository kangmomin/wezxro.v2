const status = require('../../../global/entity/status')
const categoryRepository = require('../entity/category')

const ex = module.exports = {}

ex.findAllCategory = async () => {
    const category = await categoryRepository.findAll({
        where: {
            status: status.active
        }
    })
    
    return category
}