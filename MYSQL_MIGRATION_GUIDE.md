# MySQL Migration Guide for Stage Project

## Overview
This guide will help you migrate from PostgreSQL/Supabase to MySQL for the Stage educational management system.

## Prerequisites

1. **MySQL Server Installation**
   - Install MySQL 8.0 or higher
   - Make sure MySQL service is running
   - Default port should be 3306

2. **Node.js Dependencies**
   - All required packages are already installed
   - `mysql2` and `sequelize` are configured
   - `dotenv` for environment variable management

## Step-by-Step Migration

### 1. Configure Environment Variables

The `.env` file has been created in the `backend` directory with the following settings:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=formation_db
DB_USER=root
DB_PASSWORD=ziadi

# Application Configuration
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
```

**Important**: Update the `DB_PASSWORD` to match your MySQL root password.

### 2. Set Up MySQL Database

Run the automated setup script:

```bash
cd backend
npm run setup-mysql
```

This script will:
- Create the `formation_db` database
- Create all necessary tables with proper relationships
- Insert sample data (grades, specialties, diplomas, etc.)
- Create a default admin account
- Test the Sequelize connection

### 3. Verify Database Setup

After running the setup script, you should see:
- ✓ Connected to MySQL server
- ✓ Database setup completed successfully
- ✓ Sequelize connection established
- Default admin credentials displayed

### 4. Start the Server

```bash
npm start
```

The server will start on port 3001 (configurable in .env).
API documentation will be available at: http://localhost:3001/api-docs

## Key Changes Made

### 1. Database Configuration
- Updated `config/database.js` to use environment variables
- Configured MySQL-specific settings (charset, collation)
- Added proper connection pooling

### 2. Sequelize Models
- All models already support MySQL
- `compte_id` fields are properly set to `allowNull: true`
- Foreign key constraints configured with `SET NULL`

### 3. Database Schema
- Created `mysql_setup.sql` with complete MySQL-compatible schema
- All tables use `InnoDB` engine for better performance
- Proper indexes added for optimization
- UTF8MB4 charset for full Unicode support (including Arabic)

### 4. Sample Data
The setup includes:
- Academic grades (Professeur, Maître Assistant, etc.)
- Training modes (Présentiel, À distance, Mixte)
- Branches (Informatique, Électronique, Mécanique)
- Specialties (Développement Web, Réseaux, etc.)
- Diploma levels (TS, Licence, Master)

## Default Login Credentials

After setup, you can log in with:
- **Username**: admin
- **Password**: password123

## Troubleshooting

### Common Issues

1. **Access Denied Error**
   ```
   ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
   ```
   **Solution**: Update `DB_PASSWORD` in `.env` file with your correct MySQL password

2. **Connection Refused**
   ```
   ECONNREFUSED: Connection refused at 127.0.0.1:3306
   ```
   **Solution**: Make sure MySQL service is running

3. **Port Already in Use**
   ```
   EADDRINUSE: Port 3001 already in use
   ```
   **Solution**: Change `PORT` in `.env` file or stop the service using port 3001

### Manual Database Reset

If you need to reset the database:

```bash
npm run reset-db
```

This will drop and recreate the entire database with fresh sample data.

## Migration from Supabase

### Data Export/Import
If you have existing data in Supabase:

1. Export your data from Supabase using their dashboard or CLI
2. Convert PostgreSQL-specific syntax to MySQL if needed
3. Import data after running the setup script

### Configuration Updates
- Remove Supabase configuration files from `frontend/supabase/`
- Update any direct Supabase API calls in the frontend
- All backend API endpoints remain the same

## Performance Optimization

### Recommended MySQL Settings
Add these to your MySQL configuration (`my.cnf` or `my.ini`):

```ini
[mysqld]
innodb_buffer_pool_size = 256M
max_connections = 100
query_cache_type = 1
query_cache_size = 16M
```

### Indexes
The setup script includes optimized indexes for:
- User lookups (username, email)
- Name searches (French and Arabic)
- Date ranges
- Foreign key relationships

## Security Considerations

1. **Change Default Passwords**
   - Update the admin password after first login
   - Use strong passwords for MySQL users

2. **Environment Variables**
   - Never commit `.env` files to version control
   - Use different secrets for production

3. **Database Permissions**
   - Create dedicated MySQL users for the application
   - Grant only necessary permissions

## Next Steps

1. Update your frontend API base URL if the port changed
2. Test all CRUD operations through the application
3. Import any existing data from your previous database
4. Configure backups for the MySQL database
5. Set up proper logging and monitoring

## Support

If you encounter issues:
1. Check the console output for detailed error messages
2. Verify MySQL service is running
3. Ensure all environment variables are correctly set
4. Review the troubleshooting section above