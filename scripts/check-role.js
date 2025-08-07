const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'akkupratap323@gmail.com' }
  })
  
  console.log('Your current role:', user?.role)
  console.log('User details:', user)
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })