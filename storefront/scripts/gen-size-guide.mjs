// Generates public/taygerian-ring-size-guide.pdf (printable ring sizer +
// US/UK/EU conversion chart). Original Taygerian artwork — not derived from
// any other brand's guide. Run ad hoc (pdf-lib is not an app dependency):
//   cd storefront && npm i --no-save pdf-lib \
//     && node scripts/gen-size-guide.mjs public/taygerian-ring-size-guide.pdf
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync } from "node:fs";

const MM = 72 / 25.4; // mm -> pt
const PAGE = [612, 792]; // US Letter
const [PW, PH] = PAGE;

const ink = rgb(0.11, 0.106, 0.098);
const gold = rgb(0.604, 0.482, 0.247);
const stone = rgb(0.431, 0.416, 0.388);
const line = rgb(0.8, 0.79, 0.77);
const cloud = rgb(0.953, 0.941, 0.914);

// US size -> inside diameter (mm), UK letter, circumference (mm)
const SIZES = [
  { us: "4", uk: "H½", dia: 14.9, circ: 46.8 },
  { us: "4½", uk: "I½", dia: 15.3, circ: 48.0 },
  { us: "5", uk: "J½", dia: 15.7, circ: 49.3 },
  { us: "5½", uk: "L", dia: 16.1, circ: 50.6 },
  { us: "6", uk: "M", dia: 16.5, circ: 51.9 },
  { us: "6½", uk: "N", dia: 16.9, circ: 53.1 },
  { us: "7", uk: "O", dia: 17.3, circ: 54.4 },
  { us: "7½", uk: "P", dia: 17.7, circ: 55.7 },
  { us: "8", uk: "Q", dia: 18.1, circ: 57.0 },
  { us: "8½", uk: "Q½", dia: 18.5, circ: 58.3 },
  { us: "9", uk: "R½", dia: 19.0, circ: 59.5 },
];

const doc = await PDFDocument.create();
doc.setTitle("Taygerian Ring Size Guide");
doc.setAuthor("Taygerian");
doc.setSubject("Printable ring size guide and conversion chart");

const serif = await doc.embedFont(StandardFonts.TimesRoman);
const serifB = await doc.embedFont(StandardFonts.TimesRomanBold);
const sans = await doc.embedFont(StandardFonts.Helvetica);
const sansB = await doc.embedFont(StandardFonts.HelveticaBold);

function tracked(text, spacing = 1) {
  return text.split("").join(" ".repeat(0)) + "" && text; // placeholder
}

// draw centered text
function centerText(page, text, y, size, font, color) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PW - w) / 2, y, size, font, color });
}

// draw letter-spaced centered wordmark
function centerSpaced(page, text, y, size, font, color, letterSpace) {
  const chars = text.split("");
  let total = 0;
  for (const c of chars) total += font.widthOfTextAtSize(c, size) + letterSpace;
  total -= letterSpace;
  let x = (PW - total) / 2;
  for (const c of chars) {
    page.drawText(c, { x, y, size, font, color });
    x += font.widthOfTextAtSize(c, size) + letterSpace;
  }
}

// small facet diamond mark, centered at (cx,cy)
function facet(page, cx, cy, r) {
  const pts = [
    [cx, cy + r], [cx + r, cy], [cx, cy - r], [cx - r, cy],
  ];
  // outer diamond
  page.drawLine({ start: { x: pts[0][0], y: pts[0][1] }, end: { x: pts[1][0], y: pts[1][1] }, thickness: 1, color: gold });
  page.drawLine({ start: { x: pts[1][0], y: pts[1][1] }, end: { x: pts[2][0], y: pts[2][1] }, thickness: 1, color: gold });
  page.drawLine({ start: { x: pts[2][0], y: pts[2][1] }, end: { x: pts[3][0], y: pts[3][1] }, thickness: 1, color: gold });
  page.drawLine({ start: { x: pts[3][0], y: pts[3][1] }, end: { x: pts[0][0], y: pts[0][1] }, thickness: 1, color: gold });
  page.drawLine({ start: { x: cx - r, y: cy }, end: { x: cx + r, y: cy }, thickness: 0.6, color: gold });
}

