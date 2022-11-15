const mongoose = require('mongoose');

const PubliSchema = new mongoose.Schema({
    userID: String,
    description:  {
        type: String,
        maxlength: [100, 'Description can\'t be greater than 100 characters']
    },
    publiImage: String,
    likes: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

/**
 * Validar o usuário
 */
// PubliSchema.path('userID').validate(async (userID) => {
//     const userCount = await mongoose.models.User.countDocuments({ userID });
//     console.log(userCount);
//     return (userCount > 0);
// }, 'Invalid user');

module.exports = mongoose.model('Publi', PubliSchema);
