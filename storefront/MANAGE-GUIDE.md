# Managing your shop — no coding needed

Your site has a private **Manage** area where you add jewellery, upload photos, and
choose which pieces appear on the home page. You never touch code.

---

## 1. Signing in

1. Go to **`your-site.com/admin`** (while testing locally: `http://localhost:3010/admin`).
2. Enter your **Manage password** and click **Sign in**.

You stay signed in for 7 days on that device. Click **Log out** (top right) to sign out.

### Setting / changing your password

Your password lives in a private settings file called `.env.local` (in the `storefront`
folder). It is **not** part of the public website and is never shown to visitors.

```
ADMIN_PASSWORD=your-new-password
```

After changing it, the site needs to be restarted for the new password to take effect.
(When the site is deployed for real, your host will have a simple “Environment Variables”
screen where you set this — no file editing.)

---

## 2. Adding a piece of jewellery

1. On the Manage dashboard, click **＋ Add piece**.
2. Fill in:
   - **Name** (e.g. *Aurelia Ring*) and **Category** (Rings, Necklaces, …) — required.
   - **Metal**, **Stone**, **Price**, **Currency**, and a short **Description**.
   - **Photos** — click **＋ Add photos** and choose one or more images. The **first photo
     is the main image** shown in listings; drag isn’t needed — use **Main** on any photo
     to make it first, or **Remove** to drop one.
3. Optionally tick:
   - **Show on home page** — features it in *Signature Pieces* on the home page.
   - **One-of-a-kind (price on request)** — hides the price and shows *Price on Request*.
4. Optionally open **Product-page sections** (see below) and **Lab certification**.
5. Click **Add piece**. It appears on your live site immediately.

To change a piece later, click **Edit** on its row. To remove it, click **Delete**
(you’ll be asked to confirm).

### Editing the product-page sections

Each piece’s page has expandable sections — **Size & Fit** (rings only), **The
Taygerian Box**, **Jewellery Care**, and **Shipping & Returns**. In the Add/Edit
form, open **Product-page sections**: every box is pre-filled with the standard
house wording, so all pieces read consistently.

- Leave a box **unchanged** and that piece keeps the shared standard text.
- **Edit** a box to say something specific for that one piece (e.g. a bespoke
  packaging note). Only that piece changes.

The **Description** field near the top is the piece’s main paragraph.

---

## 3. Choosing the home-page “Signature Pieces”

The home page has a **Signature Pieces** row. You decide what goes there:

- On the dashboard, tick **Show on home** next to any piece — it appears there instantly.
- Untick it to take it off.
- If you haven’t picked any yet, the site shows a sensible automatic selection so the home
  page is never empty.

---

## 4. Choosing category images

The **Jewellery** page shows one cover photo per category (Rings, Necklaces, …).

1. In Manage, click **Category images** (top menu).
2. Under each category you’ll see all its pieces. **Click a photo** to make it that
   category’s cover.
3. The badge shows **Cover** (your choice) or **Auto** (the first piece, used until
   you pick one). **Reset to automatic** clears your choice.

---

## 5. Where your data lives (plain English)

- Everything you add is saved on **your own site** — there’s no outside company and no
  monthly fee. Product details are stored in `storefront/data/catalog.json` and photos in
  `storefront/public/images/uploads/`.
- Because it’s all yours, keep a backup of those two locations once you have real products.

---

## 6. Taking card payments later

Right now the site is **enquiry / WhatsApp / bank-transfer** based — customers browse and
contact you to buy. When you’re ready to accept card payments, a local Sri Lankan payment
gateway (e.g. PayHere, Onepay, or a bank gateway) can be added on top of this same store —
no rebuild. Just ask, and it gets wired in.
