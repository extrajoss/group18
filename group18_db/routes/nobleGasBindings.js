const express = require('express')
const router = express.Router()
const models = require('../models')

const DEFAULT_LIMIT = 100
const DEFAULT_OFFSET = 0

/* GET users listing. */
router.get('/all', async (req, res, next) => {
  const allNobleGasBindings = await models.noble_gas_bindings.findAll()
  res.json(allNobleGasBindings)
})

router.get('/search', async (req, res, next) => {
  const Op = models.sequelize.Op
  let searchOptions = {}
  let field = ''
  let operator = Op.and
  searchOptions.where = {}
  searchOptions.limit = req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT
  searchOptions.offset = req.query.offset ? parseInt(req.query.offset) : DEFAULT_OFFSET
  Object.entries(req.query).forEach(([key, value]) => {
    switch (key) {
      case 'ligand':
      case 'element':
        searchOptions.where[key] = value
        break
      case 'pdb':
      case 'protein_type':
      case 'protein_description':
      case 'ligand_name':
      case 'category':
        searchOptions.where[key] = { [Op.like]: '%' + value + '%' }
        break
      case 'min_binding_energy':
      case 'min_n_atoms':
      case 'max_binding_energy':
      case 'max_n_atoms':
        field = key.replace('min_', '').replace('max_', '')
        operator = key.match('min_') ? Op.gte : Op.lte
        if (searchOptions.where[field]) {
          searchOptions.where[field][Op.and][operator] = value
        } else {
          searchOptions.where[field] = {[Op.and]: { [operator]: value }}
        }
        break
      case 'has_ligand':
        field = key.replace('has_', '')
        searchOptions.where[field] = {[Op.ne]: null}
        break
      case 'sort':
        searchOptions.order = [ value.split(' ') ]
        break
    }
  })
  let results = {}
  try {
    const allNobleGasBindings = await models.noble_gas_bindings.findAndCountAll(searchOptions)
    results = allNobleGasBindings
  } catch (err) {
    results = {'error': err}
  }
  res.json(results)
})

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  const nobleGasBinding = await models.noble_gas_bindings.findOne({where: {id: id}})
  res.json(nobleGasBinding)
})

module.exports = router
