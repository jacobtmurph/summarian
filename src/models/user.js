// Load modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true
    },
    profileName: {
        firstName: String,
        lastName: String,
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

//Authenticate User Method
UserSchema.statics.authenticate = function(email, pass, callback) {
    User.findOne({emailAddress: email})
        .exec((error, user) => {
                if (error) {
                    return callback(error);
                } else if (!user) {
                    const err = new Error("User not found");
                    err.status = 401;
                    return callback(err);
                }
                //Compare given password with the stored password
                bcrypt.compare(pass, user.password, function(error, result) {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback();
                    }
                });
        });
};

//Hash user password before saving
UserSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;