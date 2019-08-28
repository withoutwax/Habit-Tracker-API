const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database's data structure
const DataSchema = new Schema(
    {
        type: String,
        date: Date
    },
    { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);