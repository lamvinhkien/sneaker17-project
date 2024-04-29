const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    Account: String,
    Password: String,
})
module.exports = mongoose.model("User", userSchema);



