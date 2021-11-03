const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps/
// @access      Publice    
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({ success: true, data: bootcamps, count: bootcamps.length })
})

// @desc        Get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      private    
exports.getSingleBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: bootcamp })
    } catch (error) {
        // res.status(400).json({ success: false })
        // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        next(error)
    }

}

// @desc        Create all bootcamps
// @route       UPDATE /api/v1/bootcamps/
// @access      Private
exports.createBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({ success: true, data: bootcamp })
    } catch (error) {
        // res.status(400).json({ success: false })
        next(error)
    }
}

// @desc        update all bootcamps
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!bootcamp) {
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: bootcamp })
    } catch (error) {
        // res.status(400).json({ success: false })
        next(error)
    }
}

// @desc        delete all bootcamps
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
        if (!bootcamp) {
            // return res.status(400).json({ success: false })
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: {} })
    } catch (error) {
        // res.status(400).json({ success: false })
        next(error);
    }
}