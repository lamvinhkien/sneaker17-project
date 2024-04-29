const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema({
    Token: String,
    LoginDate: String,
    LogoutDate: String,
    Status: Boolean
})
module.exports = mongoose.model("Token", tokenSchema);