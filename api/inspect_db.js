/**
 * Database Structure Inspector
 * Queries the live database for tables, relationships, row counts, and sample data
 */
const { prisma } = require('./src/lib/prisma');

async function inspect() {
    try {
        console.log('=== DATABASE STRUCTURE INSPECTION ===\n');

        // 1. List all tables
        console.log('--- TABLES ---');
        const tables = await prisma.$queryRaw`
            SELECT table_name, 
                   (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') as column_count
            FROM information_schema.tables t 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `;
        tables.forEach(t => console.log(`  📋 ${t.table_name} (${t.column_count} columns)`));

        // 2. Columns for each table
        console.log('\n--- COLUMNS ---');
        for (const table of tables) {
            console.log(`\n  📋 ${table.table_name}:`);
            const columns = await prisma.$queryRaw`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = ${table.table_name}
                ORDER BY ordinal_position;
            `;
            columns.forEach(c => {
                const nullable = c.is_nullable === 'YES' ? '(nullable)' : '(required)';
                const def = c.column_default ? ` [default: ${c.column_default}]` : '';
                console.log(`     - ${c.column_name}: ${c.data_type} ${nullable}${def}`);
            });
        }

        // 3. Foreign keys / Relationships
        console.log('\n--- RELATIONSHIPS (Foreign Keys) ---');
        const fks = await prisma.$queryRaw`
            SELECT 
                tc.table_name AS from_table,
                kcu.column_name AS from_column,
                ccu.table_name AS to_table,
                ccu.column_name AS to_column,
                tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
            ORDER BY tc.table_name;
        `;
        if (fks.length === 0) {
            console.log('  (No foreign keys found)');
        } else {
            fks.forEach(fk => {
                console.log(`  🔗 ${fk.from_table}.${fk.from_column} → ${fk.to_table}.${fk.to_column}`);
            });
        }

        // 4. Indexes
        console.log('\n--- INDEXES ---');
        const indexes = await prisma.$queryRaw`
            SELECT tablename, indexname, indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
            ORDER BY tablename, indexname;
        `;
        indexes.forEach(idx => {
            console.log(`  ⚡ ${idx.tablename}: ${idx.indexname}`);
        });

        // 5. Row counts
        console.log('\n--- ROW COUNTS ---');
        for (const table of tables) {
            const result = await prisma.$queryRawUnsafe(`SELECT count(*) as cnt FROM "public"."${table.table_name}"`);
            console.log(`  📊 ${table.table_name}: ${result[0].cnt} rows`);
        }

        // 6. Sample data (first 3 rows, excluding passwords)
        console.log('\n--- SAMPLE DATA ---');

        // Users (exclude password)
        try {
            const users = await prisma.user.findMany({ take: 5, select: { id: true, email: true, name: true, role: true, createdAt: true } });
            console.log(`\n  👤 Users (${users.length} shown):`);
            users.forEach(u => console.log(`     ${u.role} | ${u.name} | ${u.email} | id: ${u.id.substring(0, 8)}...`));
        } catch (e) { console.log('  (Could not query users)'); }

        // Tasks
        try {
            const tasks = await prisma.task.findMany({ take: 5, select: { id: true, title: true, status: true, priority: true, authorId: true, solverId: true, createdAt: true } });
            console.log(`\n  📝 Tasks (${tasks.length} shown):`);
            tasks.forEach(t => console.log(`     [${t.status}] ${t.title} | priority: ${t.priority} | author: ${t.authorId.substring(0, 8)}...`));
        } catch (e) { console.log('  (Could not query tasks)'); }

        // Notifications
        try {
            const notifs = await prisma.notification.findMany({ take: 5, select: { id: true, message: true, isRead: true, type: true, userId: true, createdAt: true } });
            console.log(`\n  🔔 Notifications (${notifs.length} shown):`);
            notifs.forEach(n => console.log(`     [${n.isRead ? 'read' : 'unread'}] ${n.type} | ${n.message.substring(0, 60)}`));
        } catch (e) { console.log('  (Could not query notifications)'); }

        // 7. Enums
        console.log('\n--- ENUMS ---');
        const enums = await prisma.$queryRaw`
            SELECT t.typname AS enum_name, 
                   string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS values
            FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            GROUP BY t.typname
            ORDER BY t.typname;
        `;
        enums.forEach(en => console.log(`  🏷️  ${en.enum_name}: ${en.values}`));

        console.log('\n=== INSPECTION COMPLETE ===');
    } catch (error) {
        console.error('Inspection failed:', error.message);
        console.error(error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

inspect();
