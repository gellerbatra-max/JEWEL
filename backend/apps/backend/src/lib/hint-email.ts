import nodemailer from "nodemailer"

// Sends the "Drop a Hint" gift email to a friend, on behalf of the shopper.
// Uses SMTP if configured (real delivery); otherwise falls back to an Ethereal
// test account (email is viewable via a logged preview URL, not delivered).
// To deliver for real, set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM.

type Log = { info: (m: string) => void; error: (m: string) => void }

export type HintEmailInput = {
  recipientEmail: string
  recipientName?: string
  senderName?: string
  senderEmail?: string
  productTitle: string
  productSku?: string
  productUrl?: string
  productImageUrl?: string
  message?: string
}

let transportPromise: Promise<{ transport: nodemailer.Transporter; ethereal: boolean } | null> | null = null

function getTransport() {
  if (transportPromise) return transportPromise
  transportPromise = (async () => {
    // Use real SMTP only when it is fully configured. When SMTP_USER is set, a
    // password must be too — otherwise fall back to the Ethereal dev preview
    // rather than failing Gmail auth (avoids a broken-delivery window while
    // SMTP_PASS is still blank).
    const smtpConfigured =
      !!process.env.SMTP_HOST && (!process.env.SMTP_USER || !!process.env.SMTP_PASS)
    if (smtpConfigured) {
      return {
        transport: nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        }),
        ethereal: false,
      }
    }
    try {
      const test = await nodemailer.createTestAccount()
      return {
        transport: nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: { user: test.user, pass: test.pass },
        }),
        ethereal: true,
      }
    } catch {
      return null
    }
  })()
  return transportPromise
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  )
}

function buildHtml(i: HintEmailInput) {
  const GOLD = "#c2a45c", INK = "#1c1b19", PORC = "#fbfaf7", STONE = "#6e6a63"
  const img = i.productImageUrl
    ? `<img src="cid:piece" alt="" width="220" style="display:block;margin:26px auto;max-width:220px;height:auto" />`
    : ""
  const msg = i.message
    ? `<p style="margin:18px 0 0;font-style:italic;color:${STONE}">&ldquo;${esc(i.message)}&rdquo;</p>`
    : ""
  const cta = i.productUrl
    ? `<a href="${esc(i.productUrl)}" style="display:inline-block;margin-top:30px;background:${INK};color:${PORC};text-decoration:none;padding:14px 32px;font-size:12px;letter-spacing:2px;text-transform:uppercase">View the Piece</a>`
    : ""
  return `
  <div style="background:${PORC};padding:40px 16px;font-family:Georgia,'Times New Roman',serif;color:${INK}">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid rgba(28,27,25,0.1);padding:44px 32px;text-align:center">
      <div style="font-size:20px;letter-spacing:6px;color:${INK}">TAYGERIAN</div>
      <div style="width:40px;height:1px;background:${GOLD};margin:22px auto"></div>
      <p style="margin:0;font-size:16px;line-height:1.6">Dear ${esc(i.recipientName || "there")},</p>
      <p style="margin:8px 0 0;font-size:16px;line-height:1.6">Apparently ${esc(i.senderName || "someone")}<br/>has been dreaming about this creation</p>
      ${img}
      <div style="font-size:18px">${esc(i.productTitle)}</div>
      ${i.productSku ? `<div style="font-size:11px;letter-spacing:1px;color:${STONE};margin-top:4px">Piece ${esc(i.productSku)}</div>` : ""}
      ${msg}
      ${cta}
    </div>
    <p style="max-width:520px;margin:20px auto 0;text-align:center;font-family:Arial,sans-serif;font-size:11px;color:${STONE}">
      Sent on behalf of ${esc(i.senderName || "a friend")} via Taygerian — Ceylon fine jewellery.
    </p>
  </div>`
}

