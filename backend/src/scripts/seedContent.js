// Run with: npm run seed:content
// Populates the database with the sample sermons, events, ministries,
// testimonies, gallery images, pastors, and site settings that the public
// site ships with — so the admin dashboard has real, editable records
// instead of an empty database. Safe to re-run: it only fills in
// collections that are currently empty, and won't create duplicates.
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import Leader from '../models/Leader.js'
import Ministry from '../models/Ministry.js'
import Sermon from '../models/Sermon.js'
import Event from '../models/Event.js'
import Testimony from '../models/Testimony.js'
import GalleryImage from '../models/GalleryImage.js'
import SiteSettings from '../models/SiteSettings.js'
import Branch from '../models/Branch.js'

const LEADERS = [
  {
    name: 'Rev. Dr. Chimaobi Aninwene',
    role: 'Founder & Senior Pastor',
    portraitUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
    bio: 'Rev. Dr. Chimaobi Aninwene is the visionary Founder and Senior Pastor of The Redemption Church Worldwide. Called into ministry to raise holy, Spirit-filled believers, he has shepherded the congregation with sound doctrine, prophetic insight and an unwavering passion for the gospel of Jesus Christ.',
    order: 1,
  },
  {
    name: 'Pastor Mrs. Rose Aninwene',
    role: 'Senior Pastor\u2019s Wife',
    portraitUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    bio: 'Pastor Mrs. Rose Aninwene serves alongside her husband with grace, wisdom and a deep devotion to prayer. She leads the women\u2019s and family ministries, nurturing believers to walk in holiness and purpose.',
    order: 2,
  },
]

const MINISTRIES = [
  {
    name: 'Redemption School of Ministry (RSM)',
    description: 'Training and raising ordained pastors and ministers for the work of God.',
    details: 'The Redemption School of Ministry (RSM) trains and equips believers for ordained pastoral ministry. Students receive sound biblical instruction alongside hands-on missionary work experience, preparing them for a lifetime of full-time ministry service.',
    order: -1,
  },
  { name: "Children's Ministry", description: 'Nurturing young hearts in the knowledge and love of Christ.', meetingLocation: 'Church Hall', order: 1 },
  { name: 'Youth Ministry', description: 'Raising a bold, Spirit-filled generation for kingdom purpose.', meetingLocation: 'Church Hall', order: 2 },
  { name: "Women's Ministry", description: 'Building women of faith, virtue and prayerful strength.', meetingLocation: 'Church Hall', order: 3 },
  { name: "Men's Ministry", description: 'Equipping men to lead with integrity in home, church and society.', meetingLocation: 'Church Hall', order: 4 },
  { name: 'Choir', description: 'Ministering in song and leading the congregation into worship.', meetingLocation: 'Church Hall', order: 5 },
  { name: 'Evangelism Team', description: 'Carrying the Gospel beyond our walls into the community.', meetingLocation: 'Church Hall', order: 6 },
  { name: 'Prayer Ministry', description: 'Standing in the gap through fervent, effectual prayer.', meetingLocation: 'Church Hall', order: 7 },
]

const SERMONS = [
  { title: 'Undistracted Focus: A Fresh Vision', date: new Date('2026-07-12'), speaker: 'Rev. Dr. Chimaobi Aninwene', topic: 'Focus' },
  { title: 'The Master of Holiness', date: new Date('2026-07-05'), speaker: 'Rev. Dr. Chimaobi Aninwene', topic: 'Holiness' },
  { title: 'Walking in the Spirit', date: new Date('2026-06-28'), speaker: 'Pastor Mrs. Rose Aninwene', topic: 'Spiritual Growth' },
  { title: 'Building on the Rock', date: new Date('2026-06-21'), speaker: 'Rev. Dr. Chimaobi Aninwene', topic: 'Faith' },
  { title: 'Grace for the Race', date: new Date('2026-06-14'), speaker: 'Rev. Dr. Chimaobi Aninwene', topic: 'Faith' },
  { title: 'A Heart of Worship', date: new Date('2026-06-07'), speaker: 'Pastor Mrs. Rose Aninwene', topic: 'Worship' },
]