// ---------- PAGE 1 ----------
const p1 = doc.addPage(PAGE);
let y = PH - 54;

facet(p1, PW / 2, y - 2, 7);
y -= 26;
centerSpaced(p1, "TAYGERIAN", y, 15, serif, ink, 4);
y -= 30;
centerText(p1, "Ring Size Guide", y, 24, serif, ink);
y -= 22;
centerText(p1, "Two ways to find your size at home. Please print this page at 100% (Actual Size).", y, 9.5, sans, stone);

// Calibration bar
y -= 34;
p1.drawText("STEP 1  ·  CHECK YOUR PRINT SCALE", { x: 54, y, size: 9, font: sansB, color: gold });
y -= 16;
p1.drawText("The line below must measure exactly 50 mm. If it does not, reprint at 100% / Actual Size (no “fit to page”).", { x: 54, y, size: 9.5, font: sans, color: stone });
y -= 20;
const barX = 54, barLen = 50 * MM;
p1.drawLine({ start: { x: barX, y }, end: { x: barX + barLen, y }, thickness: 1.2, color: ink });
for (let mm = 0; mm <= 50; mm += 10) {
  const tx = barX + mm * MM;
  p1.drawLine({ start: { x: tx, y }, end: { x: tx, y: y + 6 }, thickness: 1, color: ink });
  p1.drawText(String(mm), { x: tx - 4, y: y + 9, size: 7, font: sans, color: stone });
}
p1.drawText("50 mm", { x: barX + barLen + 8, y: y - 2, size: 9, font: sansB, color: ink });

// Method 1 - measure a ring
y -= 34;
p1.drawText("STEP 2  ·  MEASURE A RING YOU ALREADY OWN", { x: 54, y, size: 9, font: sansB, color: gold });
y -= 16;
p1.drawText("Place a ring that fits over the circles below. The correct size is the circle whose edge sits just inside", { x: 54, y, size: 9.5, font: sans, color: stone });
y -= 13;
p1.drawText("the ring’s inner band, with no gap showing.", { x: 54, y, size: 9.5, font: sans, color: stone });

// grid of circles: 3 columns x 4 rows
y -= 18;
const gridTop = y;
const cols = 3;
const colW = (PW - 108) / cols;
const rowH = 108;
SIZES.forEach((s, i) => {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const cx = 54 + colW * col + colW / 2;
  const cy = gridTop - row * rowH - 42;
  const r = (s.dia * MM) / 2;
  p1.drawCircle({ x: cx, y: cy, size: r, borderColor: ink, borderWidth: 0.8 });
  // center crosshair
  p1.drawLine({ start: { x: cx - 4, y: cy }, end: { x: cx + 4, y: cy }, thickness: 0.4, color: line });
  p1.drawLine({ start: { x: cx, y: cy - 4 }, end: { x: cx, y: cy + 4 }, thickness: 0.4, color: line });
  const label = `US ${s.us}`;
  const sub = `${s.dia.toFixed(1)} mm`;
  const lw = sansB.widthOfTextAtSize(label, 9);
  p1.drawText(label, { x: cx - lw / 2, y: cy - rowH / 2 + 20, size: 9, font: sansB, color: ink });
  const sw = sans.widthOfTextAtSize(sub, 8);
  p1.drawText(sub, { x: cx - sw / 2, y: cy - rowH / 2 + 9, size: 8, font: sans, color: stone });
});

// footer p1
p1.drawText("Not sure? Book a complimentary video consultation and we will measure together — or request a physical ring sizer.", { x: 54, y: 40, size: 8.5, font: sans, color: stone });

