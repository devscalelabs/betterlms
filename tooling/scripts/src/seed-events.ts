import { prisma } from "@betterlms/database";

// Generate dynamic dates
const now = new Date();
const futureEvents = [
  {
    title: "React Conference 2024",
    description: "Join us for the biggest React conference of the year with talks from industry experts, workshops, and networking opportunities.",
    type: "ONLINE" as const,
    daysAhead: 3,
    url: "https://reactconf2024.dev",
    city: null,
    address: null,
  },
  {
    title: "JavaScript Meetup - San Francisco",
    description: "Monthly JavaScript meetup featuring talks on modern JS frameworks, best practices, and community projects.",
    type: "OFFLINE" as const,
    daysAhead: 7,
    url: null,
    city: "San Francisco",
    address: "123 Tech Street, San Francisco, CA 94105",
  },
  {
    title: "TypeScript Workshop for Beginners",
    description: "Hands-on workshop covering TypeScript fundamentals, types, interfaces, and practical applications in real-world projects.",
    type: "ONLINE" as const,
    daysAhead: 14,
    url: "https://workshop.typescript.dev/beginners",
    city: null,
    address: null,
  },
];

const pastEvents = [
  {
    title: "Node.js Summit 2024",
    description: "Annual summit dedicated to Node.js ecosystem, featuring talks on performance, scalability, and the latest updates.",
    type: "ONLINE" as const,
    daysAgo: 5,
    url: "https://nodejssummit2024.dev",
    city: null,
    address: null,
  },
  {
    title: "Frontend DevOps - New York",
    description: "Explore the intersection of frontend development and DevOps practices. Learn about CI/CD, deployment strategies, and modern tooling.",
    type: "OFFLINE" as const,
    daysAgo: 12,
    url: null,
    city: "New York",
    address: "456 Broadway, New York, NY 10013",
  },
];

// Create the final events array with dynamic dates
const SAMPLE_EVENTS = [
  ...futureEvents.map(event => ({
    title: event.title,
    description: event.description,
    type: event.type,
    date: new Date(now.getTime() + event.daysAhead * 24 * 60 * 60 * 1000),
    url: event.url,
    city: event.city,
    address: event.address,
  })),
  ...pastEvents.map(event => ({
    title: event.title,
    description: event.description,
    type: event.type,
    date: new Date(now.getTime() - event.daysAgo * 24 * 60 * 60 * 1000),
    url: event.url,
    city: event.city,
    address: event.address,
  })),
];

async function seedEvents() {
  console.log("🌱 Seeding events...");

  // Get users for participant assignment
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("❌ No users found. Please run seed:users first.");
    process.exit(1);
  }

  // Create events
  for (const eventData of SAMPLE_EVENTS) {
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        date: eventData.date,
        url: eventData.url,
        city: eventData.city,
        address: eventData.address,
      },
    });

    console.log(`✅ Created event: ${event.title} (${event.type})`);

    // Add random participants to each event
    const participantCount = Math.floor(Math.random() * 5) + 2; // 2-6 participants per event
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const selectedUsers = shuffledUsers.slice(0, participantCount);

    for (const user of selectedUsers) {
      await prisma.eventParticipant.create({
        data: {
          userId: user.id,
          eventId: event.id,
        },
      });

      console.log(`  👤 Added participant: ${user.username} to ${event.title}`);
    }
  }

  console.log("✨ Events seeded successfully!");
}

seedEvents()
  .catch((error) => {
    console.error("❌ Error seeding events:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
