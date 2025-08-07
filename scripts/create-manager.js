const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating manager user...')

  // Create manager user (replace with your email)
  const manager = await prisma.user.create({
    data: {
      auth0Id: 'akkupratap323@gmail.com', // Using your email as ID for NextAuth
      email: 'akkupratap323@gmail.com',
      name: 'Admin User',
      role: 'MANAGER'
    }
  })

  console.log(`Created manager user: ${manager.email} (ID: ${manager.id})`)
  console.log('Manager user created successfully!')
}

main()
  .catch((e) => {
    console.error('Error creating manager:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })