const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with initial organizations...')

  // Create sample organizations
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        name: 'St. Mary\'s Hospital',
        address: '123 Healthcare Ave, Medical District',
        latitude: 40.7589,
        longitude: -73.9851,
        radiusKm: 0.5 // 500 meters
      }
    }),
    prisma.organization.create({
      data: {
        name: 'Community Health Center',
        address: '456 Wellness Blvd, Downtown',
        latitude: 40.7614,
        longitude: -73.9776,
        radiusKm: 0.3 // 300 meters
      }
    }),
    prisma.organization.create({
      data: {
        name: 'Riverside Medical Clinic',
        address: '789 River Road, Riverside',
        latitude: 40.7505,
        longitude: -73.9934,
        radiusKm: 0.4 // 400 meters
      }
    })
  ])

  console.log('Created organizations:')
  organizations.forEach(org => {
    console.log(`- ${org.name} (ID: ${org.id})`)
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })