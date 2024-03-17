import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isGithub: {
    type: Boolean,
    default: false,
  },
  isGoogle: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["ADMIN", "USUARIO", "PREMIUM"],
    default: "USUARIO",
  },
  cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts"
  },
  resetToken: {
    type: String,
    required: false,
  },
  ExpireresetToken_datetime: {
    type: Date,
    required: false,
  },
  documents: [
    {
      name:{
        type: String,
      },
      reference: {
        type: String,
      }
    }
  ],
  last_connection: {
    type: Date,
    required: false,
  }
});

export const UsersModel = mongoose.model('Users', usersSchema)