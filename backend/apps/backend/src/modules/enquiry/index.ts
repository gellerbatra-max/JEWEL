import { Module } from "@medusajs/framework/utils"
import EnquiryModuleService from "./service"

export const ENQUIRY_MODULE = "enquiry"

export default Module(ENQUIRY_MODULE, {
  service: EnquiryModuleService,
})
