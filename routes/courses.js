const express = require('express');
const {
    getCourses,
    getSingleCourses,
    addCourse,
    UpdateCourse,
    deleteCourse
} = require('../controller/courses');
const router = express.Router({ mergeParams: true });
const advanceResults = require('../middleware/advanceResult');
const Course = require('../models/Course');

router.route('/').get(advanceResults(Course, {
    path: 'bootcamp', select: 'name description'
}), getCourses).post(addCourse)
router.route('/:id').get(getSingleCourses).put(UpdateCourse).delete(deleteCourse);

module.exports = router