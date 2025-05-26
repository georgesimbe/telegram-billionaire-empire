#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migration Script: gameStore → integratedGameStore
 * 
 * This script automatically updates imports and basic usage patterns
 * from the old gameStore to the new integratedGameStore.
 */

const MIGRATION_PATTERNS = [
  {
    pattern: /import\s+useGameStore\s+from\s+['"]\.\/store\/gameStore['"];?/g,
    replacement: "import useIntegratedGameStore from './store/integratedGameStore';"
  },
  {
    pattern: /import\s+useGameStore\s+from\s+['"]\.\.\/store\/gameStore['"];?/g,
    replacement: "import useIntegratedGameStore from '../store/integratedGameStore';"
  },
  {
    pattern: /import\s+useGameStore\s+from\s+['"]\.\.\/\.\.\/store\/gameStore['"];?/g,
    replacement: "import useIntegratedGameStore from '../../store/integratedGameStore';"
  },
  {
    pattern: /const\s+(\w+)\s*=\s*useGameStore\(/g,
    replacement: "const $1 = useIntegratedGameStore("
  },
  {
    pattern: /useGameStore\(/g,
    replacement: "useIntegratedGameStore("
  }
];

const DIRECTORIES_TO_MIGRATE = [
  'src/components',
  'src/pages',
  'src/services'
];

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Apply migration patterns
    MIGRATION_PATTERNS.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Migrated: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error migrating ${filePath}:`, error.message);
    return false;
  }
}

function migrateDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return { migrated: 0, total: 0 };
  }

  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  let migrated = 0;
  let total = 0;

  files.forEach(file => {
    const fullPath = path.join(dirPath, file.name);

    if (file.isDirectory()) {
      const subResult = migrateDirectory(fullPath);
      migrated += subResult.migrated;
      total += subResult.total;
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      total++;
      if (migrateFile(fullPath)) {
        migrated++;
      }
    }
  });

  return { migrated, total };
}

function main() {
  console.log('🚀 Starting gameStore → integratedGameStore migration...\n');

  // Change to project root directory
  const projectRoot = path.resolve(__dirname, '..');
  process.chdir(projectRoot);

  let totalMigrated = 0;
  let totalFiles = 0;

  DIRECTORIES_TO_MIGRATE.forEach(dir => {
    console.log(`\n📁 Migrating directory: ${dir}`);
    const result = migrateDirectory(dir);
    totalMigrated += result.migrated;
    totalFiles += result.total;
    console.log(`   ${result.migrated}/${result.total} files migrated`);
  });

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Migration complete!`);
  console.log(`📊 Summary: ${totalMigrated}/${totalFiles} files migrated`);

  if (totalMigrated > 0) {
    console.log('\n📝 Next steps:');
    console.log('1. Test the application to ensure everything works');
    console.log('2. Check for any manual migration needs');
    console.log('3. Update any remaining legacy method calls');
    console.log('4. Run your test suite');
  }

  console.log('\n⚠️  Manual review recommended for:');
  console.log('- Complex state manipulations');
  console.log('- Custom hooks using the store');
  console.log('- Error handling patterns');
}

// Run the migration
main();

export { migrateFile, migrateDirectory, MIGRATION_PATTERNS }; 