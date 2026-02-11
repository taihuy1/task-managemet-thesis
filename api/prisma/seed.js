const bcrypt = require('bcrypt');
const { prisma } = require('../src/lib/prisma');

const SALT_ROUNDS = 10;

async function main() {
    console.log('Seeding database...');

    // Hash password for all test users
    const hashedPassword = await bcrypt.hash('seed1223', SALT_ROUNDS);

    // Create author users
    const authors = [
        { email: 'prof.vondrak@university.edu', name: 'Prof. Vondrak', role: 'AUTHOR' },
        { email: 'manager.smith@company.com', name: 'Manager Smith', role: 'AUTHOR' }
    ];

    // Create solver users
    const solvers = [
        { email: 'tai.huy@student.edu', name: 'Tai Huy Le', role: 'SOLVER' },
        { email: 'anna.novak@student.edu', name: 'Anna Novak', role: 'SOLVER' },
        { email: 'pavel.kovar@student.edu', name: 'Pavel Kovar', role: 'SOLVER' },
        { email: 'lucie.horova@student.edu', name: 'Lucie Horova', role: 'SOLVER' }
    ];

    let createdUsers = 0;
    let skippedUsers = 0;

    // Upsert authors
    for (const author of authors) {
        const existing = await prisma.user.findUnique({
            where: { email: author.email }
        });

        if (existing) {
            await prisma.user.update({
                where: { email: author.email },
                data: { password: hashedPassword, name: author.name, role: author.role }
            });
            skippedUsers++;
        } else {
            await prisma.user.create({
                data: { ...author, password: hashedPassword }
            });
            createdUsers++;
        }
    }

    // Upsert solvers
    for (const solver of solvers) {
        const existing = await prisma.user.findUnique({
            where: { email: solver.email }
        });

        if (existing) {
            await prisma.user.update({
                where: { email: solver.email },
                data: { password: hashedPassword, name: solver.name, role: solver.role }
            });
            skippedUsers++;
        } else {
            await prisma.user.create({
                data: { ...solver, password: hashedPassword }
            });
            createdUsers++;
        }
    }

    console.log(`Seeding complete!`);
    console.log(`  Created: ${createdUsers} users`);
    console.log(`  Updated: ${skippedUsers} users (password reset)`);
    console.log(`\nTest accounts (all passwords: "seed1223"):`);
    console.log('  Authors: prof.vondrak@university.edu, manager.smith@company.com');
    console.log('  Solvers: tai.huy@student.edu, anna.novak@student.edu, pavel.kovar@student.edu, lucie.horova@student.edu');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
