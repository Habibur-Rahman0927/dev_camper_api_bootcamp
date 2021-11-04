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
const courseRouter = require('./courses');

// Re- route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

/* route is not working
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius); */
router.route('/:id/photo').put(bootcampPhotoUplaod);

router.route('/').get(getBootcamps).post(createBootcamps);
router.route('/:id').get(getSingleBootcamps).put(updateBootcamps).delete(deleteBootcamps)


module.exports = router