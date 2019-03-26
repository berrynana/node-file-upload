var express = require('express');
var formidable = require('formidable');
var path = require('path');
var cors = require('cors');
var wrap = require('express-async-wrap');

var router = express.Router();
router.use(cors());
router.use(express.static('static/uploads'));

router.post('/', wrap(async function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on('fileBegin', function (name, file) {
        var extention = path.extname(file.name).toLowerCase();
        file.uploadedFile = {
            name: `${Date.now()}_${path.basename(file.name, extention)}`,
            ext: extention
        };
        file.path = path.join(process.cwd(), '/static/uploads/')
            + file.uploadedFile.name
            + file.uploadedFile.ext;
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        //console.log(`${bytesReceived} / ${bytesExpected}`)
    });

    form.on('file', function (name, file) {
        console.log( req);
        res.send({
            name: file.uploadedFile.name,
            extention: file.uploadedFile.ext,
            path: `${req.protocol}:\\\\${req.headers.host}${req.originalUrl}/${file.uploadedFile.name}${file.uploadedFile.ext}`
            //path: 'http://localhost:3000/upload/' + file.uploadedFile.name + file.uploadedFile.ext
        })
    });

    form.on('end', function () {
        console.log('All Uploaded!');
    });

    form.on('error', function (err) {
        console.log("=========== error ============");
        console.error(err);
    });
}));

module.exports = router;


/*var express = require('express');
var multer = require('multer');
var path = require('path');
var cors = require('cors');
var wrap = require('express-async-wrap');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/static/uploads'));
    },

    filename: function (req, file, cb) {
        var extention = path.extname(file.name).toLowerCase();
        file.uploadedFile = {
            name: `${Date.now()}_${path.basename(file.name, extention)}`,
            ext: extention
        };
        cb(null, file.uploadedFile.name + file.uploadedFile.ext);
    }
});
var uploader = multer({ storage: storage });
var router = express.Router();

router.use(cors());
router.use(express.static('static/uploads'));

router.post('/', uploader.single('file'), wrap(async function (req, res, next) {
    res.send({
        name: req.file.uploadedFile.name,
        extention: req.file.uploadedFile.ext,
        path: 'http://localhost:3000/upload/' + req.file.uploadedFile.name + req.file.uploadedFile.ext
    });
}));

module.exports = router;*/