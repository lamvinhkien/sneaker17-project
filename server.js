const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();

app.listen(3000);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

loadConfigFile();

function loadConfigFile(){
    var objJSON;
    fs.readFile(file = "./config.json", "utf-8", (err, data)=>{
        if (err) throw err;
        objJSON = JSON.parse(data);
        mongoose.connect(objJSON.dbString)
        .then(()=>{
            console.log("Mongodb connect successfully!");
            require("./controller/admin/adminController")(app, router, objJSON);
            require("./controller/admin/uploadImage")(app, router, objJSON);
            require("./controller/admin/orderController")(app, router, objJSON);
            require("./controller/admin/customerController")(app, router, objJSON);
            require("./controller/client/indexController")(app, router, objJSON);
            require("./controller/client/detailController")(app, router, objJSON);
            require("./controller/client/cartController")(app, router, objJSON);
            require("./controller/client/orderController")(app, router, objJSON);
        })
        .catch((err)=>{
            console.log("Mongodb connect failed!");
            console.log(err);
        })
    })
}

// app.use((req, res, next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
//     res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.setHeader("X-Powered-By",' 3.2.1');
//     res.setHeader("Content-Type", "application/json;charset=utf-8")
//     next();
// })