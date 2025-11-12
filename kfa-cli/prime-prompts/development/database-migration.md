# Database Migration Prime Prompt

Create database migration following Laravel best practices.

## Usage

```bash
kfa prime use database-migration "Add user_roles table with relationships"
```

## Prompt Template

I need to create the following database migration for KFA:

{CONTEXT}

Please create a Laravel migration following best practices:

1. **Migration Structure**
   - Use descriptive migration name
   - Add up() and down() methods
   - Make migration reversible

2. **Table Definition**
   - Use proper column types
   - Add indexes for foreign keys and searchable fields
   - Define foreign key constraints with cascade rules
   - Add timestamps (created_at, updated_at)
   - Consider soft deletes if applicable

3. **Column Best Practices**
   - Use nullable() where appropriate
   - Add default() values when needed
   - Use enum() for fixed value sets
   - Add unique() constraints
   - Use unsigned() for IDs

4. **Relationships**
   - Define foreign keys properly
   - Add onDelete and onUpdate cascade rules
   - Create pivot tables for many-to-many
   - Name pivot tables alphabetically (e.g., post_user)

5. **Indexes**
   - Add index for foreign keys
   - Add composite indexes for common queries
   - Add unique indexes for unique constraints

6. **Model Updates**
   - Update corresponding Eloquent model
   - Define relationships (hasMany, belongsTo, etc.)
   - Add fillable/guarded properties
   - Add casts for dates/booleans

7. **Seeder (if needed)**
   - Create seeder for initial data
   - Add to DatabaseSeeder

Files to create/update:
- database/migrations/{timestamp}_create_{table}_table.php
- app/Models/{ModelName}.php
- database/seeders/{TableName}Seeder.php

Run after creation:
```bash
kfa db migrate
kfa db seed
```

## Context Files

- database/migrations/ - Existing migrations
- app/Models/ - Existing models

## Expected Output

1. Migration file with up/down methods
2. Updated/new Eloquent model
3. Seeder (if applicable)
4. Documentation of schema

## Success Criteria

- Migration runs successfully
- Migration is reversible (down() works)
- Model relationships defined
- Proper indexes added
- Foreign key constraints work
