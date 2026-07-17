import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Event from "../models/Event.js";

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const events = [
  {
    title: "Neon Pulse Music Festival",
    category: "Music",
    venue: { name: "Griffith Park, LA", address: "4730 Crystal Springs Dr, Los Angeles, CA" },
    eventDate: "2026-07-18T18:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
    ticketTiers: [{ name: "General Admission", price: 45, totalCapacity: 1500, remainingCapacity: 1240 }],
    computedBadge: "trending",
    inviteOnly: false,
    organizer: "Pulse Collective",
    description:
      "Three stages, twelve acts, and one night under the LA sky. Neon Pulse brings together the city's best electronic and indie acts for an open-air festival with immersive light installations and local food vendors on-site.",
  },
  {
    title: "BuildFuture Tech Summit 2026",
    category: "Tech",
    venue: { name: "Moscone Center, SF", address: "747 Howard St, San Francisco, CA" },
    eventDate: "2026-07-22T09:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    ticketTiers: [{ name: "General Admission", price: 120, totalCapacity: 4000, remainingCapacity: 3800 }],
    computedBadge: "selling_fast",
    inviteOnly: false,
    organizer: "BuildFuture Media",
    description:
      "A full day of keynotes and workshops from founders and engineers shaping the next generation of software. Tracks cover AI infrastructure, developer tooling, and scaling engineering teams, with a startup showcase running throughout the venue.",
  },
  {
    title: "Night Market & Street Food Crawl",
    category: "Food & Drink",
    venue: { name: "Brooklyn Navy Yard, NY", address: "63 Flushing Ave, Brooklyn, NY" },
    eventDate: "2026-07-25T17:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    ticketTiers: [{ name: "General Admission", price: 0, totalCapacity: 800, remainingCapacity: 620 }],
    computedBadge: null,
    inviteOnly: false,
    organizer: "NYC Night Markets",
    description:
      "Forty vendors, live music, and a beer garden take over the Navy Yard for an evening of street food from across the city. Free entry, cash and card accepted at every stall.",
  },
  {
    title: "Abstract Futures — Group Show",
    category: "Art",
    venue: { name: "The Shed, New York", address: "545 W 30th St, New York, NY" },
    eventDate: "2026-08-01T11:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
    ticketTiers: [{ name: "General Admission", price: 18, totalCapacity: 450, remainingCapacity: 390 }],
    computedBadge: "popular",
    inviteOnly: false,
    organizer: "The Shed",
    description:
      "A group exhibition featuring emerging abstract painters and sculptors exploring themes of memory and technology. Gallery talks run hourly, with the artists in attendance for the opening.",
  },
  {
    title: "City Night Relay 5K",
    category: "Sports",
    venue: { name: "Millennium Park, Chicago", address: "201 E Randolph St, Chicago, IL" },
    eventDate: "2026-08-03T20:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600",
    ticketTiers: [{ name: "General Admission", price: 30, totalCapacity: 500, remainingCapacity: 210 }],
    computedBadge: "popular",
    inviteOnly: false,
    organizer: "Chicago Runners Club",
    description:
      "A lit-up 5K relay through downtown Chicago, run in teams of four under the skyline at night. Entry includes a race tee, finisher medal, and after-party at the park pavilion.",
  },
  {
    title: "Founders' Circle Dinner",
    category: "Networking",
    venue: { name: "The Battery, San Francisco", address: "717 Battery St, San Francisco, CA" },
    eventDate: "2026-08-05T19:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600",
    ticketTiers: [{ name: "General Admission", price: 200, totalCapacity: 40, remainingCapacity: 24 }],
    computedBadge: null,
    inviteOnly: true,
    organizer: "The Battery",
    description:
      "An invite-only seated dinner for early-stage founders and select investors, with a moderated conversation over a five-course menu. Attendance is capped at forty guests to keep the room intimate.",
  },
  {
    title: "Late Night Stand-Up Showcase",
    category: "Comedy",
    venue: { name: "The Fillmore, San Francisco", address: "1805 Geary Blvd, San Francisco, CA" },
    eventDate: "2026-07-16T22:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600",
    ticketTiers: [{ name: "General Admission", price: 25, totalCapacity: 200, remainingCapacity: 88 }],
    computedBadge: "tonight",
    inviteOnly: false,
    organizer: "Fillmore Comedy Nights",
    description:
      "A late-night lineup of six touring comedians closing out with a headliner set. Doors open at 9:30, seating is general admission, and the bar stays open through the show.",
  },
  {
    title: "Midnight Warehouse Set",
    category: "Music",
    venue: { name: "Bushwick, Brooklyn", address: "17 Meadow St, Brooklyn, NY" },
    eventDate: "2026-07-19T23:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600",
    ticketTiers: [{ name: "General Admission", price: 35, totalCapacity: 600, remainingCapacity: 150 }],
    computedBadge: "popular",
    inviteOnly: false,
    organizer: "Warehouse Collective",
    description:
      "An underground techno set running until sunrise in a converted Bushwick warehouse, with a rotating lineup of local and touring DJs across two rooms.",
  },
];

async function upsertUser({ name, email, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { email },
    { name, email, password: hashedPassword, role },
    { upsert: true, returnDocument: "after" },
  );
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB — seeding...");

  await upsertUser({
    name: "Admin",
    email: "admin@negarit.events",
    password: "admin123",
    role: "admin",
  });
  await upsertUser({
    name: "Demo Customer",
    email: "customer@negarit.events",
    password: "customer123",
    role: "customer",
  });

  const organizerCache = new Map();
  async function getOrganizer(name) {
    if (organizerCache.has(name)) return organizerCache.get(name);
    const email = `${slugify(name)}@negarit.events`;
    const user = await upsertUser({ name, email, password: "organizer123", role: "organizer" });
    organizerCache.set(name, user);
    return user;
  }

  await Event.deleteMany({});

  for (const e of events) {
    const organizer = await getOrganizer(e.organizer);
    await Event.create({
      organizerId: organizer._id,
      title: e.title,
      description: e.description,
      category: e.category,
      venue: e.venue,
      eventDate: e.eventDate,
      coverImageUrl: e.coverImageUrl,
      inviteOnly: e.inviteOnly,
      status: "approved",
      computedBadge: e.computedBadge,
      ticketTiers: e.ticketTiers,
    });
  }

  console.log(`Seeded ${events.length} approved events and ${organizerCache.size} organizer accounts.`);
  console.log("Login with admin@negarit.events / admin123 or customer@negarit.events / customer123 (password for any seeded organizer: organizer123).");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
