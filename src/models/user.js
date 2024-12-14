const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    lowercase: true, // Converts email to lowercase
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  profilePicture: {
    type: String, // URL or file path
  },
  location: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  walkingPreferences: {
    pace: {
      type: String, // leisurely, brisk, etc.
    },
    duration: {
      type: Number, // Duration in minutes
    },
    time: {
      type: String, // Preferred time of day
    },
  },
  dogInfo: {
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    temperament: {
      type: String,
    },
    trainingLevel: {
      type: String,
    },
    healthInfo: {
      type: String,
    },
    profilePicture: {
      type: String, // URL or file path for the dog's picture
    },
  },
});

// Hash the password before saving the user to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
