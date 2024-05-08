const User = require("../../models/User.js");
const Product = require("../../models/Product.js");
const Token = require("../../models/Token.js");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const formatMoney = (num) => {
    var p = num.toFixed(0).split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (num != "-" && !(i % 3) ? "," : "") + acc;
    });
}
const handleLoadSizeForAdmin = (size35, size36, size37, size38, size39, size40, size41, size42, size43, size44, size45, size46) => {
    let sizeTemp0 = size35 + ", ";
    if (size35 === null) {
        sizeTemp0 = ""
    }

    let sizeTemp1 = size36 + ", ";
    if (size36 === null) {
        sizeTemp1 = ""
    }

    let sizeTemp2 = size37 + ", ";
    if (size37 === null) {
        sizeTemp2 = ""
    }

    let sizeTemp3 = size38 + ", ";
    if (size38 === null) {
        sizeTemp3 = ""
    }

    let sizeTemp4 = size39 + ", ";
    if (size39 === null) {
        sizeTemp4 = ""
    }

    let sizeTemp5 = size40 + ", ";
    if (size40 === null) {
        sizeTemp5 = ""
    }

    let sizeTemp6 = size41 + ", ";
    if (size41 === null) {
        sizeTemp6 = ""
    }

    let sizeTemp7 = size42 + ", ";
    if (size42 === null) {
        sizeTemp7 = ""
    }

    let sizeTemp8 = size43 + ", ";
    if (size43 === null) {
        sizeTemp8 = ""
    }

    let sizeTemp9 = size44 + ", ";
    if (size44 === null) {
        sizeTemp9 = ""
    }

    let sizeTemp10 = size45 + ", ";
    if (size45 === null) {
        sizeTemp10 = ""
    }

    let sizeTemp11 = size46 + ", ";
    if (size46 === null) {
        sizeTemp11 = ""
    }

    let sizes = sizeTemp0 + sizeTemp1 + sizeTemp2 + sizeTemp3 + sizeTemp4 + sizeTemp5 + sizeTemp6 + sizeTemp7 + sizeTemp8 + sizeTemp9 + sizeTemp10 + sizeTemp11
    return sizes.slice(0, -2);
}

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

    router.get("/admin", (req, res) => {
        if (req.cookies.TOKEN == undefined || req.cookies.TOKEN == "") {
            res.render("admin/login");
        } else {
            var token = req.cookies.TOKEN;
            Token.findOne({ Token: token, Status: true })
                .then((data) => {
                    if (data.Token == token) {
                        res.redirect("/admin/home")
                    } else {
                        res.render("admin/login");
                    }
                })
                .catch((err) => {
                    res.render("admin/login");
                })
        }
    })

    router.post("/admin/login", (req, res) => {
        if (!req.body.Account || !req.body.Password) {
            res.json({ result: 0, message: "Vui lòng nhập tài khoản và mật khẩu" });
        } else {
            var account = req.body.Account;
            var password = req.body.Password;

            User.findOne({ Account: account })
                .then((data) => {
                    let now = Date.now()
                    let wrong = data.WrongPasswordTime
                    let timeLock = data.ExpirationLock
                    let account = { Account: data.Account }

                    if (timeLock > now) {
                        res.json({ result: 0, message: `Tài khoản đã bị khoá trong 10 giây` });
                    } else if (wrong >= 4) {
                        User.updateOne(account, { WrongPasswordTime: 0, ExpirationLock: now + 10000 })
                            .then(() => {
                                res.json({ result: 0, message: `Sai mật khẩu nhiều lần, tài khoản đã bị khoá trong 10 giây` });
                            })
                    } else {
                        if (password != data.Password) {
                            User.updateOne(account, { WrongPasswordTime: wrong + 1 })
                                .then(() => {
                                    res.json({ result: 0, message: "Sai mật khẩu lần " + ++wrong });
                                })
                        } else {
                            User.updateOne(account, { WrongPasswordTime: 0, ExpirationLock: 0 })
                                .then(() => {
                                    jwt.sign({ data: data }, objJSON.privateKey, (err, token) => {
                                        if (err) {
                                            res.json({ result: 0, message: "Create token failed" });
                                        } else {
                                            var newToken = new Token({
                                                Token: token,
                                                Account: data.Account,
                                                LoginDate: moment(Date.now()).format("DD-MM-YYYY / hh:mm:ss A"),
                                                LogoutDate: "",
                                                Status: true
                                            })

                                            newToken.save()
                                                .then((data) => {
                                                    res.json({ result: 1, message: "Đăng nhập thành công", Token: token });
                                                })
                                                .catch((err) => {
                                                    res.json({ result: 0, message: "Save token failed", error: err });
                                                })
                                        }
                                    })
                                })
                        }
                    }
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Tài khoản không tồn tại" });
                })
        }
    })

    router.post("/admin/logout", checkLogin, (req, res) => {
        if (!req.body.Token) {
            res.json({ result: 0, message: "Không có Token" });
        } else {
            var token = req.body.Token;
            Token.findOneAndUpdate({ Token: token, Status: true }, { Status: false, LogoutDate: moment(Date.now()).format("DD-MM-YYYY / hh:mm:ss A") })
                .then((data) => {
                    res.json({ result: 1, message: "Đăng xuất thành công", data: data });
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Invalid Token", err: err });
                })
        }
    })

    router.get("/admin/home", checkLogin, (req, res) => {
        Product.find()
            .then((products) => {
                res.render("admin/home", { data: products, formatMoney: formatMoney, Size: handleLoadSizeForAdmin })
            })
            .catch((err) => {
                res.json({ result: 0, message: "Error" });
            })
    })

    router.get("/admin/create", checkLogin, (req, res) => {
        res.render("admin/create")
    })

    router.post("/admin/create-new", checkLogin, (req, res) => {
        if (!req.body.Name || !req.body.Price) {
            res.json({ result: 0, message: "Vui lòng nhập tên và giá sản phẩm" })
        } else {
            var name = req.body.Name;
            var price = parseFloat(req.body.Price);

            var type = "";
            if (req.body.Type) {
                type = req.body.Type;
            }

            var status = "";
            if (req.body.Status) {
                status = req.body.Status;
            }

            var avatar = ""
            if (req.body.Avatar) {
                avatar = req.body.Avatar;
            }

            var detailavatar1 = ""
            if (req.body.detailAvatar1) {
                detailavatar1 = req.body.detailAvatar1;
            }

            var detailavatar2 = ""
            if (req.body.detailAvatar2) {
                detailavatar2 = req.body.detailAvatar2;
            }

            var detailavatar3 = ""
            if (req.body.detailAvatar3) {
                detailavatar3 = req.body.detailAvatar3;
            }

            var detailavatar4 = ""
            if (req.body.detailAvatar4) {
                detailavatar4 = req.body.detailAvatar4;
            }

            var detailavatar5 = ""
            if (req.body.detailAvatar5) {
                detailavatar5 = req.body.detailAvatar5;
            }

            var detailavatar6 = ""
            if (req.body.detailAvatar6) {
                detailavatar6 = req.body.detailAvatar6;
            }

            var detailavatar7 = ""
            if (req.body.detailAvatar7) {
                detailavatar7 = req.body.detailAvatar7;
            }

            var detailavatar8 = ""
            if (req.body.detailAvatar8) {
                detailavatar8 = req.body.detailAvatar8;
            }

            var description = "";
            if (req.body.Description) {
                description = req.body.Description;
            }

            var Size35 = null
            if (req.body.Size35) {
                Size35 = req.body.Size35
            }

            var Size36 = null
            if (req.body.Size36) {
                Size36 = req.body.Size36
            }

            var Size37 = null
            if (req.body.Size37) {
                Size37 = req.body.Size37
            }

            var Size38 = null
            if (req.body.Size38) {
                Size38 = req.body.Size38
            }

            var Size39 = null
            if (req.body.Size39) {
                Size39 = req.body.Size39
            }

            var Size40 = null
            if (req.body.Size40) {
                Size40 = req.body.Size40
            }

            var Size41 = null
            if (req.body.Size41) {
                Size41 = req.body.Size41
            }

            var Size42 = null
            if (req.body.Size42) {
                Size42 = req.body.Size42
            }

            var Size43 = null
            if (req.body.Size43) {
                Size43 = req.body.Size43
            }

            var Size44 = null
            if (req.body.Size44) {
                Size44 = req.body.Size44
            }

            var Size45 = null
            if (req.body.Size45) {
                Size45 = req.body.Size45
            }

            var Size46 = null
            if (req.body.Size46) {
                Size46 = req.body.Size46
            }

            var dateCreate = "";
            if (req.body.DateCreate) {
                dateCreate = moment(req.body.DateCreate).format("YYYY-MM-DD")
            }

            var newProduct = new Product({
                Name: name,
                Price: price,
                Type: type,
                Status: status,
                Avatar: avatar,
                detailAvatar1: detailavatar1,
                detailAvatar2: detailavatar2,
                detailAvatar3: detailavatar3,
                detailAvatar4: detailavatar4,
                detailAvatar5: detailavatar5,
                detailAvatar6: detailavatar6,
                detailAvatar7: detailavatar7,
                detailAvatar8: detailavatar8,
                Description: description,
                Size35: Size35,
                Size36: Size36,
                Size37: Size37,
                Size38: Size38,
                Size39: Size39,
                Size40: Size40,
                Size41: Size41,
                Size42: Size42,
                Size43: Size43,
                Size44: Size44,
                Size45: Size45,
                Size46: Size46,
                DateCreate: dateCreate
            })

            newProduct.save()
                .then((data) => {
                    res.redirect("/admin/home")
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Thêm thất bại", Lỗi: err });
                })
        }
    })

    router.get("/admin/edit/:id", checkLogin, (req, res) => {
        if (!req.params.id) {
            res.json({ result: 0, message: "Không có sản phẩm" });
        } else {
            Product.findById(req.params.id)
                .then((data) => {
                    res.render("admin/edit", {
                        data: data,
                    });
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Trang chi tiết Error" });
                })
        }
    })

    router.post("/admin/update", checkLogin, (req, res) => {
        if (!req.body.Name || !req.body.Price || !req.body._idProduct) {
            res.json({ result: 0, message: "Không tìm thấy sản phẩm" })
        } else {
            var name = req.body.Name;
            var price = parseFloat(req.body.Price);

            var type = "";
            if (req.body.Type) {
                type = req.body.Type;
            }

            var status = "";
            if (req.body.Status) {
                status = req.body.Status;
            }

            var avatar = ""
            if (req.body.Avatar) {
                avatar = req.body.Avatar;
            }

            var detailavatar1 = ""
            if (req.body.detailAvatar1) {
                detailavatar1 = req.body.detailAvatar1;
            }

            var detailavatar2 = ""
            if (req.body.detailAvatar2) {
                detailavatar2 = req.body.detailAvatar2;
            }

            var detailavatar3 = ""
            if (req.body.detailAvatar3) {
                detailavatar3 = req.body.detailAvatar3;
            }

            var detailavatar4 = ""
            if (req.body.detailAvatar4) {
                detailavatar4 = req.body.detailAvatar4;
            }

            var detailavatar5 = ""
            if (req.body.detailAvatar5) {
                detailavatar5 = req.body.detailAvatar5;
            }

            var detailavatar6 = ""
            if (req.body.detailAvatar6) {
                detailavatar6 = req.body.detailAvatar6;
            }

            var detailavatar7 = ""
            if (req.body.detailAvatar7) {
                detailavatar7 = req.body.detailAvatar7;
            }

            var detailavatar8 = ""
            if (req.body.detailAvatar8) {
                detailavatar8 = req.body.detailAvatar8;
            }

            var description = "";
            if (req.body.Description) {
                description = req.body.Description;
            }

            var Size35 = null
            if (req.body.Size35) {
                Size35 = req.body.Size35
            }

            var Size36 = null
            if (req.body.Size36) {
                Size36 = req.body.Size36
            }

            var Size37 = null
            if (req.body.Size37) {
                Size37 = req.body.Size37
            }

            var Size38 = null
            if (req.body.Size38) {
                Size38 = req.body.Size38
            }

            var Size39 = null
            if (req.body.Size39) {
                Size39 = req.body.Size39
            }

            var Size40 = null
            if (req.body.Size40) {
                Size40 = req.body.Size40
            }

            var Size41 = null
            if (req.body.Size41) {
                Size41 = req.body.Size41
            }

            var Size42 = null
            if (req.body.Size42) {
                Size42 = req.body.Size42
            }

            var Size43 = null
            if (req.body.Size43) {
                Size43 = req.body.Size43
            }

            var Size44 = null
            if (req.body.Size44) {
                Size44 = req.body.Size44
            }

            var Size45 = null
            if (req.body.Size45) {
                Size45 = req.body.Size45
            }

            var Size46 = null
            if (req.body.Size46) {
                Size46 = req.body.Size46
            }

            var dateCreate = "";
            if (req.body.DateCreate) {
                dateCreate = moment(req.body.DateCreate).format("YYYY-MM-DD")
            }

            Product.findByIdAndUpdate(req.body._idProduct, {
                Name: name,
                Price: price,
                Type: type,
                Status: status,
                Avatar: avatar,
                detailAvatar1: detailavatar1,
                detailAvatar2: detailavatar2,
                detailAvatar3: detailavatar3,
                detailAvatar4: detailavatar4,
                detailAvatar5: detailavatar5,
                detailAvatar6: detailavatar6,
                detailAvatar7: detailavatar7,
                detailAvatar8: detailavatar8,
                Description: description,
                Size35: Size35,
                Size36: Size36,
                Size37: Size37,
                Size38: Size38,
                Size39: Size39,
                Size40: Size40,
                Size41: Size41,
                Size42: Size42,
                Size43: Size43,
                Size44: Size44,
                Size45: Size45,
                Size46: Size46,
                DateCreate: dateCreate
            })
                .then((data) => {
                    res.redirect("/admin/home")
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Cập nhật thất bại", Lỗi: err });
                })
        }
    })

    router.post("/admin/delete/:id", checkLogin, (req, res) => {
        if (!req.params.id) {
            res.json({ result: 0, message: "Không tìm thấy sản phẩm" })
        } else {
            Product.findByIdAndDelete(req.params.id)
                .then((data) => {
                    res.redirect("/admin/home")
                })
                .catch((err) => {
                    res.json({ result: 0, message: "Xoá thất bại", Lỗi: err });
                })
        }
    })

    return app.use("/", router);
}