const express = require('express');
const { getBootcamps, createBootcamps, updateBootcamps, deleteBootcamps, getSingleBootcamps } = require('../controller/bootcamps');
const router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamps);
router.route('/:id').get(getSingleBootcamps).put(updateBootcamps).delete(deleteBootcamps)


module.exports = router