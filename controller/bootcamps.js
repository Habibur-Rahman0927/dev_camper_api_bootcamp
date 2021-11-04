const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps/
// @access      Publice    
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    // copy req.query
    const reqQuery = { ...req.query };

    // Field to exlude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete  them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // console.log(reqQuery)

    // create query string
    let queryStr = JSON.stringify(req.query);

    // create oprators 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // console.log(queryStr);

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
        console.log(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments();
    query = query.skip(startIndex).limit(limit);
    // const bootcamps = await Bootcamp.find({});
    // executing query
    const bootcamps = await query;

    // pagination reuslt 
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps, })
})

// @desc        Get single bootcamps
// @route       GET /api/v1/bootcamps/:id
// @access      private    
exports.getSingleBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        // return res.status(400).json({ success: false })
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

// @desc        Create all bootcamps
// @route       UPDATE /api/v1/bootcamps/
// @access      Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({ success: true, data: bootcamp })

})

// @desc        update all bootcamps
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!bootcamp) {
        // return res.status(400).json({ success: false })
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

// @desc        delete all bootcamps
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        // return res.status(400).json({ success: false })
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    bootcamp.remove();
    res.status(200).json({ success: true, data: {} })

})

// this code not working
/*
// @desc        Get bootcamps within a radius
// @route       DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipCode, distance } = req.params;

    // Get lat/lan from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    });
    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamps
    });

}) */



// @desc        Uplaod all bootcampPhotoUplaod
// @route       DELETE /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUplaod = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        // return res.status(400).json({ success: false })
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload file`, 404))
    }
    const file = req.files[''];
    // make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404));
    }
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 404));
    }
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file uplaod`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            success: true,
            data: file.name,
        })
    })
    // console.log(file.name);
})
