const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'The field name is required.'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = model( 'Category', categorySchema );