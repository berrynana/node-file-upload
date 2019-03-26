var express = require('express');
var formidable = require('formidable');
var path = require('path');
var cors = require('cors');
var wrap = require('express-async-wrap');

var router = express.Router();
router.use(cors());
router.use(express.static('static/uploads'));

router.post('/', wrap(async function (req, res) {
    var form = new formidable.IncomingForm(),
        fileInfo = [],
        fields = [];
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

    form.on('field', function(field, value) {
        fields.push([field, value]);
    });

    form.on('file', function (field, file) {
        //console.log( req);
        fileInfo.push({
            name: file.uploadedFile.name,
            extention: file.uploadedFile.ext,
            path: `${req.protocol}:\\\\${req.headers.host}${req.originalUrl}/${file.uploadedFile.name}${file.uploadedFile.ext}`
            //path: 'http://localhost:3000/upload/' + file.uploadedFile.name + file.uploadedFile.ext
        })
    });

    form.on('end', function () {
        console.log('All Uploaded!');
        res.send(fileInfo);
    });

    form.on('error', function (err) {
        console.log("=========== error ============");
        console.error(err);
    });
}));

module.exports = router;