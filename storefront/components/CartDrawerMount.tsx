import { getSignaturePieces } from "@/lib/catalog-store";
import { CartDrawer } from "./CartDrawer";

// Server wrapper: fetches a few pieces for the drawer's "You may also like"
// row, then renders the client drawer.
export async function CartDrawerMount() {
  const pieces = await getSignaturePieces(6);
  const suggestions = pieces.map((p) => ({
    handle: p.handle,
    title: p.title,
    image: p.image,
    price: p.price,
    currency: p.currency,
    oneOfAKind: p.oneOfAKind,
  }));
  return <CartDrawer suggestions={suggestions} />;
}
