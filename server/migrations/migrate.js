#!/usr/bin/env node

/**
 * Database Migration Runner
 * Automatically runs pending migrations during deployment
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.model('Migration', migrationSchema);

// Get all migration files
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, 'scripts');
  
  if (!fs.existsSync(migrationsDir)) {
    console.log('📁 No migrations directory found, creating...');
    fs.mkdirSync(migrationsDir, { recursive: true });
    return [];
  }
  
  return fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js'))
    .sort(); // Ensure migrations run in order
}

// Run migrations
async function runMigrations() {
  try {
    console.log('🗄️  Starting database migrations...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
    
    // Get all migration files
    const migrationFiles = getMigrationFiles();
    
    if (migrationFiles.length === 0) {
      console.log('📝 No migration files found');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`📋 Found ${migrationFiles.length} migration file(s)`);
    
    // Get applied migrations
    const appliedMigrations = await Migration.find({});
    const appliedNames = appliedMigrations.map(m => m.name);
    
    // Filter pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !appliedNames.includes(file)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations already applied');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`🔄 Running ${pendingMigrations.length} pending migration(s)...`);
    
    // Run each pending migration
    for (const migrationFile of pendingMigrations) {
      console.log(`\n⏳ Running migration: ${migrationFile}`);
      
      try {
        const migrationPath = path.join(__dirname, 'scripts', migrationFile);
        const migration = require(migrationPath);
        
        // Run the migration
        if (typeof migration.up === 'function') {
          await migration.up(mongoose);
          
          // Record migration as applied
          await Migration.create({ name: migrationFile });
          
          console.log(`✅ Migration completed: ${migrationFile}`);
        } else {
          console.log(`⚠️  Migration ${migrationFile} has no 'up' function, skipping`);
        }
      } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`);
        console.error(error);
        throw error; // Stop on first error
      }
    }
    
    console.log('\n✅ All migrations completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Migration process failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
