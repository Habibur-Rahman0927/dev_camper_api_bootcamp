const express = require('express');
const {
    getCourses,
    getSingleCourses,
    addCourse,
    UpdateCourse,
    deleteCourse
} = require('../controller/courses');
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getSingleCourses).put(UpdateCourse).delete(deleteCourse);

module.exports = router