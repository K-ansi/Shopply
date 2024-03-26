const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

userSchema.methods.comparePassword = async function(plainTextPassword) {
  try {
    return await bcrypt.compare(plainTextPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Update the password with the hashed value
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('users', userSchema);

module.exports = User;