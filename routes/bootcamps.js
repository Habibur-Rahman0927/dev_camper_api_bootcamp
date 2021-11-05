const express = require('express');
const router = express.Router();
const {
    getBootcamps,
    createBootcamps,
    updateBootcamps,
    deleteBootcamps,
    getSingleBootcamps,
    getBootcampsInRadius,
    bootcampPhotoUplaod
} = require('../controller/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middleware/advanceResult')
const courseRouter = require('./courses');
const { protect } = require('../middleware/auth');

// Re- route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

/* route is not working
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius); */
router.route('/:id/photo').put(protect, bootcampPhotoUplaod);

router.route('/').get(advanceResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamps);
router.route('/:id').get(getSingleBootcamps).put(protect, updateBootcamps).delete(protect, deleteBootcamps);


module.exports = router