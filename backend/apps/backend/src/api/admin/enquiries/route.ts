import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ENQUIRY_MODULE } from "../../../modules/enquiry"

// Admin list of storefront enquiries, newest first.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: any = req.scope.resolve(ENQUIRY_MODULE)

  const [enquiries, count] = await service.listAndCountEnquiries(
    {},
    { order: { created_at: "DESC" }, take: 200 }
  )

  res.json({ enquiries, count })
}
