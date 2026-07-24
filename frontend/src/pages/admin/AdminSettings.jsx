import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import { HEADING_FONTS, BODY_FONTS } from '../../data/fonts'
import { AdminHeader, Card, Field, inputClass, PrimaryButton, GhostButton, DangerButton } from './ui/primitives'
import UploadField from './ui/UploadField'

const EMPTY = {
  churchName: '',
  slogan: '',
  logoUrl: '',
  aboutHeading: '',
  aboutText: '',
  visionText: '',
  missionText: '',
  valuesText: '',
  themeYear: '',
  themeTitle: '',
  themeDescription: '',
  themeMonthLabel: '',
  themeMonthTitle: '',
  themeMonthDescription: '',
  serviceTimes: [],
  specialProgrammes: [],
  address: '',
  phone: '',
  email: '',
  mapEmbedUrl: '',
  whatsappNumber: '',
  bankAccounts: [],
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  twitterUrl: '',
  fontHeading: 'Playfair Display',
  fontBody: 'Inter',
}

export default function AdminSettings() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    api
      .getSettings()
      .then((res) => setForm((f) => ({ ...f, ...res })))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Warn before leaving the page (refresh, close, back) if there are unsaved edits —
  // this is exactly what causes a deleted account to "come back": the removal only
  // exists in this form until "Save All Changes" is clicked.
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const set = (key) => (e) => {
    setSaved(false)
    setDirty(true)
    setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  const setValue = (key) => (value) => {
    setSaved(false)
    setDirty(true)
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const result = await api.updateSettings(form)
      setForm((f) => ({ ...f, ...result }))
      setSaved(true)
      setDirty(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // --- service times helpers ---
  const addServiceDay = () => {
    setDirty(true)
    setForm((f) => ({ ...f, serviceTimes: [...f.serviceTimes, { day: '', items: [{ name: '', time: '' }] }] }))
  }
  const removeServiceDay = (dayIdx) => {
    setDirty(true)
    setForm((f) => ({ ...f, serviceTimes: f.serviceTimes.filter((_, i) => i !== dayIdx) }))
  }
  const setDayName = (dayIdx, value) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      serviceTimes: f.serviceTimes.map((d, i) => (i === dayIdx ? { ...d, day: value } : d)),
    }))
  }
  const addServiceItem = (dayIdx) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      serviceTimes: f.serviceTimes.map((d, i) => (i === dayIdx ? { ...d, items: [...d.items, { name: '', time: '' }] } : d)),
    }))
  }
  const removeServiceItem = (dayIdx, itemIdx) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      serviceTimes: f.serviceTimes.map((d, i) =>
        i === dayIdx ? { ...d, items: d.items.filter((_, j) => j !== itemIdx) } : d
      ),
    }))
  }
  const setServiceItem = (dayIdx, itemIdx, key, value) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      serviceTimes: f.serviceTimes.map((d, i) =>
        i === dayIdx
          ? { ...d, items: d.items.map((it, j) => (j === itemIdx ? { ...it, [key]: value } : it)) }
          : d
      ),
    }))
  }

  // --- special programme helpers ---
  const addProgramme = () => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      specialProgrammes: [...f.specialProgrammes, { name: '', weekOfMonth: 'Last', dayOfWeek: 'Friday', time: '', description: '' }],
    }))
  }
  const removeProgramme = (idx) => {
    setDirty(true)
    setForm((f) => ({ ...f, specialProgrammes: f.specialProgrammes.filter((_, i) => i !== idx) }))
  }
  const setProgramme = (idx, key, value) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      specialProgrammes: f.specialProgrammes.map((p, i) => (i === idx ? { ...p, [key]: value } : p)),
    }))
  }

  // --- bank account helpers ---
  const addBankAccount = () => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      bankAccounts: [...f.bankAccounts, { label: '', bankName: '', accountName: '', accountNumber: '' }],
    }))
  }
  const removeBankAccount = (idx) => {
    setDirty(true)
    setForm((f) => ({ ...f, bankAccounts: f.bankAccounts.filter((_, i) => i !== idx) }))
  }
  const setBankAccount = (idx, key, value) => {
    setDirty(true)
    setForm((f) => ({
      ...f,
      bankAccounts: f.bankAccounts.map((b, i) => (i === idx ? { ...b, [key]: value } : b)),
    }))
  }

  if (loading) return <p className="text-sm text-brown-500 dark:text-cream/50">Loading…</p>

  return (
    <>
      <AdminHeader title="Site Settings" subtitle="Edit About, Theme, Service Times, Contact, Give, and social links" />

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Church Name">
              <input value={form.churchName} onChange={set('churchName')} className={inputClass} />
            </Field>
            <Field label="Slogan">
              <input value={form.slogan} onChange={set('slogan')} className={inputClass} />
            </Field>
          </div>
          <div className="mt-4">
            <UploadField label="Church Logo" value={form.logoUrl} onChange={setValue('logoUrl')} accept="image/*" />
            <p className="mt-2 text-xs text-brown-500 dark:text-cream/50">
              Shows in the navbar in place of the "RC" badge. Square images work best.
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">About Page</h2>
          <div className="space-y-4">
            <Field label='Homepage Heading (e.g. "A Christ-Centered Family of Faith")'>
              <input value={form.aboutHeading} onChange={set('aboutHeading')} className={inputClass} />
            </Field>
            <Field label="About / Who We Are">
              <textarea rows={4} value={form.aboutText} onChange={set('aboutText')} className={inputClass} />
            </Field>
            <Field label="Our Vision">
              <textarea rows={2} value={form.visionText} onChange={set('visionText')} className={inputClass} />
            </Field>
            <Field label="Our Mission">
              <textarea rows={2} value={form.missionText} onChange={set('missionText')} className={inputClass} />
            </Field>
            <Field label="Our Values">
              <textarea rows={2} value={form.valuesText} onChange={set('valuesText')} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">Theme of the Year</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Year">
              <input value={form.themeYear} onChange={set('themeYear')} placeholder="2026" className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Theme Title">
                <input value={form.themeTitle} onChange={set('themeTitle')} placeholder="Undistracted Focus" className={inputClass} />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field label="Theme Description">
                <textarea rows={3} value={form.themeDescription} onChange={set('themeDescription')} className={inputClass} />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">Theme of the Month</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Month Label">
              <input value={form.themeMonthLabel} onChange={set('themeMonthLabel')} placeholder="August 2026" className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Monthly Theme Title">
                <input value={form.themeMonthTitle} onChange={set('themeMonthTitle')} placeholder="e.g. Renewed Strength" className={inputClass} />
              </Field>
            </div>
            <div className="sm:col-span-3">
              <Field label="Monthly Theme Description">
                <textarea rows={3} value={form.themeMonthDescription} onChange={set('themeMonthDescription')} className={inputClass} placeholder="Leave blank to hide this from the public site" />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-brown-700 dark:text-cream">Service Times</h2>
            <GhostButton type="button" onClick={addServiceDay}>
              <span className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Day</span>
            </GhostButton>
          </div>
          <div className="space-y-5">
            {form.serviceTimes.length === 0 && (
              <p className="text-sm text-brown-500 dark:text-cream/50">No service days yet — click "Add Day" to create one.</p>
            )}
            {form.serviceTimes.map((block, dayIdx) => (
              <div key={dayIdx} className="rounded-xl border border-brown-100 p-4 dark:border-brown-700">
                <div className="flex items-center gap-3">
                  <input
                    value={block.day}
                    onChange={(e) => setDayName(dayIdx, e.target.value)}
                    placeholder="e.g. Sundays"
                    className={`${inputClass} font-display font-bold`}
                  />
                  <DangerButton type="button" onClick={() => removeServiceDay(dayIdx)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </DangerButton>
                </div>
                <div className="mt-3 space-y-2">
                  {block.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-2">
                      <input
                        value={item.name}
                        onChange={(e) => setServiceItem(dayIdx, itemIdx, 'name', e.target.value)}
                        placeholder="Service name"
                        className={inputClass}
                      />
                      <input
                        value={item.time}
                        onChange={(e) => setServiceItem(dayIdx, itemIdx, 'time', e.target.value)}
                        placeholder="6:30 AM"
                        className={`${inputClass} w-32 flex-shrink-0`}
                      />
                      <button
                        type="button"
                        onClick={() => removeServiceItem(dayIdx, itemIdx)}
                        className="flex-shrink-0 text-brown-400 hover:text-red-500"
                        aria-label="Remove service time"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addServiceItem(dayIdx)}
                    className="text-xs text-orange-500 hover:text-orange-600"
                  >
                    + Add service time
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display font-bold text-brown-700 dark:text-cream">Special Programmes</h2>
            <GhostButton type="button" onClick={addProgramme}>
              <span className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Programme</span>
            </GhostButton>
          </div>
          <p className="mb-4 text-xs text-brown-500 dark:text-cream/50">
            For fixed monthly or recurring special events — e.g. Redemption Night, Thanksgiving Service — separate from your regular weekly services above.
          </p>
          <div className="space-y-4">
            {form.specialProgrammes.length === 0 && (
              <p className="text-sm text-brown-500 dark:text-cream/50">No special programmes yet — click "Add Programme" to create one.</p>
            )}
            {form.specialProgrammes.map((programme, idx) => (
              <div key={idx} className="rounded-xl border border-brown-100 p-4 dark:border-brown-700">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={programme.name}
                    onChange={(e) => setProgramme(idx, 'name', e.target.value)}
                    placeholder="Name, e.g. Redemption Night"
                    className={`${inputClass} sm:col-span-2 font-display font-bold`}
                  />
                  <select
                    value={programme.weekOfMonth}
                    onChange={(e) => setProgramme(idx, 'weekOfMonth', e.target.value)}
                    className={inputClass}
                  >
                    {['First', 'Second', 'Third', 'Fourth', 'Last'].map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                  <select
                    value={programme.dayOfWeek}
                    onChange={(e) => setProgramme(idx, 'dayOfWeek', e.target.value)}
                    className={inputClass}
                  >
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input
                    value={programme.time}
                    onChange={(e) => setProgramme(idx, 'time', e.target.value)}
                    placeholder="Time, e.g. 9:00 PM"
                    className={`${inputClass} sm:col-span-2`}
                  />
                  <textarea
                    value={programme.description}
                    onChange={(e) => setProgramme(idx, 'description', e.target.value)}
                    placeholder="Description (optional) — e.g. how late it runs, what to expect"
                    rows={2}
                    className={`${inputClass} sm:col-span-2`}
                  />
                </div>
                <p className="mt-2 text-xs text-brown-400 dark:text-cream/40">
                  Used to automatically compute the homepage countdown — set the day/week/time precisely.
                </p>
                <div className="mt-3">
                  <DangerButton type="button" onClick={() => removeProgramme(idx)}>
                    <span className="flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Remove Programme</span>
                  </DangerButton>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display font-bold text-brown-700 dark:text-cream">Contact Page</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Address">
                <input value={form.address} onChange={set('address')} className={inputClass} />
              </Field>
            </div>
            <Field label="Phone">
              <input value={form.phone} onChange={set('phone')} className={inputClass} />
            </Field>
            <Field label="Email">
              <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Google Maps Embed URL">
                <input value={form.mapEmbedUrl} onChange={set('mapEmbedUrl')} className={inputClass} />
              </Field>
            </div>
            <Field label="WhatsApp Number (with country code)">
              <input value={form.whatsappNumber} onChange={set('whatsappNumber')} placeholder="2348000000000" className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-brown-700 dark:text-cream">Give / Bank Accounts</h2>
            <GhostButton type="button" onClick={addBankAccount}>
              <span className="flex items-center gap-1.5"><Plus className="h-3.5 w-3.5" /> Add Account</span>
            </GhostButton>
          </div>
          <div className="space-y-4">
            {form.bankAccounts.length === 0 && (
              <p className="text-sm text-brown-500 dark:text-cream/50">No accounts yet — click "Add Account" to create one.</p>
            )}
            {form.bankAccounts.map((acc, idx) => (
              <div key={idx} className="rounded-xl border border-brown-100 p-4 dark:border-brown-700">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={acc.label}
                    onChange={(e) => setBankAccount(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Tithes & Offerings, Building Fund)"
                    className={`${inputClass} sm:col-span-2 font-display font-bold`}
                  />
                  <input
                    value={acc.bankName}
                    onChange={(e) => setBankAccount(idx, 'bankName', e.target.value)}
                    placeholder="Bank Name"
                    className={inputClass}
                  />
                  <input
                    value={acc.accountName}
                    onChange={(e) => setBankAccount(idx, 'accountName', e.target.value)}
                    placeholder="Account Name"
                    className={inputClass}
                  />
                  <input
                    value={acc.accountNumber}
                    onChange={(e) => setBankAccount(idx, 'accountNumber', e.target.value)}
                    placeholder="Account Number"
                    className={inputClass}
                  />
                </div>
                <div className="mt-3">
                  <DangerButton type="button" onClick={() => removeBankAccount(idx)}>
                    <span className="flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Remove Account</span>
                  </DangerButton>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-display font-bold text-brown-700 dark:text-cream">Social Links</h2>
          <p className="mb-4 text-xs text-brown-500 dark:text-cream/50">
            WhatsApp is set in the Contact section above (it needs your phone number, not a URL).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook URL">
              <input value={form.facebookUrl} onChange={set('facebookUrl')} className={inputClass} />
            </Field>
            <Field label="Instagram URL">
              <input value={form.instagramUrl} onChange={set('instagramUrl')} className={inputClass} />
            </Field>
            <Field label="YouTube URL">
              <input value={form.youtubeUrl} onChange={set('youtubeUrl')} className={inputClass} />
            </Field>
            <Field label="Twitter / X URL">
              <input value={form.twitterUrl} onChange={set('twitterUrl')} className={inputClass} />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-2 font-display font-bold text-brown-700 dark:text-cream">Typography</h2>
          <p className="mb-4 text-xs text-brown-500 dark:text-cream/50">
            The site uses a small, intentional set of fonts: one for headings, one for body text,
            plus a fixed small-caps accent style. Choose from the curated list below — these are
            preloaded, so the change applies instantly across the whole site.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Heading Font">
              <select value={form.fontHeading} onChange={set('fontHeading')} className={inputClass} style={{ fontFamily: form.fontHeading }}>
                {HEADING_FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
            </Field>
            <Field label="Body Font">
              <select value={form.fontBody} onChange={set('fontBody')} className={inputClass} style={{ fontFamily: form.fontBody }}>
                {BODY_FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <div className="sticky bottom-4 flex flex-wrap items-center gap-4 rounded-xl bg-cream/95 p-4 shadow-lg backdrop-blur dark:bg-ink/95">
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save All Changes'}
          </PrimaryButton>
          {dirty && !saving && (
            <p className="text-sm font-medium text-red-500">
              You have unsaved changes — click Save or they&apos;ll be lost on refresh.
            </p>
          )}
          {saved && <p className="text-sm text-orange-500">Saved successfully.</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </>
  )
}
