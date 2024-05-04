const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    Account: String,
    Password: String,
    WrongPasswordTime: Number,
    ExpirationLock: Number
})
module.exports = mongoose.model("User", userSchema);



