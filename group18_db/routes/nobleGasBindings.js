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

function addQueryToSearchOptions (searchOptions, query) {
  const Op = models.sequelize.Op
  let queries = []
  let values = query.split(/\s/)
  searchOptions.order = []

  values.forEach((splitValue) => {
    let atomCheck = splitValue.match(/^(\d+)(:(\d+))?$/)
    let energyCheck = splitValue.match(/^(-\d+(\.\d+)?)(:(-\d+(\.\d+)?))?$/)
    if (atomCheck) {
      let atomQuery = {}
      atomQuery[Op.gte] = parseInt(atomCheck[1])
      if (atomCheck[3]) {
        atomQuery[Op.lte] = parseInt(atomCheck[3])
      }
      queries.push({ 'n_atoms': atomQuery })
      searchOptions.order.push(models.sequelize.literal(`case when n_atoms>=${atomCheck[1]} and n_atoms <=${atomCheck[3]} then 1 else null end DESC`))
    }
    if (energyCheck) {
      let energyQuery = {}
      energyQuery[Op.lte] = parseFloat(energyCheck[1])
      if (energyCheck[4]) {
        energyQuery[Op.gte] = parseFloat(energyCheck[4])
      }
      queries.push({ 'binding_energy': energyQuery })
      searchOptions.order.push(models.sequelize.literal(`case when binding_energy<=${energyCheck[1]} and binding_energy >=${energyCheck[4]} then 1 else null end DESC`))
    }
    if (!atomCheck && !energyCheck) {
      let textQueries = []
      textQueries.push({ 'pdb': { [Op.like]: '%' + splitValue + '%' } })
      textQueries.push({ 'protein_type': { [Op.like]: '%' + splitValue + '%' } })
      textQueries.push({ 'protein_description': { [Op.like]: '%' + splitValue + '%' } })
      queries.push({[Op.or]: textQueries})
      searchOptions.order.push(models.sequelize.literal(`case when pdb like '${'%' + splitValue + '%'}' then 3 when protein_type like '${'%' + splitValue + '%'}' then 2 when protein_description like '${'%' + splitValue + '%'}' then 1 else null end DESC`))
    }
  })
  searchOptions.where[Op.and] = queries
}

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
      case 'query':
        addQueryToSearchOptions(searchOptions, value)
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
