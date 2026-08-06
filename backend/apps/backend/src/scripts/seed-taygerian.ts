import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

// Taygerian catalog seed. Mirrors storefront/lib/products.ts so the two
// stay recognizably the same catalog until the storefront reads the API
// directly. Re-runnable: it deletes any product whose handle it manages
// (including the Medusa demo products) before recreating them.
type Piece = {
  handle: string
  title: string
  collection: "ceylon-signature" | "fine-jewellery" | "bridal"
  metal: string
  stone: string
  priceUsd: number
  oneOfAKind: boolean
  description: string
  certLab?: string
  certReport?: string
  certOrigin?: string
  swatch: string
}

const COLLECTIONS = [
  {
    title: "Ceylon Signature",
    handle: "ceylon-signature",
  },
  {
    title: "Fine Jewellery",
    handle: "fine-jewellery",
  },
  {
    title: "Bridal",
    handle: "bridal",
  },
]

const PIECES: Piece[] = [
  {
    handle: "cornflower-solitaire-ring",
    title: "Cornflower Solitaire Ring",
    collection: "ceylon-signature",
    metal: "Platinum",
    stone: "2.14ct Ceylon Sapphire",
    priceUsd: 18400,
    oneOfAKind: true,
    certLab: "GIA",
    certReport: "GIA-2241897733",
    certOrigin: "Ceylon (Sri Lanka)",
    description:
      "A single cornflower-blue Ratnapura sapphire set in a hand-forged platinum band. Cut and set entirely in-house.",
    swatch: "#3B5A8C",
  },
  {
    handle: "ratnapura-drop-earrings",
    title: "Ratnapura Drop Earrings",
    collection: "ceylon-signature",
    metal: "18k Yellow Gold",
    stone: "Paired Ceylon Sapphires, 3.2ct total",
    priceUsd: 9800,
    oneOfAKind: true,
    certLab: "GRS",
    certReport: "GRS2026-084471",
    certOrigin: "Ceylon (Sri Lanka)",
    description:
      "A matched pair, hand-selected for color consistency -- a rare match outside a private collection.",
    swatch: "#4A6DA8",
  },
  {
    handle: "facet-band-gold",
    title: "Facet Band",
    collection: "fine-jewellery",
    metal: "18k Gold",
    stone: "-",
    priceUsd: 1450,
    oneOfAKind: false,
    description:
      "A step-cut faceted band, the house's signature line, in three widths.",
    swatch: "#C6A54D",
  },
  {
    handle: "facet-band-silver",
    title: "Facet Band, Silver",
    collection: "fine-jewellery",
    metal: "Sterling Silver",
    stone: "-",
    priceUsd: 320,
    oneOfAKind: false,
    description: "The entry point into the house's signature facet line.",
    swatch: "#9AA3AD",
  },
  {
    handle: "vow-solitaire",
    title: "Vow Solitaire",
    collection: "bridal",
    metal: "Platinum",
    stone: "1.5ct Ceylon White Sapphire",
    priceUsd: 12600,
    oneOfAKind: false,
    certLab: "GIA",
    certReport: "GIA-6601883321",
    certOrigin: "Ceylon (Sri Lanka)",
    description:
      "Made to order, 3-4 week lead time. Ceylon white sapphire in place of a diamond, by request.",
    swatch: "#E7E3D8",
  },
  {
    handle: "vow-band-pair",
    title: "Vow Band Pair",
    collection: "bridal",
    metal: "18k Gold / Platinum",
    stone: "Pave accent, optional",
    priceUsd: 2900,
    oneOfAKind: false,
    description: "A matched pair of wedding bands, sized to order.",
    swatch: "#B98F3E",
  },
]

const DEMO_HANDLES = ["t-shirt", "sweatpants", "sweatshirt", "shorts"]

export default async function seedTaygerian({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const managedHandles = [...DEMO_HANDLES, ...PIECES.map((p) => p.handle)]

  logger.info("Removing demo and previously-seeded products...")
  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: managedHandles },
  })
  if (existing.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: existing.map((p: { id: string }) => p.id) },
    })
    logger.info(`Removed ${existing.length} product(s).`)
  }

  logger.info("Resolving sales channel and shipping profile...")
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const defaultSalesChannel =
    salesChannels.find((s: { name: string }) => s.name === "Default Sales Channel") ??
    salesChannels[0]

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  logger.info("Creating collections...")
  const existingCollectionHandles = new Set<string>()
  const { data: currentCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  })
  currentCollections.forEach((c: { handle: string }) =>
    existingCollectionHandles.add(c.handle)
  )
  const toCreate = COLLECTIONS.filter(
    (c) => !existingCollectionHandles.has(c.handle)
  )
  if (toCreate.length) {
    await createCollectionsWorkflow(container).run({
      input: { collections: toCreate },
    })
  }

  const { data: allCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  })
  const collectionByHandle = new Map<string, string>()
  allCollections.forEach((c: { id: string; handle: string }) =>
    collectionByHandle.set(c.handle, c.id)
  )

  logger.info("Creating Taygerian products...")
  await createProductsWorkflow(container).run({
    input: {
      products: PIECES.map((p) => ({
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: ProductStatus.PUBLISHED,
        collection_id: collectionByHandle.get(p.collection),
        shipping_profile_id: shippingProfile?.id,
        sales_channels: [{ id: defaultSalesChannel.id }],
        metadata: {
          metal: p.metal,
          stone: p.stone,
          one_of_a_kind: p.oneOfAKind,
          swatch: p.swatch,
          cert_lab: p.certLab ?? null,
          cert_report: p.certReport ?? null,
          cert_origin: p.certOrigin ?? null,
        },
        options: [{ title: "Piece", values: ["One size"] }],
        variants: [
          {
            title: p.title,
            sku: p.handle.toUpperCase().replace(/-/g, "_"),
            // Prototype: don't gate purchase on stock counts yet.
            manage_inventory: false,
            options: { Piece: "One size" },
            prices: [
              { amount: p.priceUsd, currency_code: "usd" },
              { amount: Math.round(p.priceUsd * 0.92), currency_code: "eur" },
            ],
          },
        ],
      })),
    },
  })

  logger.info(`Seeded ${PIECES.length} Taygerian products across ${COLLECTIONS.length} collections.`)
}
