const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
    Name: String,
    PhoneNumber: String,
    Email: String,
    Address: String,
    City: String,
    District: String,
    Ward: String,
    ShipMethod: String,
    PaymentMethod: String,
    Products: Array,
    TotalOrder: Number,
    OrderDate: String,
    OrderStatus: String
})
module.exports = mongoose.model("Order", orderSchema);