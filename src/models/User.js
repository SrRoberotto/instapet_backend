const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        minlength: [2, 'User ID can\'t be smaller than 2 characters'],
        unique: [true, 'User ID found in the database'],
        //match: /[a-zA-Z0-9_-]/,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name can\'t be smaller than 2 characters'],
        maxlength: [64, 'Name can\'t be greater than 64 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Email is required'],
        match: /.+\@.+\..+/,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userImage: String,
}, {
    timestamps: true,
});

/**
 * Validar o email único
 */
// UserSchema.path('email').validate(async (email) => {
// const emailCount = await mongoose.models.User.countDocuments({ email })
// return !emailCount
// }, 'Email already exists');

 /**
 * Validar o UserID único
 */
UserSchema.path('userID').validate(async (userID)=>{
    try {
        const userIDCount = await mongoose.models.User.countDocuments({ userID })
        return !userIDCount
    } catch(error) {
        console.log(error.message); 
        return undefined;
    }
}, 'User ID already exists');
  
/**
 * Criptografar senha - futuro
 */
//   userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) next()
//     this.password = await bcrypt.hash(this.password, 10)
//     return next()
//   })
//   
//   userSchema.methods.checkPassword = async function (password) {
//     const result = await bcrypt.compare(password, this.password)
//     return result
//   }


module.exports = mongoose.model('User', UserSchema);


