const multer = require("multer");
const Token = require("../../models/Token.js")
const checkLogin = (req, res, next) => {
    if (req.cookies.TOKEN == undefined || req.cookies.TOKEN == "") {
        res.redirect("/admin");
    } else {
        var token = req.cookies.TOKEN;
        Token.findOne({ Token: token, Status: true })
            .then((data) => {
                if (data.Token == token) {
                    next()
                } else {
                    res.redirect("/admin");
                }
            })
            .catch((err) => {
                res.redirect("/admin");
            })
    }
}
module.exports = function (app, router, objJSON) {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname + "-" + Date.now())
        }
    });

    const avatar = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("Avatar");

    router.post("/avatar", checkLogin, (req, res) => {
        avatar(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar1 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar1");

    router.post("/detail-avatar-1", checkLogin, (req, res) => {
        detailAvatar1(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar2 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar2");

    router.post("/detail-avatar-2", checkLogin, (req, res) => {
        detailAvatar2(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar3 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar3");

    router.post("/detail-avatar-3", checkLogin, (req, res) => {
        detailAvatar3(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar4 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar4");

    router.post("/detail-avatar-4", checkLogin, (req, res) => {
        detailAvatar4(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar5 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar5");

    router.post("/detail-avatar-5", checkLogin, (req, res) => {
        detailAvatar5(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar6 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar6");

    router.post("/detail-avatar-6", checkLogin, (req, res) => {
        detailAvatar6(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar7 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar7");

    router.post("/detail-avatar-7", checkLogin, (req, res) => {
        detailAvatar7(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    const detailAvatar8 = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/avif") {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("detailAvatar8");

    router.post("/detail-avatar-8", checkLogin, (req, res) => {
        detailAvatar8(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
            } else {
                res.json({ result: 1, message: "Upload okay", fileName: req.file.filename });
            }
        });
    })

    return app.use("/", router);
}