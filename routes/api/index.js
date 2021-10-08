const router = require('express').Router();

router.use('/users', require('./users'))
router.use('/session', require('./session'))
router.use('/trades', require('./trades'))
router.use('/list', require('./list'))
router.use('/assets', require('./assets'))

module.exports = router;
