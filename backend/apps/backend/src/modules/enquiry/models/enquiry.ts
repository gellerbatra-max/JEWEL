import { model } from "@medusajs/framework/utils"

// A product enquiry raised from the storefront — Drop a Hint, Book an
// Appointment, or Customise Me. Not every field applies to every type
// (e.g. recipient_email is for hints, preferred_date for appointments).
export const Enquiry = model.define("enquiry", {
  id: model.id().primaryKey(),
  type: model.enum(["hint", "appointment", "customise"]),
  product_title: model.text(),
  product_handle: model.text().nullable(),
  name: model.text().nullable(),
  contact: model.text().nullable(),
  message: model.text().nullable(),
  recipient_email: model.text().nullable(),
  preferred_date: model.text().nullable(),
  status: model.enum(["new", "handled"]).default("new"),
})

export default Enquiry
