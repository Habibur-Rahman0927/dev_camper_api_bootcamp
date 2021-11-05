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
const { protect } = require('../middleware/auth');

router.route('/').get(advanceResults(Course, {
    path: 'bootcamp', select: 'name description'
}), getCourses).post(protect, addCourse)
router.route('/:id').get(getSingleCourses).put(protect, UpdateCourse).delete(protect, deleteCourse);

module.exports = router