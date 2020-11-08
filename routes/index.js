const router = require('express').Router();

const { userRouter } = require('./users');
const { articleRouter } = require('./articles');

router.use(userRouter);
router.use(articleRouter);

module.exports = router;
