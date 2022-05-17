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

categorySchema.methods.toJSON = function() {
    const { __v, _id, status, user, ...category } = this.toObject();
    category.id = _id;
    category.user = user.name;
    return category;
}

module.exports = model( 'Category', categorySchema );