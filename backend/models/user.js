import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Please enter id."]
        },
        firstname: {
            type: String,
            required: [true, "Please enter your firstname."]
        },
        lastname: {
            type: String,
            required: [true, "Please enter your lastname."]
        },
        email: {
            type: String,
            required: [true, "Please enter your email address."]
        },
        invisible: {
            type: String,
            required: [true, "Please enter your password."]
        },
        role: {
            type: String,
            required: [true, "Please enter your Role"]
        },
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(next) {
    if (!this.isModified('invisible')) {
        next();
    }

    const salt = await bcrypt.genSalt(12)
    this.invisible = await bcrypt.hash(this.invisible, salt)
})

userSchema.methods.matchInvisible = async function (enteredInvisible) {
    return await bcrypt.compare(enteredInvisible, this.invisible)
}

userSchema.methods.createResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 600000

    return await [resetToken,this.passwordResetToken,this.passwordResetTokenExpires];
}

userSchema.methods.createPassword = async function (invisible) {
    const salt = await bcrypt.genSalt(12)
    this.invisible = await bcrypt.hash(invisible, salt)
    return await this.invisible
}

const User = mongoose.models.route || mongoose.model('user', userSchema);

export default User