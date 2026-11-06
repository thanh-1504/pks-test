import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from 'generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD_DEFAULT as string,
    12,
  );
  const userPassword = await bcrypt.hash(
    process.env.USER_PASSWORD_DEFAULT as string,
    12,
  );

  await prisma.user.upsert({
    where: { email: 'adminpks@mail.com' },
    create: {
      fullName: 'Admin PKS',
      email: 'adminpks@mail.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: 'studentpks@mail.com' },
    create: {
      fullName: 'Student PKS',
      email: 'studentpks@mail.com',
      password: userPassword,
      role: Role.STUDENT,
    },
    update: {},
  });

  const courseCount = await prisma.course.count();
  if (courseCount === 0) {
    await prisma.course.createMany({
      data: [
        {
          name: 'Co-op IT Fullstack',
          category: 'Lập trình',
          instructor: 'Dương Nhật Thành',
          description:
            'Thực chiến fullstack với Node.js và React qua dự án thật.',
          tuition: 5000000,
          capacity: 20,
        },
        {
          name: 'MOS Excel Expert',
          category: 'Tin học văn phòng',
          instructor: 'Phan Thị Thanh Hà',
          description:
            'Luyện thi chứng chỉ MOS Excel quốc tế từ cơ bản đến nâng cao.',
          tuition: 1500000,
          capacity: 30,
        },
        {
          name: 'Web chuẩn SEO',
          category: 'Web',
          instructor: 'Võ Hoài Thọ',
          description:
            'Xây dựng website chuẩn SEO với Next.js và tối ưu hiệu năng.',
          tuition: 3500000,
          capacity: 15,
        },
        {
          name: 'Mini-ERP với NestJS',
          category: 'Lập trình',
          instructor: 'Lê Thị Bảo Duyên',
          description: 'Thiết kế hệ thống Mini-ERP',
          tuition: 4500000,
          capacity: 1,
        },
      ],
    });
  }
  console.log('Seed data hoàn tất!!!');
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
