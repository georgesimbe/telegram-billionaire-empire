const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Skip Supabase in development mode if not configured
if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey)) {
  const logger = require('../utils/logger');
  logger.warn('Supabase not configured - running in development mode without database');

  // Create mock clients for development
  const mockClient = {
    from: () => ({
      select: () => ({ single: () => ({ data: null, error: { code: 'PGRST116' } }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: { id: 'dev-user' }, error: null }) }) }),
      update: () => ({ eq: () => ({ data: null, error: null }) })
    })
  };

  module.exports = {
    supabase: mockClient,
    supabaseAdmin: mockClient,
    testConnection: async () => {
      logger.info('✅ Development mode - Supabase mocked');
      return true;
    }
  };
  return;
}

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  logger.error('Missing Supabase configuration. Please check your environment variables.');
  process.exit(1);
}

// Create Supabase clients
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      throw error;
    }

    logger.info('✅ Supabase connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Supabase connection failed:', error.message);
    logger.error('Error details:', error);
    return false;
  }
};

module.exports = {
  supabase: supabaseClient,
  supabaseAdmin,
  testConnection
}; 