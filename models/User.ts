import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  emailVerified: { type: Date, default: null },
  password: {
    type: String,
    select: false, // Automatically exclude password from query results
  },
});

const User = models.User || model('User', userSchema);

export default User;
