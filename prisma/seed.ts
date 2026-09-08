import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@lifepilot.ai' },
    update: {},
    create: {
      email: 'demo@lifepilot.ai',
      name: 'Demo User',
      passwordHash,
      role: 'USER',
    },
  })

  const now = new Date()

  const reminders = [
    { title: 'Overdue Bill', dueDate: new Date(now.getTime() - 86400000 * 2), category: 'BILL', priority: 'HIGH' },
    { title: 'Today Task', dueDate: now, category: 'GENERAL', priority: 'MEDIUM' },
    { title: 'This Week Subscription', dueDate: new Date(now.getTime() + 86400000 * 2), category: 'SUBSCRIPTION', priority: 'LOW' },
    { title: 'Later Warranty', dueDate: new Date(now.getTime() + 86400000 * 10), category: 'WARRANTY', priority: 'MEDIUM' },
  ]

  for (const r of reminders) {
    await prisma.reminder.create({
      data: {
        title: r.title,
        dueDate: r.dueDate,
        category: r.category as any,
        priority: r.priority as any,
        userId: user.id,
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
