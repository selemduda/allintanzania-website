import type { Payload } from 'payload'

import type { Enquiry } from '../payload-types'
import { usd } from './format'
import { siteUrl } from './seo'

/** Emails the sales team about a new enquiry, if an email adapter and recipients are configured. */
export async function notifyTeam(payload: Payload, enquiry: Enquiry) {
  const site = await payload.findGlobal({ slug: 'site-settings' })
  const to = site.enquiryRecipients?.filter(Boolean) ?? []
  if (!to.length || !process.env.SMTP_HOST) return
  const admin = `${siteUrl()}/admin/collections/enquiries/${enquiry.id}`
  await payload.sendEmail({
    to,
    subject: `New ${enquiry.source} enquiry: ${enquiry.name}`,
    text: [
      `${enquiry.name} <${enquiry.email}> ${enquiry.phone ?? ''}`,
      enquiry.travelMonth ? `Travel: ${enquiry.travelMonth}` : '',
      enquiry.estimateTotal ? `Estimate: ${usd(enquiry.estimateTotal)}` : '',
      '',
      enquiry.message ?? '',
      '',
      `Open in admin: ${admin}`,
    ].join('\n'),
  })
}
