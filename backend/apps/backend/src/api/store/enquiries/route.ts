import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ENQUIRY_MODULE } from "../../../modules/enquiry"
import { sendHintEmail, sendAtelierEmail } from "../../../lib/hint-email"

type EnquiryBody = {
  type?: string
  product_title?: string
  product_handle?: string
  product_url?: string // used only to build the hint email; not stored
  product_sku?: string // hint email only; not stored
  product_image_url?: string // hint email only; not stored
  name?: string
  contact?: string
  message?: string
  recipient_email?: string
  recipient_name?: string // used only for the hint email greeting; not stored
  preferred_date?: string
}

const TYPES = ["hint", "appointment", "customise"]

// Storefront enquiry capture: Drop a Hint / Book an Appointment / Customise Me.
export async function POST(
  req: MedusaRequest<EnquiryBody>,
  res: MedusaResponse
) {
  const b = req.body ?? {}

  if (!b.type || !TYPES.includes(b.type) || !b.product_title) {
    return res.status(400).json({
      message:
        "`type` (one of hint|appointment|customise) and `product_title` are required.",
    })
  }

  const service: any = req.scope.resolve(ENQUIRY_MODULE)
  const enquiry = await service.createEnquiries({
    type: b.type,
    product_title: b.product_title,
    product_handle: b.product_handle ?? null,
    name: b.name ?? null,
    contact: b.contact ?? null,
    message: b.message ?? null,
    recipient_email: b.recipient_email ?? null,
    preferred_date: b.preferred_date ?? null,
  })

  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  if (b.type === "hint" && b.recipient_email) {
    // "Drop a Hint": Taygerian emails the friend on the shopper's behalf.
    try {
      await sendHintEmail(
        {
          recipientEmail: b.recipient_email,
          recipientName: b.recipient_name,
          senderName: b.name,
          senderEmail: b.contact,
          productTitle: b.product_title,
          productSku: b.product_sku,
          productUrl: b.product_url,
          productImageUrl: b.product_image_url,
          message: b.message,
        },
        logger
      )
    } catch (e: any) {
      logger.error(`[Drop a Hint] Email failed: ${e?.message ?? e}`)
    }
  } else if (b.type === "appointment" || b.type === "customise") {
    // Notify the atelier's own inbox.
    try {
      await sendAtelierEmail(
        {
          type: b.type,
          productTitle: b.product_title,
          productSku: b.product_sku,
          productUrl: b.product_url,
          name: b.name,
          contact: b.contact,
          message: b.message,
        },
        logger
      )
    } catch (e: any) {
      logger.error(`[Enquiry] Atelier email failed: ${e?.message ?? e}`)
    }
  } else {
    logger.info(`New "${b.type}" enquiry for "${b.product_title}"`)
  }

  res.status(201).json({ enquiry })
}
