import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import BankAccountCard from '../components/BankAccountCard'
import { CHURCH } from '../data/content'
import { api } from '../lib/api'
import { useApiObject } from '../lib/useApiData'

const CHANNELS = [
  { title: 'Tithe', text: 'Honor God with the firstfruits of your increase.' },
  { title: 'Project', text: 'Partner with us in expanding and maintaining the house of worship.' },
  { title: 'Mission', text: 'Support the spread of the Gospel across nations.' },
  { title: 'Alms', text: 'Give to help the poor and those in need within our community.' },
]

const FALLBACK = {
  bankAccounts: [
    { label: 'Tithe', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
    { label: 'Project', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
    { label: 'Mission', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
    { label: 'Alms (Helping the Poor)', bankName: CHURCH.bank.bankName, accountName: CHURCH.bank.accountName, accountNumber: CHURCH.bank.accountNumber },
  ],
  email: CHURCH.email,
}

export default function Give() {
  const { data } = useApiObject(api.getSettings, FALLBACK)

  return (
    <>
      <PageHero eyebrow="Sow a Seed" title="Give" subtitle="\u201cGive, and it will be given to you.\u201d — Luke 6:38" />

      <section className="bg-cream py-24 dark:bg-brown-900">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) + 1}>
                <div className="h-full rounded-2xl border border-brown-100 bg-white p-6 text-center dark:border-brown-700 dark:bg-brown-800">
                  <h3 className="font-display text-lg font-bold text-brown-700 dark:text-cream">{c.title}</h3>
                  <p className="mt-2 text-sm text-brown-600/80 dark:text-cream/70">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.bankAccounts.map((account, i) => (
              <Reveal key={account.accountNumber || i} delay={(i % 4) + 1}>
                <BankAccountCard account={account} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={data.bankAccounts.length + 1} className="mt-8 text-center">
            <p className="text-sm text-brown-500 dark:text-cream/60">
              For online giving inquiries, please contact the Finance Office at {data.email}.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
