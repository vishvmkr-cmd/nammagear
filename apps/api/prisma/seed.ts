import {
  PrismaClient,
  Condition,
  OrderStatus,
  ListingStatus,
  TicketStatus,
  TicketPriority,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...\n');

  // ── Categories ──
  const categories = [
    { slug: 'laptops',      name: 'Laptops' },
    { slug: 'desktops',     name: 'Desktops' },
    { slug: 'monitors',     name: 'Monitors' },
    { slug: 'phones',       name: 'Phones' },
    { slug: 'tablets',      name: 'Tablets & iPads' },
    { slug: 'keyboards',    name: 'Keyboards' },
    { slug: 'mice',         name: 'Mice & Trackpads' },
    { slug: 'audio',        name: 'Audio' },
    { slug: 'storage',      name: 'Storage' },
    { slug: 'networking',   name: 'Networking' },
    { slug: 'gaming',       name: 'Gaming' },
    { slug: 'components',   name: 'Components' },
    { slug: 'cameras',      name: 'Cameras' },
    { slug: 'printers',     name: 'Printers & Scanners' },
    { slug: 'software',     name: 'Software & Licenses' },
    { slug: 'accessories',  name: 'Accessories' },
    { slug: 'wearables',    name: 'Wearables' },
    { slug: 'others',       name: 'Others' },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    catMap[c.slug] = cat.id;
    console.log(`  ✓ Category: ${c.name}`);
  }

  // ── Demo Users ──
  const passwordHash = await bcrypt.hash('password123', 10);
  const areas = ['Koramangala', 'HSR Layout', 'Indiranagar', 'Marathahalli', 'BTM Layout', 'Electronic City', 'Whitefield', 'Jayanagar'];

  const demoUsers = [
    { email: 'arun@pes.edu',      name: 'Arun Kumar',    college: 'PES University', area: areas[0], pincode: '560034' },
    { email: 'priya@rvce.edu.in',  name: 'Priya Sharma',  college: 'RVCE',           area: areas[1], pincode: '560102' },
    { email: 'ravi@bmsce.ac.in',   name: 'Ravi Gowda',    college: 'BMSCE',          area: areas[2], pincode: '560038' },
    { email: 'sneha@msrit.edu',    name: 'Sneha Reddy',   college: 'MSRIT',          area: areas[3], pincode: '560037' },
    { email: 'kiran@gmail.com',    name: 'Kiran Patel',   college: null,             area: areas[4], pincode: '560029' },
    { email: 'ananya@cmrit.ac.in', name: 'Ananya Rao',    college: 'CMRIT',          area: areas[5], pincode: '560100' },
    { email: 'deepak@dsce.edu',    name: 'Deepak Hegde',  college: 'DSCE',           area: areas[6], pincode: '560060' },
    { email: 'meera@gmail.com',    name: 'Meera Nair',    college: null,             area: areas[7], pincode: '560041' },
  ];

  const userIds: string[] = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash },
    });
    userIds.push(user.id);
    console.log(`  ✓ User: ${u.name}`);
  }

  await prisma.user.update({
    where: { email: 'arun@pes.edu' },
    data: { role: 'ADMIN' },
  });
  console.log('  ✓ arun@pes.edu → ADMIN (can list inventory on /sell)');

  // ── Listings (replace each run so re-seed does not duplicate) ──
  await prisma.serviceTicket.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.save.deleteMany({});
  await prisma.listing.deleteMany({});

  const listings = [
    // ── Laptops ──
    { title: 'MacBook Air M2 (2023) — Midnight',            description: 'Barely used MacBook Air M2, 8GB/256GB. Still under Apple Care+ till March 2027. Pristine condition.', condition: 'A' as Condition, price: 72000, categorySlug: 'laptops',    area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 1.2, hasBill: true,  userIdx: 0 },
    { title: 'Dell XPS 15 — i7, 16GB, 512GB SSD',           description: 'Dell XPS 15 (2022) with 4K OLED display. Battery health at 89%. Minor scuff on bottom lid.', condition: 'B' as Condition, price: 58000, categorySlug: 'laptops',    area: 'HSR Layout',      pincode: '560102', negotiable: true,  ageYears: 2,   hasBill: true,  userIdx: 1 },
    { title: 'ThinkPad X1 Carbon Gen 10 — i5, 16GB',        description: 'Business-grade ThinkPad, great keyboard, lightweight. Used for office work.', condition: 'B' as Condition, price: 45000, categorySlug: 'laptops',    area: 'Indiranagar',     pincode: '560038', negotiable: false, ageYears: 2.5, hasBill: false, userIdx: 2 },
    { title: 'HP Pavilion Gaming — Ryzen 5, GTX 1650',      description: 'Good gaming laptop for the price. Fine for most games at medium settings.', condition: 'B' as Condition, price: 32000, categorySlug: 'laptops',    area: 'BTM Layout',      pincode: '560029', negotiable: true,  ageYears: 3,   hasBill: true,  userIdx: 4 },
    { title: 'ASUS ROG Strix G15 — Ryzen 7, RTX 3060',     description: 'High-performance gaming laptop. RGB keyboard works perfectly.', condition: 'A' as Condition, price: 68000, categorySlug: 'laptops',    area: 'Electronic City', pincode: '560100', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 5 },
    { title: 'MacBook Pro 14" M3 — 18GB/512GB',             description: 'Latest M3 Pro chip. Barely 3 months old, selling because upgrading to M3 Max.', condition: 'A' as Condition, price: 145000, categorySlug: 'laptops',  area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 0.3, hasBill: true,  userIdx: 0 },

    // ── Desktops ──
    { title: 'Custom Gaming PC — Ryzen 5 5600X + RTX 3070', description: 'Full tower: 32GB DDR4, 1TB NVMe, NZXT H510 case. Runs everything at 1440p.', condition: 'A' as Condition, price: 65000, categorySlug: 'desktops',   area: 'Whitefield',      pincode: '560060', negotiable: true,  ageYears: 2,   hasBill: false, userIdx: 6 },
    { title: 'Mac Mini M2 — 8GB/256GB (2023)',               description: 'Compact powerhouse. macOS Sonoma installed.', condition: 'A' as Condition, price: 38000, categorySlug: 'desktops',   area: 'BTM Layout',      pincode: '560029', negotiable: false, ageYears: 1,   hasBill: true,  userIdx: 4 },
    { title: 'Intel NUC 12 Pro — i7, 32GB, 1TB',            description: 'Tiny form factor PC. Perfect for dev workstation or media center.', condition: 'A' as Condition, price: 42000, categorySlug: 'desktops',   area: 'HSR Layout',      pincode: '560102', negotiable: true,  ageYears: 1,   hasBill: true,  userIdx: 1 },

    // ── Monitors ──
    { title: 'LG UltraFine 27" 4K USB-C Monitor',           description: 'Amazing for Mac users. USB-C single cable setup. IPS panel.', condition: 'A' as Condition, price: 28000, categorySlug: 'monitors',   area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 1,   hasBill: true,  userIdx: 0 },
    { title: 'Samsung Odyssey G5 27" 144Hz Curved',          description: '1440p gaming monitor, 1ms response time. VA panel with deep blacks.', condition: 'B' as Condition, price: 16000, categorySlug: 'monitors',   area: 'Marathahalli',    pincode: '560037', negotiable: true,  ageYears: 2,   hasBill: false, userIdx: 3 },
    { title: 'BenQ PD2700U — 27" 4K Designer Monitor',      description: '100% sRGB and Rec. 709 coverage. 10-bit color depth.', condition: 'A' as Condition, price: 32000, categorySlug: 'monitors',   area: 'Whitefield',      pincode: '560060', negotiable: false, ageYears: 1.5, hasBill: true,  userIdx: 6 },
    { title: 'Dell S2722QC — 27" 4K USB-C, 60Hz',           description: 'Excellent for WFH. Speakers built in, USB-C hub. Clean design.', condition: 'B' as Condition, price: 20000, categorySlug: 'monitors',   area: 'Indiranagar',     pincode: '560038', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 2 },

    // ── Phones ──
    { title: 'iPhone 14 Pro — 128GB, Deep Purple',           description: 'Dynamic Island, 48MP camera. Battery health 94%.', condition: 'A' as Condition, price: 62000, categorySlug: 'phones',     area: 'Jayanagar',       pincode: '560041', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 7 },
    { title: 'OnePlus 12 — 16GB/256GB, Silky Black',        description: 'Snapdragon 8 Gen 3. 100W SUPERVOOC. Screen protector since day 1.', condition: 'A' as Condition, price: 42000, categorySlug: 'phones',     area: 'Marathahalli',    pincode: '560037', negotiable: true,  ageYears: 0.8, hasBill: true,  userIdx: 3 },
    { title: 'Samsung Galaxy S23 Ultra — 256GB, Green',      description: 'S Pen, 200MP camera. Includes cover and charger.', condition: 'B' as Condition, price: 52000, categorySlug: 'phones',     area: 'Electronic City', pincode: '560100', negotiable: true,  ageYears: 1.2, hasBill: true,  userIdx: 5 },
    { title: 'Google Pixel 8 — 128GB, Obsidian',            description: 'Best camera phone. Stock Android, 7 years of updates. Mint condition.', condition: 'A' as Condition, price: 36000, categorySlug: 'phones',     area: 'Koramangala',     pincode: '560034', negotiable: false, ageYears: 0.6, hasBill: true,  userIdx: 0 },

    // ── Tablets & iPads ──
    { title: 'iPad Air M1 (2022) — 64GB WiFi',              description: 'Apple Pencil 2 support. Perfect for notes and drawing.', condition: 'B' as Condition, price: 34000, categorySlug: 'tablets',    area: 'Electronic City', pincode: '560100', negotiable: true,  ageYears: 2,   hasBill: true,  userIdx: 5 },
    { title: 'Samsung Galaxy Tab S8 — 128GB',                description: 'S Pen included. DeX mode for desktop experience.', condition: 'A' as Condition, price: 30000, categorySlug: 'tablets',    area: 'Whitefield',      pincode: '560060', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 6 },
    { title: 'iPad Pro 11" M2 — 256GB WiFi + Pencil',       description: 'Pro-level iPad with M2 chip. Comes with Apple Pencil 2 & Magic Keyboard.', condition: 'A' as Condition, price: 72000, categorySlug: 'tablets',    area: 'Indiranagar',     pincode: '560038', negotiable: true,  ageYears: 0.8, hasBill: true,  userIdx: 2 },

    // ── Keyboards ──
    { title: 'Keychron K8 Pro — Gateron Brown, RGB',         description: 'Hot-swappable TKL. Bluetooth + USB-C.', condition: 'A' as Condition, price: 6500,  categorySlug: 'keyboards',  area: 'HSR Layout',      pincode: '560102', negotiable: false, ageYears: 0.5, hasBill: true,  userIdx: 1 },
    { title: 'Logitech MX Keys — Advanced Wireless',        description: 'Slim wireless with backlight. Multi-device Bluetooth.', condition: 'B' as Condition, price: 5000,  categorySlug: 'keyboards',  area: 'Indiranagar',     pincode: '560038', negotiable: true,  ageYears: 1.5, hasBill: false, userIdx: 2 },
    { title: 'Royal Kludge RK84 — Custom Modded',           description: 'Hand-lubed Akko CS switches, PE foam, tape mod, custom keycaps.', condition: 'A' as Condition, price: 4500,  categorySlug: 'keyboards',  area: 'Jayanagar',       pincode: '560041', negotiable: true,  ageYears: 0.8, hasBill: false, userIdx: 7 },

    // ── Mice & Trackpads ──
    { title: 'Logitech MX Master 3S — Graphite',            description: 'Best productivity mouse. Silent clicks, MagSpeed scroll wheel.', condition: 'A' as Condition, price: 5500,  categorySlug: 'mice',       area: 'Indiranagar',     pincode: '560038', negotiable: false, ageYears: 0.6, hasBill: true,  userIdx: 2 },
    { title: 'Apple Magic Trackpad — Black',                 description: 'Multi-touch, Force Touch + haptic feedback. Like new.', condition: 'A' as Condition, price: 8000,  categorySlug: 'mice',       area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 0.4, hasBill: true,  userIdx: 0 },
    { title: 'Razer DeathAdder V3 — Wireless',              description: 'Ultra-light esports mouse, Focus Pro 30K sensor. Used for 2 months.', condition: 'A' as Condition, price: 7000,  categorySlug: 'mice',       area: 'BTM Layout',      pincode: '560029', negotiable: true,  ageYears: 0.2, hasBill: true,  userIdx: 4 },

    // ── Audio ──
    { title: 'Sony WH-1000XM5 — Silver',                    description: 'Industry-leading ANC. Exceptional sound quality.', condition: 'A' as Condition, price: 18000, categorySlug: 'audio',      area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 0.8, hasBill: true,  userIdx: 0 },
    { title: 'Apple AirPods Pro 2 — USB-C',                 description: 'ANC working perfectly. All ear tips included.', condition: 'A' as Condition, price: 14000, categorySlug: 'audio',      area: 'BTM Layout',      pincode: '560029', negotiable: false, ageYears: 0.5, hasBill: true,  userIdx: 4 },
    { title: 'JBL Flip 6 — Portable Speaker',               description: 'Waterproof, great bass. Works like new.', condition: 'B' as Condition, price: 6000,  categorySlug: 'audio',      area: 'Marathahalli',    pincode: '560037', negotiable: true,  ageYears: 1,   hasBill: false, userIdx: 3 },
    { title: 'Audio-Technica ATH-M50x — Studio Headphones', description: 'Flat reference sound, foldable, 3 cables included. Industry standard for mixing.', condition: 'B' as Condition, price: 7500,  categorySlug: 'audio',      area: 'Jayanagar',       pincode: '560041', negotiable: true,  ageYears: 2,   hasBill: false, userIdx: 7 },

    // ── Storage ──
    { title: 'Samsung T7 — 1TB Portable SSD',               description: 'USB 3.2, up to 1050 MB/s. Fingerprint security. Tiny form factor.', condition: 'A' as Condition, price: 6500,  categorySlug: 'storage',    area: 'HSR Layout',      pincode: '560102', negotiable: false, ageYears: 0.5, hasBill: true,  userIdx: 1 },
    { title: 'WD My Passport — 4TB External HDD',           description: 'Reliable backup drive. USB 3.0. Works on Mac & Windows.', condition: 'B' as Condition, price: 5500,  categorySlug: 'storage',    area: 'Marathahalli',    pincode: '560037', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 3 },
    { title: 'Samsung 980 Pro — 2TB NVMe M.2 SSD',          description: 'PCIe 4.0, 7000 MB/s read speed. Used for 6 months in a PS5.', condition: 'A' as Condition, price: 10000, categorySlug: 'storage',    area: 'Electronic City', pincode: '560100', negotiable: true,  ageYears: 0.5, hasBill: true,  userIdx: 5 },

    // ── Networking ──
    { title: 'TP-Link Archer AX73 — WiFi 6 Router',         description: 'AX5400 dual-band. Covers 3BHK easily. OFDMA + MU-MIMO.', condition: 'A' as Condition, price: 4500,  categorySlug: 'networking',  area: 'Whitefield',      pincode: '560060', negotiable: true,  ageYears: 0.8, hasBill: true,  userIdx: 6 },
    { title: 'Google Nest WiFi Pro — 3-Pack Mesh',           description: 'WiFi 6E mesh system. Covers up to 4,400 sq ft. Like new.', condition: 'A' as Condition, price: 18000, categorySlug: 'networking',  area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 0.5, hasBill: true,  userIdx: 0 },

    // ── Gaming ──
    { title: 'PS5 Disc Edition + 2 Controllers',             description: 'PlayStation 5 with disc drive. 2 DualSense controllers. 4 games included.', condition: 'A' as Condition, price: 38000, categorySlug: 'gaming',      area: 'BTM Layout',      pincode: '560029', negotiable: true,  ageYears: 1,   hasBill: true,  userIdx: 4 },
    { title: 'Nintendo Switch OLED — White',                 description: 'OLED model with larger screen. Includes carry case and 2 games.', condition: 'A' as Condition, price: 22000, categorySlug: 'gaming',      area: 'Indiranagar',     pincode: '560038', negotiable: true,  ageYears: 0.8, hasBill: true,  userIdx: 2 },
    { title: 'Xbox Series S — 512GB',                        description: 'All-digital console. Game Pass Ultimate transferable for 6 months.', condition: 'B' as Condition, price: 18000, categorySlug: 'gaming',      area: 'HSR Layout',      pincode: '560102', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 1 },
    { title: 'SteelSeries Arctis Nova Pro — Wireless',       description: 'Premium wireless gaming headset with hot-swap battery. Multi-system.', condition: 'A' as Condition, price: 16000, categorySlug: 'gaming',      area: 'Jayanagar',       pincode: '560041', negotiable: false, ageYears: 0.5, hasBill: true,  userIdx: 7 },

    // ── Components ──
    { title: 'NVIDIA RTX 4070 — Founders Edition',          description: 'Excellent 1440p GPU. Cool & quiet. Never mined.', condition: 'A' as Condition, price: 42000, categorySlug: 'components', area: 'Whitefield',      pincode: '560060', negotiable: true,  ageYears: 0.8, hasBill: true,  userIdx: 6 },
    { title: 'AMD Ryzen 7 7800X3D — CPU Only',              description: 'Best gaming CPU. Used for 4 months, upgraded to 9800X3D.', condition: 'A' as Condition, price: 22000, categorySlug: 'components', area: 'BTM Layout',      pincode: '560029', negotiable: false, ageYears: 0.3, hasBill: true,  userIdx: 4 },
    { title: 'Corsair Vengeance DDR5 — 32GB (2x16) 6000MHz', description: 'CL30 kit. Tested and stable with XMP. Perfect for high-end builds.', condition: 'A' as Condition, price: 8500,  categorySlug: 'components', area: 'Electronic City', pincode: '560100', negotiable: true,  ageYears: 0.5, hasBill: true,  userIdx: 5 },

    // ── Cameras ──
    { title: 'Sony A6400 — Body + 16-50mm Kit Lens',        description: 'Mirrorless camera with fast autofocus. Great for video and photography.', condition: 'A' as Condition, price: 48000, categorySlug: 'cameras',    area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 0 },
    { title: 'GoPro Hero 12 Black — Action Camera',         description: 'Latest GoPro with HyperSmooth 6.0. Includes mounts and case.', condition: 'A' as Condition, price: 28000, categorySlug: 'cameras',    area: 'Indiranagar',     pincode: '560038', negotiable: false, ageYears: 0.4, hasBill: true,  userIdx: 2 },

    // ── Printers & Scanners ──
    { title: 'HP LaserJet M1005 — Multifunction Printer',   description: 'Print, scan, copy. Reliable B&W laser. New toner installed.', condition: 'B' as Condition, price: 6000,  categorySlug: 'printers',   area: 'Marathahalli',    pincode: '560037', negotiable: true,  ageYears: 3,   hasBill: false, userIdx: 3 },
    { title: 'Epson L3250 — Ink Tank Color Printer',        description: 'WiFi color printer with ink tank. Very low cost per page.', condition: 'B' as Condition, price: 8000,  categorySlug: 'printers',   area: 'HSR Layout',      pincode: '560102', negotiable: true,  ageYears: 1.5, hasBill: true,  userIdx: 1 },

    // ── Software & Licenses ──
    { title: 'Microsoft Office 365 — Family (1 year)',       description: 'Unused activation code. Up to 6 users, 1TB OneDrive each.', condition: 'A' as Condition, price: 3500,  categorySlug: 'software',   area: 'Koramangala',     pincode: '560034', negotiable: false, ageYears: 0,   hasBill: true,  userIdx: 0 },
    { title: 'JetBrains All Products Pack — 1yr License',   description: 'Transferable student license. IntelliJ, PyCharm, WebStorm, all IDEs.', condition: 'A' as Condition, price: 2000,  categorySlug: 'software',   area: 'BTM Layout',      pincode: '560029', negotiable: false, ageYears: 0,   hasBill: true,  userIdx: 4 },

    // ── Accessories ──
    { title: 'Rain Design mStand360 — Laptop Stand',        description: 'Aluminum stand with 360° swivel. Elevates screen to eye level.', condition: 'B' as Condition, price: 3500,  categorySlug: 'accessories', area: 'HSR Layout',     pincode: '560102', negotiable: true,  ageYears: 1,   hasBill: false, userIdx: 1 },
    { title: 'Anker 737 — 120W GaN Charger',                description: '3 ports (2 USB-C + 1 USB-A). Charges laptop + phone simultaneously.', condition: 'A' as Condition, price: 3000,  categorySlug: 'accessories', area: 'Jayanagar',      pincode: '560041', negotiable: false, ageYears: 0.3, hasBill: true,  userIdx: 7 },
    { title: 'CalDigit TS4 — Thunderbolt 4 Dock',           description: '18 ports. Powers MacBook, drives 2 monitors, connects everything.', condition: 'A' as Condition, price: 18000, categorySlug: 'accessories', area: 'Whitefield',     pincode: '560060', negotiable: true,  ageYears: 0.5, hasBill: true,  userIdx: 6 },

    // ── Wearables ──
    { title: 'Apple Watch Series 9 — 45mm GPS, Midnight',   description: 'Latest Apple Watch. Always-on display, blood oxygen. With 3 bands.', condition: 'A' as Condition, price: 28000, categorySlug: 'wearables',  area: 'Koramangala',     pincode: '560034', negotiable: true,  ageYears: 0.4, hasBill: true,  userIdx: 0 },
    { title: 'Samsung Galaxy Watch 6 Classic — 47mm',       description: 'Rotating bezel, LTE model. Health tracking, Google Pay.', condition: 'A' as Condition, price: 16000, categorySlug: 'wearables',  area: 'Electronic City', pincode: '560100', negotiable: true,  ageYears: 0.6, hasBill: true,  userIdx: 5 },

    // ── Others ──
    { title: 'Raspberry Pi 4 — 8GB + Case + PSU',           description: 'Complete RPi4 kit. Perfect for IoT projects, media server, or Pi-hole.', condition: 'A' as Condition, price: 5500,  categorySlug: 'others',     area: 'Indiranagar',     pincode: '560038', negotiable: false, ageYears: 1,   hasBill: false, userIdx: 2 },
    { title: 'Arduino Mega + Sensor Kit (37 sensors)',       description: 'Great for college projects. All sensors tested and working.', condition: 'B' as Condition, price: 2500,  categorySlug: 'others',     area: 'Marathahalli',    pincode: '560037', negotiable: true,  ageYears: 1.5, hasBill: false, userIdx: 3 },
  ];

  /** Tech / product stock photos (Pexels CDN). Prior Unsplash IDs were invalid (imgix 404). */
  const PEX = 'auto=compress&cs=tinysrgb&w=900&h=675&fit=crop';
  const pexelsUrl = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${PEX}`;
  const listingImageIds = [
    1029757, 1229861, 1334597, 2582930, 2582931, 2582932, 2582933, 2582934, 2582935, 2582936, 2582937,
    2582938, 2582939, 2583050, 2583100, 258846, 2588757, 2588758, 261662, 265667, 356056, 442150, 442329,
    442576, 450035, 4523028, 5082289, 5082303, 5082331, 5082345, 5082352, 5082366, 5082373, 5082380,
    5082394, 5082408, 5082415, 5082422, 5082429, 5082436, 5082443, 5082450, 5082457, 5082464, 5082478,
    5082485, 5082499, 5082506, 5082513, 5082520, 5082527, 5082541, 5082548, 5082556, 5082563,
  ];

  if (listingImageIds.length !== listings.length) {
    throw new Error(`listingImageIds (${listingImageIds.length}) must match listings (${listings.length})`);
  }

  const listingImageUrls = listingImageIds.map(pexelsUrl);

  const createdListings: Array<{ id: string; price: number; sellerIdx: number }> = [];

  const now = Date.now();
  for (let i = 0; i < listings.length; i++) {
    const l = listings[i];
    const daysAgo = Math.floor((i / listings.length) * 30);
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    const row = await prisma.listing.create({
      data: {
        title: l.title,
        description: l.description,
        condition: l.condition,
        price: l.price,
        negotiable: l.negotiable,
        pincode: l.pincode,
        area: l.area,
        ageYears: l.ageYears,
        hasBill: l.hasBill,
        views: Math.floor(Math.random() * 200) + 10,
        createdAt,
        updatedAt: createdAt,
        userId: userIds[l.userIdx],
        categoryId: catMap[l.categorySlug],
        images: {
          create: [
            { url: listingImageUrls[i], order: 0 },
          ],
        },
      },
    });
    createdListings.push({ id: row.id, price: l.price, sellerIdx: l.userIdx });
    console.log(`  ✓ Listing: ${l.title}`);
  }

  // ── Demo orders (buyer ≠ seller) + listing status + seller sales ─────────
  const seedOrders: Array<{
    listingIdx: number;
    buyerIdx: number;
    status: OrderStatus;
    createdDaysAgo: number;
    notes?: string;
  }> = [
    { listingIdx: 0, buyerIdx: 1, status: OrderStatus.PENDING, createdDaysAgo: 1, notes: 'Meet at PES campus gate Sat 5pm' },
    { listingIdx: 1, buyerIdx: 2, status: OrderStatus.CONFIRMED, createdDaysAgo: 4 },
    { listingIdx: 2, buyerIdx: 0, status: OrderStatus.COMPLETED, createdDaysAgo: 18 },
    { listingIdx: 3, buyerIdx: 1, status: OrderStatus.CANCELLED, createdDaysAgo: 9, notes: 'Buyer backed out — family emergency' },
    { listingIdx: 6, buyerIdx: 0, status: OrderStatus.PENDING, createdDaysAgo: 2 },
    { listingIdx: 8, buyerIdx: 2, status: OrderStatus.CONFIRMED, createdDaysAgo: 6 },
    { listingIdx: 10, buyerIdx: 0, status: OrderStatus.COMPLETED, createdDaysAgo: 25 },
    { listingIdx: 13, buyerIdx: 2, status: OrderStatus.PENDING, createdDaysAgo: 1 },
    { listingIdx: 15, buyerIdx: 0, status: OrderStatus.CONFIRMED, createdDaysAgo: 5 },
    { listingIdx: 17, buyerIdx: 1, status: OrderStatus.COMPLETED, createdDaysAgo: 12 },
    { listingIdx: 19, buyerIdx: 6, status: OrderStatus.CANCELLED, createdDaysAgo: 3 },
    { listingIdx: 22, buyerIdx: 3, status: OrderStatus.CONFIRMED, createdDaysAgo: 7 },
    { listingIdx: 28, buyerIdx: 4, status: OrderStatus.COMPLETED, createdDaysAgo: 11 },
    { listingIdx: 34, buyerIdx: 7, status: OrderStatus.PENDING, createdDaysAgo: 0 },
    { listingIdx: 41, buyerIdx: 2, status: OrderStatus.CONFIRMED, createdDaysAgo: 8 },
  ];

  for (const o of seedOrders) {
    if (listings[o.listingIdx].userIdx === o.buyerIdx) {
      throw new Error(`Seed order: listing ${o.listingIdx} seller cannot equal buyer ${o.buyerIdx}`);
    }
  }

  const orderRows: { id: string; buyerIdx: number }[] = [];
  for (const o of seedOrders) {
    const L = createdListings[o.listingIdx];
    const createdAt = new Date(now - o.createdDaysAgo * 24 * 60 * 60 * 1000);
    const serviceExpiresAt = new Date(createdAt);
    serviceExpiresAt.setFullYear(serviceExpiresAt.getFullYear() + 1);

    const ord = await prisma.order.create({
      data: {
        buyerId: userIds[o.buyerIdx],
        listingId: L.id,
        amount: L.price,
        status: o.status,
        notes: o.notes ?? null,
        serviceExpiresAt,
        createdAt,
        updatedAt: createdAt,
      },
    });
    orderRows.push({ id: ord.id, buyerIdx: o.buyerIdx });

    if (o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.COMPLETED) {
      await prisma.listing.update({
        where: { id: L.id },
        data: { status: ListingStatus.SOLD },
      });
      await prisma.user.update({
        where: { id: userIds[L.sellerIdx] },
        data: { totalSales: { increment: 1 } },
      });
    }
  }

  for (const idx of [48, 49]) {
    await prisma.listing.update({
      where: { id: createdListings[idx].id },
      data: { status: ListingStatus.REMOVED },
    });
  }

  // ── Service tickets (buyer = ticket opener) ─────────────────────────────
  const ticketSpecs: Array<{
    orderIdx: number;
    priority: TicketPriority;
    status: TicketStatus;
    subject: string;
    description: string;
    resolution?: string;
    ticketDaysAgo: number;
  }> = [
    {
      orderIdx: 1,
      priority: TicketPriority.HIGH,
      status: TicketStatus.OPEN,
      subject: 'Screen has one dead pixel cluster',
      description: 'Noticed after unboxing at home. Can we arrange a partial refund or repair?',
      ticketDaysAgo: 2,
    },
    {
      orderIdx: 2,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.IN_PROGRESS,
      subject: 'Battery reporting 88% health — expected?',
      description: 'Listing said ~90%. Want to confirm before warranty claim.',
      ticketDaysAgo: 5,
    },
    {
      orderIdx: 6,
      priority: TicketPriority.LOW,
      status: TicketStatus.RESOLVED,
      subject: 'Missing USB-C cable in box',
      description: 'Seller shipped cable next day — all good now.',
      resolution: 'Seller provided tracking; cable received. Closed with buyer confirmation.',
      ticketDaysAgo: 12,
    },
    {
      orderIdx: 8,
      priority: TicketPriority.URGENT,
      status: TicketStatus.OPEN,
      subject: 'Device will not power on after update',
      description: 'Stuck on logo after iOS update. Need escalation.',
      ticketDaysAgo: 1,
    },
    {
      orderIdx: 10,
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.CLOSED,
      subject: 'Invoice for warranty',
      description: 'Needed bill copy for Apple service. Resolved via email.',
      resolution: 'Buyer received PDF invoice from seller.',
      ticketDaysAgo: 20,
    },
    {
      orderIdx: 12,
      priority: TicketPriority.LOW,
      status: TicketStatus.IN_PROGRESS,
      subject: 'Question about included accessories',
      description: 'Does the sale include the original box and stand?',
      ticketDaysAgo: 3,
    },
  ];

  for (const t of ticketSpecs) {
    const ord = orderRows[t.orderIdx];
    const createdAt = new Date(now - t.ticketDaysAgo * 24 * 60 * 60 * 1000);
    await prisma.serviceTicket.create({
      data: {
        orderId: ord.id,
        userId: userIds[ord.buyerIdx],
        subject: t.subject,
        description: t.description,
        status: t.status,
        priority: t.priority,
        resolution: t.resolution ?? null,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  console.log(
    `\n  ✅ Seeded ${categories.length} categories, ${demoUsers.length} users, ${listings.length} listings, ${seedOrders.length} orders, ${ticketSpecs.length} service tickets (2 listings marked REMOVED for admin demo).`,
  );
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
