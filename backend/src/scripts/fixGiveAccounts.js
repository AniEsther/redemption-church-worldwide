// Run with: npm run fix:give-accounts
// Unlike seed:content (which only fills in blank settings), this OVERWRITES
// bankAccounts specifically with exactly the four canonical accounts —
// useful if extra/duplicate accounts were added by hand via the admin panel.
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import SiteSettings from '../models/SiteSettings.js'

const BANK_ACCOUNTS = [
  { label: 'Tithe', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide', accountNumber: '0123456789' },
  { label: 'Project', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide - Project', accountNumber: '0000000000' },
  { label: 'Mission', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide - Mission', accountNumber: '0000000000' },
  { label: 'Alms (Helping the Poor)', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide - Alms', accountNumber: '0000000000' },
]

async function run() {
  await connectDB()
  const settings = await SiteSettings.getSingleton()
  const before = settings.bankAccounts.length
  settings.bankAccounts = BANK_ACCOUNTS
  await settings.save()
  console.log(`Bank accounts reset: had ${before}, now has ${settings.bankAccounts.length}.`)
  console.log('Edit the real account numbers in /admin/settings whenever you\'re ready.')
  await mongoose.connection.close()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
