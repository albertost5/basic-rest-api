const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required!']
    },
    email: {
        type: String,
        required: [true, 'Mail field is required!'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password field is required!'],
    },
    img: String,
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Export User model
module.exports = model('User', userSchema);



