// Run with: npm run seed:admin
// Creates (or updates the password of) the admin account defined in .env
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { connectDB } from '../config/db.js'
import Admin from '../models/Admin.js'
import mongoose from 'mongoose'

async function run() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running this script.')
    process.exit(1)
  }

  await connectDB()

  const passwordHash = await bcrypt.hash(password, 10)
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash, name: 'Church Admin' },
    { upsert: true, new: true }
  )

  console.log(`Admin account ready: ${admin.email}`)
  await mongoose.connection.close()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
