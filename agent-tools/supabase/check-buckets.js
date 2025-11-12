#!/usr/bin/env node
/**
 * Supabase Storage Buckets Check Tool
 * Lists all storage buckets and their status
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    JSON.stringify(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBuckets() {
  const startTime = Date.now();

  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();

    const responseTime = Date.now() - startTime;

    if (error) {
      console.log(
        JSON.stringify(
          {
            success: false,
            timestamp: new Date().toISOString(),
            responseTime: `${responseTime}ms`,
            error: error.message,
            errorDetails: error,
          },
          null,
          2,
        ),
      );
      process.exit(1);
    }

    // Check expected buckets for KFA
    const expectedBuckets = ['media', 'documents', 'avatars'];
    const foundBuckets = buckets.map((b) => b.name);
    const missingBuckets = expectedBuckets.filter((name) => !foundBuckets.includes(name));

    // Get details for each bucket
    const bucketDetails = await Promise.all(
      buckets.map(async (bucket) => {
        const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list('', { limit: 1 });

        return {
          name: bucket.name,
          id: bucket.id,
          public: bucket.public,
          hasFiles: !filesError && files && files.length > 0,
          createdAt: bucket.created_at,
        };
      }),
    );

    console.log(
      JSON.stringify(
        {
          success: true,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          totalBuckets: buckets.length,
          buckets: bucketDetails,
          expectedBuckets,
          missingBuckets,
          allExpectedBucketsPresent: missingBuckets.length === 0,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  } catch (err) {
    const responseTime = Date.now() - startTime;
    console.error(
      JSON.stringify(
        {
          success: false,
          timestamp: new Date().toISOString(),
          responseTime: `${responseTime}ms`,
          error: err.message,
          stack: err.stack,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}

checkBuckets();
