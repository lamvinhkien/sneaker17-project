const Product = require("../../models/Product");
const PAGE_SIZE = 8;
const handleProducts = (req, res, condition, sortP) => {
    let page = req.query.page;
    if (page) {
        page = parseInt(page);
        if (page < 1) {
            page = 1;
        }
        let skipNumber = (page - 1) * PAGE_SIZE;

        Product.find(condition)
            .skip(skipNumber)
            .limit(PAGE_SIZE)
            .sort(sortP)
            .then((data) => {
                Product.countDocuments(condition)
                    .then((total) => {
                        res.json({ total: total, products: data });
                    })
            })
            .catch((err) => {
                res.json({ result: 0, message: "Error" });
                console.log(err)
            })
    } else {
        Product.find()
            .then((data) => {
                res.json({ result: 1, message: "List Okay", products: data });
            })
            .catch((err) => {
                res.json({ result: 0, message: "Error" });
            })
    }
}

module.exports = (app, router, objJSON) => {
    router.get("/", (req, res) => {
        res.render("client/index")
    })

    router.get("/products/list/all", (req, res) => {
        handleProducts(req, res, {}, {})
    })

    router.get("/products/list/sortDecrease", (req, res) => {
        handleProducts(req, res, {}, { Price: -1 })
    })

    router.get("/products/list/sortAscending", (req, res) => {
        handleProducts(req, res, {}, { Price: 1 })
    })

    router.get("/products/list/lt1m", (req, res) => {
        handleProducts(req, res, { Price: { $lt: 1000000 } }, {})
    })

    router.get("/products/list/1mto1m5", (req, res) => {
        handleProducts(req, res, { $and: [{ Price: { $gte: 1000000 } }, { Price: { $lt: 1500000 } }] }, {})
    })

    router.get("/products/list/1m5to2m", (req, res) => {
        handleProducts(req, res, { $and: [{ Price: { $gte: 1500000 } }, { Price: { $lt: 2000000 } }] }, {})
    })

    router.get("/products/list/2mto2m5", (req, res) => {
        handleProducts(req, res, { $and: [{ Price: { $gte: 2000000 } }, { Price: { $lt: 2500000 } }] }, {})
    })

    router.get("/products/list/2m5to3m", (req, res) => {
        handleProducts(req, res, { $and: [{ Price: { $gte: 2500000 } }, { Price: { $lt: 3000000 } }] }, {})
    })

    router.get("/products/list/gte3m", (req, res) => {
        handleProducts(req, res, { Price: { $gte: 3000000 } }, {})
    })

    router.get("/products/list/giaynam", (req, res) => {
        handleProducts(req, res, { Type: "Giày nam" })
    })

    router.get("/products/list/giaynu", (req, res) => {
        handleProducts(req, res, { Type: "Giày nữ" }, {})
    })

    router.get("/products/list/depnam", (req, res) => {
        handleProducts(req, res, { Type: "Dép nam" }, {})
    })

    router.get("/products/list/depnu", (req, res) => {
        handleProducts(req, res, { Type: "Dép nữ" }, {})
    })

    return app.use("/", router)
}