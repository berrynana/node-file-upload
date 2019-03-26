var express = require('express');
var multer = require('multer');
var path = require('path');
var cors = require('cors');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/static/uploads'));
    },

    filename: function (req, file, cb) {
        file.uploadedFile = {
            name: `${Date.now()}_${file.fieldname}`,
            ext: path.extname(file.originalname).toLowerCase()
        };
        cb(null, file.uploadedFile.name + file.uploadedFile.ext);
    }
});
var uploader = multer({ storage: storage });
var router = express.Router();

router.use(cors());
router.use(express.static('static/uploads'));

router.post('/', uploader.single('file'), function (req, res, next) {
    res.send({
        name: req.file.uploadedFile.name,
        extention: req.file.uploadedFile.ext,
        path: 'http://localhost:3000/upload/' + req.file.uploadedFile.name + req.file.uploadedFile.ext
    });
});

module.exports = router;