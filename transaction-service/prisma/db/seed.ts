import { PrismaClient } from '@prisma/client';
import { BcryptUtil } from '../../src/utils';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';

    // Periksa apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        const hashedPassword = (await BcryptUtil.hash('admin123'))!;

        await prisma.user.create({
            data: {
                name: 'Admin',
                email,
                password: hashedPassword,
            },
        });

        console.log('✅ User seeded:', email);
    } else {
        console.log('ℹ️ User already exists:', email);
    }

    // Seed categories
    const categories = [
        { name: 'Makanan' },
        { name: 'Minuman' },
        { name: 'Cemilan' },
    ];

    for (const category of categories) {
        const existingCategory = await prisma.category.findUnique({
            where: { name: category.name },
        });
        if (!existingCategory) {
            await prisma.category.create({ data: category });
            console.log(`✅ Category seeded: ${category.name}`);
        } else {
            console.log(`ℹ️ Category already exists: ${category.name}`);
        }
    }

    // Seed menus
    const menus = [
        { name: 'Nasi Goreng', price: 25000, categoryId: 1 },
        { name: 'Mie Goreng', price: 22000, categoryId: 1 },
        { name: 'Es Teh', price: 5000, categoryId: 2 },
        { name: 'Kopi Susu', price: 18000, categoryId: 2 },
        { name: 'Kentang Goreng', price: 15000, categoryId: 3 },
    ];

    for (const menu of menus) {
        const existingMenu = await prisma.menu.findUnique({
            where: { name: menu.name },
        });
        if (!existingMenu) {
            await prisma.menu.create({ data: menu });
            console.log(`✅ Menu seeded: ${menu.name}`);
        } else {
            console.log(`ℹ️ Menu already exists: ${menu.name}`);
        }
    }
}

main()
    .catch((err) => {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
