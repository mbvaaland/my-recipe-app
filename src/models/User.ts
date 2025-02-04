// src/models/User.ts
import mongoose, { Schema, Model } from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser {
  name: string
  email: string
  password: string
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
})

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
UserSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password)
}

// Prevent recompiling model on hot reload
let User: Model<IUser>
try {
  User = mongoose.model<IUser>('User')
} catch {
  User = mongoose.model<IUser>('User', UserSchema)
}

export default User