export async function sendHintEmail(input: HintEmailInput, logger: Log): Promise<void> {
  const t = await getTransport()

  const attachments: { filename: string; content: Buffer; cid: string }[] = []
  if (input.productImageUrl) {
    try {
      const r = await fetch(input.productImageUrl)
      if (r.ok) attachments.push({ filename: "piece", content: Buffer.from(await r.arrayBuffer()), cid: "piece" })
    } catch {
      /* image is optional */
    }
  }

  const mail = {
    from: process.env.SMTP_FROM || '"Taygerian" <hint@taygerian.local>',
    to: input.recipientEmail,
    replyTo: input.senderEmail || undefined,
    subject: "Someone is awaiting your response",
    html: buildHtml(input),
    attachments,
  }

  if (!t) {
    logger.info(`[Drop a Hint] No mail transport available; email to ${input.recipientEmail} was NOT sent.`)
    return
  }
  const info = await t.transport.sendMail(mail)
  if (t.ethereal) {
    logger.info(`[Drop a Hint] Email created (Ethereal preview): ${nodemailer.getTestMessageUrl(info)}`)
  } else {
    logger.info(`[Drop a Hint] Email delivered to ${input.recipientEmail} (${info.messageId})`)
  }
}

export type AtelierEmailInput = {
  type: "appointment" | "customise"
  productTitle: string
  productSku?: string
  productUrl?: string
  name?: string
  contact?: string
  message?: string // composed enquiry details
}

function buildAtelierHtml(i: AtelierEmailInput) {
  const GOLD = "#c2a45c", INK = "#1c1b19", PORC = "#fbfaf7", STONE = "#6e6a63"
  const label = i.type === "appointment" ? "Appointment request" : "Customisation enquiry"
  const rows: [string, string][] = [
    ["Piece", `${esc(i.productTitle)}${i.productSku ? ` (Piece ${esc(i.productSku)})` : ""}`],
    ["Name", esc(i.name || "—")],
    ["Contact", esc(i.contact || "—")],
  ]
  const detailRows = rows
    .map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:${STONE};white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;color:${INK}">${v}</td></tr>`)
    .join("")
  const msg = i.message ? `<div style="margin-top:18px;white-space:pre-wrap;color:${INK};font-size:14px">${esc(i.message)}</div>` : ""
  const link = i.productUrl ? `<p style="margin-top:18px;font-size:13px"><a href="${esc(i.productUrl)}" style="color:${GOLD}">${esc(i.productUrl)}</a></p>` : ""
  return `
  <div style="background:${PORC};padding:40px 16px;font-family:Arial,Helvetica,sans-serif;color:${INK}">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(28,27,25,0.1);padding:36px 32px">
      <div style="font-family:Georgia,serif;font-size:18px;letter-spacing:5px;text-align:center">TAYGERIAN</div>
      <div style="width:36px;height:1px;background:${GOLD};margin:18px auto"></div>
      <h2 style="font-family:Georgia,serif;font-size:20px;margin:0 0 16px">${label}</h2>
      <table style="font-size:14px;border-collapse:collapse">${detailRows}</table>
      ${msg}
      ${link}
    </div>
  </div>`
}

// Notifies the atelier's own inbox of an appointment / customisation enquiry.
export async function sendAtelierEmail(input: AtelierEmailInput, logger: Log): Promise<void> {
  const t = await getTransport()
  const to = process.env.ATELIER_EMAIL || "atelier@taygerian.local"
  const mail = {
    from: process.env.SMTP_FROM || '"Taygerian Enquiries" <enquiries@taygerian.local>',
    to,
    replyTo: input.contact?.split(" / ")[0] || undefined,
    subject: `New ${input.type === "appointment" ? "appointment" : "customisation"} enquiry — ${input.productTitle}`,
    html: buildAtelierHtml(input),
  }
  if (!t) {
    logger.info(`[Enquiry] No mail transport; atelier email to ${to} was NOT sent.`)
    return
  }
  const info = await t.transport.sendMail(mail)
  if (t.ethereal) {
    logger.info(`[Enquiry] Atelier email created (Ethereal preview): ${nodemailer.getTestMessageUrl(info)}`)
  } else {
    logger.info(`[Enquiry] Atelier notified at ${to} (${info.messageId})`)
  }
}