const EVENTS = [
  { title: 'Undistracted Focus Conference 2026', date: new Date('2026-08-14'), dateLabel: 'Aug 14–16', time: '9:00 AM', location: 'Main Auditorium' },
  { title: 'Youth Explosion Night', date: new Date('2026-08-22'), time: '6:00 PM', location: 'Church Hall' },
  { title: 'Women of Virtue Retreat', date: new Date('2026-09-05'), time: '10:00 AM', location: 'Redemption Camp Ground' },
  { title: 'Prayer & Fasting Week', date: new Date('2026-09-14'), dateLabel: 'Sept 14–20', time: 'Daily, 5:00 AM', location: 'Main Auditorium' },
]

const TESTIMONIES = [
  { name: 'Sister Ngozi A.', text: 'God restored my marriage after the Deliverance Service. I am forever grateful for this house of God.', approved: true },
  { name: 'Brother Emeka O.', text: 'My business turned around within months of sowing into this ministry. Undistracted focus truly changed my life.', approved: true },
  { name: 'Sister Chiamaka U.', text: 'I found healing, purpose and a family in Christ here. The Redemption Church Worldwide is truly home.', approved: true },
  { name: 'Brother Ifeanyi K.', text: 'Through the Word taught here, I broke free from years of addiction. To God be the glory.', approved: true },
]

