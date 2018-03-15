const express = require('express')
const router = express.Router()
const ecache = require('../utilities/ensureProcessingCache.js')

router.get(
  '/:pdb/:energyCutoffSet/:index/',
  async function (req, res) {
    try {
      let checkedFiles = await ecache.checkFiles(req)
      if (checkedFiles) {
        let dataServer = ecache.retrieveCache(req, res)
        res.setHeader('content-type', 'text/javascript')
        res.write(await dataServer)
        res.end()
      }
    } catch (err) {
      res.status(404).send(err)
    }
  })

module.exports = router
