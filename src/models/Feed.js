const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
    publiID: Number,
    userID: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Feed', FeedSchema);
