import { MedusaService } from "@medusajs/framework/utils"
import { Enquiry } from "./models/enquiry"

// Auto-generates CRUD for Enquiry: createEnquiries, listEnquiries,
// listAndCountEnquiries, updateEnquiries, deleteEnquiries, etc.
class EnquiryModuleService extends MedusaService({ Enquiry }) {}

export default EnquiryModuleService