const GALLERY = [
  { imageUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=800&auto=format&fit=crop', category: 'Sunday Service' },
  { imageUrl: 'https://images.unsplash.com/photo-1508261303786-0e28180d8fd4?q=80&w=800&auto=format&fit=crop', category: 'Sunday Service' },
  { imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=800&auto=format&fit=crop', category: 'Choir' },
  { imageUrl: 'https://images.unsplash.com/photo-1470019693664-1d202d2c0907?q=80&w=800&auto=format&fit=crop', category: 'Youth' },
  { imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop', category: 'Youth' },
  { imageUrl: 'https://images.unsplash.com/photo-1592330732484-8b20e458bc84?q=80&w=800&auto=format&fit=crop', category: 'Outreach' },
  { imageUrl: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?q=80&w=800&auto=format&fit=crop', category: 'Conferences' },
  { imageUrl: 'https://images.unsplash.com/photo-1591508400591-4e762cbe8cbc?q=80&w=800&auto=format&fit=crop', category: 'Conferences' },
]

const BRANCHES = [
  {
    name: 'The Redemption Church Worldwide — Enugu (Headquarters)',
    location: 'No. 8 Moses Ogbodo Street, Topland, Enugu, Nigeria',
    pastorName: 'Rev. Dr. Chimaobi Aninwene',
    phone: '+234 800 000 0000',
    email: 'info@redemptionchurchworldwide.org',
  },
]

const SETTINGS = {
  churchName: 'The Redemption Church Worldwide',
  slogan: 'Celebrate Jesus, the Master of Holiness.',
  aboutHeading: 'A Christ-Centered Family of Faith',
  aboutText:
    'The Redemption Church Worldwide is a Christ-centered ministry committed to raising holy, Spirit-filled believers who passionately follow Jesus Christ and impact the world through the Gospel. Founded under the leadership of Rev. Dr. Chimaobi Aninwene, the church has grown from a small gathering into a thriving family of faith in Enugu, Nigeria, and beyond — committed to sound doctrine, fervent prayer, and radical love for God and people.',
  visionText: 'To raise a global community of holy, Spirit-filled believers passionately following Jesus Christ.',
  missionText: 'To preach the undiluted Word of God, disciple believers, and impact the world through the Gospel.',
  valuesText: 'Holiness, love, integrity, prayerfulness, and undistracted focus on the person of Jesus Christ.',
  themeYear: '2026',
  themeTitle: 'Undistracted Focus',
  themeDescription:
    'This year, we press forward with singleness of heart, laying aside every weight and distraction to run the race set before us with our eyes fixed on Jesus.',
  serviceTimes: [
    {
      day: 'Sundays',
      items: [
        { name: 'First Service', time: '6:30 AM' },
        { name: 'Bible Study', time: '8:30 AM' },
        { name: 'Second Service', time: '9:00 AM' },
      ],
    },
    { day: 'Wednesdays', items: [{ name: 'Prophetic & Deliverance Service', time: '5:00 PM' }] },
  ],
  specialProgrammes: [
    { name: 'Redemption Night', weekOfMonth: 'Last', dayOfWeek: 'Friday', time: '9:00 PM', description: 'A night of extended worship, prayer, and the Word — carried through till dawn.' },
    { name: 'Thanksgiving Service', weekOfMonth: 'Last', dayOfWeek: 'Sunday', time: '9:00 AM', description: 'A special service dedicated to thanking God for His faithfulness through the month.' },
  ],
  address: 'The Redemption Church Worldwide, No. 8 Moses Ogbodo Street, Topland, Enugu, Nigeria',
  phone: '+234 800 000 0000',
  email: 'info@redemptionchurchworldwide.org',
  mapEmbedUrl: 'https://www.google.com/maps?q=Enugu%2C%20Nigeria&output=embed',
  whatsappNumber: '2348000000000',
  bankAccounts: [
    { label: 'Tithe', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide', accountNumber: '0123456789' },
    { label: 'Project', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide - Project', accountNumber: '0000000000' },
    { label: 'Mission', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide - Mission', accountNumber: '0000000000' },
    { label: 'Alms (Helping the Poor)', bankName: 'First Bank of Nigeria', accountName: 'The Redemption Church Worldwide - Alms', accountNumber: '0000000000' },
  ],
}

async function seedIfEmpty(Model, data, label) {
  const count = await Model.countDocuments()
  if (count > 0) {
    console.log(`- ${label}: already has ${count} record(s), skipping`)
    return
  }
  await Model.insertMany(data)
  console.log(`- ${label}: added ${data.length} record(s)`)
}

async function run() {
  await connectDB()
  console.log('Seeding sample content...')

  await seedIfEmpty(Leader, LEADERS, 'Pastors')
  await seedIfEmpty(Ministry, MINISTRIES, 'Ministries')
  // Sermons are intentionally NOT auto-seeded — the site should show nothing
  // here until the admin adds real ones via /admin/sermons.
  await seedIfEmpty(Event, EVENTS, 'Events')
  await seedIfEmpty(Testimony, TESTIMONIES, 'Testimonies')
  await seedIfEmpty(GalleryImage, GALLERY, 'Gallery images')
  await seedIfEmpty(Branch, BRANCHES, 'Branches')

  const settings = await SiteSettings.getSingleton()
  let touched = false

  if (!settings.churchName) {
    settings.churchName = SETTINGS.churchName
    settings.slogan = SETTINGS.slogan
    touched = true
  }
  if (!settings.aboutText) {
    settings.aboutHeading = SETTINGS.aboutHeading
    settings.aboutText = SETTINGS.aboutText
    settings.visionText = SETTINGS.visionText
    settings.missionText = SETTINGS.missionText
    settings.valuesText = SETTINGS.valuesText
    touched = true
  }
  if (!settings.themeTitle) {
    settings.themeYear = SETTINGS.themeYear
    settings.themeTitle = SETTINGS.themeTitle
    settings.themeDescription = SETTINGS.themeDescription
    touched = true
  }
  if (!settings.serviceTimes || settings.serviceTimes.length === 0) {
    settings.serviceTimes = SETTINGS.serviceTimes
    touched = true
  }
  if (!settings.specialProgrammes || settings.specialProgrammes.length === 0) {
    settings.specialProgrammes = SETTINGS.specialProgrammes
    touched = true
  }
  if (!settings.address) {
    settings.address = SETTINGS.address
    settings.phone = SETTINGS.phone
    settings.email = SETTINGS.email
    settings.mapEmbedUrl = SETTINGS.mapEmbedUrl
    settings.whatsappNumber = SETTINGS.whatsappNumber
    touched = true
  }
  if (!settings.bankAccounts || settings.bankAccounts.length === 0) {
    settings.bankAccounts = SETTINGS.bankAccounts
    touched = true
  }

  if (touched) {
    await settings.save()
    console.log('- Site Settings: filled in any blank sections with starter content')
  } else {
    console.log('- Site Settings: already fully customized, skipping')
  }

  console.log('Done.')
  await mongoose.connection.close()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
