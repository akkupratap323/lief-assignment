const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Updating organizations with larger radius for testing...')

  // Update all organizations to have a very large radius (100km) for testing
  const updatedOrgs = await prisma.organization.updateMany({
    data: {
      radiusKm: 100.0 // 100km radius - should cover most locations for testing
    }
  })

  console.log(`Updated ${updatedOrgs.count} organizations with 100km radius`)
  
  // Also let's create one organization with global coordinates
  const globalOrg = await prisma.organization.upsert({
    where: {
      name: 'Test Healthcare (Global)'
    },
    update: {
      radiusKm: 1000.0 // 1000km radius for testing
    },
    create: {
      name: 'Test Healthcare (Global)',
      address: 'Anywhere for testing',
      latitude: 0.0,  // Equator
      longitude: 0.0, // Prime Meridian
      radiusKm: 1000.0 // Very large radius
    }
  })

  console.log(`Created/Updated global test organization: ${globalOrg.name}`)
  console.log('Organizations updated successfully - you should now be able to clock in from anywhere!')
}

main()
  .catch((e) => {
    console.error('Error updating organizations:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })