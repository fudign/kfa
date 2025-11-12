#!/usr/bin/env node
/**
 * Supabase Connection Test Tool
 * Tests connection to Supabase and returns project info
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    JSON.stringify(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const startTime = Date.now();

  try {
    // Test basic connection with a simple query
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

    const responseTime = Date.now() - startTime;

    if (error) {
      console.log(
        JSON.stringify(
          {
            success: false,
            timestamp: new Date().toISOString(),
            supabaseUrl,
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

    // Get project info
    const { data: authData, error: authError } = await supabase.auth.getSession();

    console.log(
      JSON.stringify(
        {
          success: true,
          timestamp: new Date().toISOString(),
          supabaseUrl,
          responseTime: `${responseTime}ms`,
          connected: true,
          projectRef: supabaseUrl.match(/https:\/\/([^.]+)\./)?.[1] || 'unknown',
          authStatus: authError ? 'error' : 'ok',
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
          supabaseUrl,
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

testConnection();
