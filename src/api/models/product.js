const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The field name is required']
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    stock: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

productSchema.methods.toJSON = function() {
    const { __v, _id, user, category, ...product } = this.toObject();
    product.category = category.name;
    product.user = user.name;
    
    return product;
}

// Export User model
module.exports = model('Product', productSchema);



