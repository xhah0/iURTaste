const mongoose = require('mongoose');

const restaurantReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

const RestaurantReview = mongoose.model('RestaurantReview', restaurantReviewSchema);
module.exports = RestaurantReview;
