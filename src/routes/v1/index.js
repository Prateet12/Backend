const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const adminRoute = require('./admin.route');
const fileRoute = require('./fileHandler.route');
const roleRoute = require('./role.route');
const statsRouter = require('./stats.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/admin', adminRoute);
router.use('/file', fileRoute);
router.use('/role', roleRoute);
router.use('/stats', statsRouter);

module.exports = router;