// ---------- PAGE 2 ----------
const p2 = doc.addPage(PAGE);
y = PH - 54;
centerSpaced(p2, "TAYGERIAN", y, 12, serif, ink, 4);
y -= 26;
centerText(p2, "Measure Your Finger & Size Conversion", y, 18, serif, ink);

// Method 2 steps
y -= 34;
p2.drawText("MEASURE YOUR FINGER WITH A STRIP OF PAPER", { x: 54, y, size: 9, font: sansB, color: gold });
const steps = [
  "1.  Cut a thin strip of paper about 90 mm long.",
  "2.  Wrap it snugly around the base of the finger, below the knuckle.",
  "3.  Mark where the end overlaps, then lay the strip flat and measure to the mark in millimetres.",
  "4.  That length is your finger circumference. Find it in the chart below to read your size.",
];
y -= 16;
for (const st of steps) {
  p2.drawText(st, { x: 54, y, size: 10, font: sans, color: ink });
  y -= 16;
}
p2.drawText("Measure at the end of the day, when fingers are largest. If between sizes, choose the larger.", { x: 54, y, size: 9, font: sans, color: stone });

// Conversion table
y -= 34;
p2.drawText("SIZE CONVERSION", { x: 54, y, size: 9, font: sansB, color: gold });
y -= 8;
const tableX = 54;
const tableW = PW - 108;
const colsDef = [
  { key: "us", label: "US", w: 0.22 },
  { key: "uk", label: "UK", w: 0.22 },
  { key: "circ", label: "Circumference / EU (mm)", w: 0.34 },
  { key: "dia", label: "Inside Ø (mm)", w: 0.22 },
];
const rowHeight = 22;
// header row
let ty = y - rowHeight;
p2.drawRectangle({ x: tableX, y: ty, width: tableW, height: rowHeight, color: cloud });
let cx0 = tableX;
for (const c of colsDef) {
  const cw = tableW * c.w;
  p2.drawText(c.label, { x: cx0 + 8, y: ty + 7, size: 8.5, font: sansB, color: ink });
  cx0 += cw;
}
// body rows
SIZES.forEach((s, i) => {
  const ry = ty - rowHeight * (i + 1);
  if (i % 2 === 1) {
    p2.drawRectangle({ x: tableX, y: ry, width: tableW, height: rowHeight, color: rgb(0.98, 0.976, 0.965) });
  }
  let x0 = tableX;
  const vals = {
    us: s.us,
    uk: s.uk,
    circ: s.circ.toFixed(1),
    dia: s.dia.toFixed(1),
  };
  for (const c of colsDef) {
    const cw = tableW * c.w;
    const val = String(vals[c.key]);
    p2.drawText(val, { x: x0 + 8, y: ry + 7, size: 9, font: sans, color: ink });
    x0 += cw;
  }
});
// table border lines
const tableBottom = ty - rowHeight * SIZES.length;
p2.drawLine({ start: { x: tableX, y: ty + rowHeight }, end: { x: tableX + tableW, y: ty + rowHeight }, thickness: 0.8, color: line });
p2.drawLine({ start: { x: tableX, y: ty }, end: { x: tableX + tableW, y: ty }, thickness: 0.8, color: line });
p2.drawLine({ start: { x: tableX, y: tableBottom }, end: { x: tableX + tableW, y: tableBottom }, thickness: 0.8, color: line });

// note
p2.drawText("EU ring sizes correspond to the finger circumference in millimetres. UK letters are approximate.", { x: 54, y: tableBottom - 20, size: 8.5, font: sans, color: stone });

// footer
facet(p2, PW / 2, 66, 6);
centerSpaced(p2, "TAYGERIAN", 46, 9, serif, ink, 3);
centerText(p2, "Ceylon-provenance fine jewellery  ·  Every ring made to your size", 33, 8, sans, stone);

const bytes = await doc.save();
const out = process.argv[2];
writeFileSync(out, bytes);
console.log("wrote", out, bytes.length, "bytes");
