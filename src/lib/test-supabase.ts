import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('leaderboard')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection failed:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('Supabase connection successful!')
    return {
      success: true,
      message: 'Connection established successfully'
    }
  } catch (error) {
    console.error('Unexpected error testing Supabase:', error)
    return {
      success: false,
      error: 'Unexpected error',
      details: error
    }
  }
}

export async function testLeaderboardOperations() {
  try {
    console.log('Testing leaderboard operations...')
    
    // Test insert
    const testEntry = {
      player_name: 'Test Player',
      total_time: 60000, // 1 minute
      task_times: { '1': 30000, '2': 30000 },
      completed_at: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('leaderboard')
      .insert([testEntry])
      .select()
      .single()
    
    if (insertError) {
      console.error('Insert test failed:', insertError)
      return {
        success: false,
        error: 'Insert failed',
        details: insertError
      }
    }
    
    console.log('Insert test successful:', insertData)
    
    // Test select
    const { data: selectData, error: selectError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('id', insertData.id)
    
    if (selectError) {
      console.error('Select test failed:', selectError)
      return {
        success: false,
        error: 'Select failed',
        details: selectError
      }
    }
    
    console.log('Select test successful:', selectData)
    
    // Clean up test data
    const { error: deleteError } = await supabase
      .from('leaderboard')
      .delete()
      .eq('id', insertData.id)
    
    if (deleteError) {
      console.error('Cleanup failed:', deleteError)
    } else {
      console.log('Test data cleaned up successfully')
    }
    
    return {
      success: true,
      message: 'All leaderboard operations working correctly'
    }
  } catch (error) {
    console.error('Unexpected error testing leaderboard operations:', error)
    return {
      success: false,
      error: 'Unexpected error',
      details: error
    }
  }
}

// Function to run all tests
export async function runAllTests() {
  console.log('=== Starting Supabase Tests ===')
  
  const connectionTest = await testSupabaseConnection()
  if (!connectionTest.success) {
    console.error('Connection test failed:', connectionTest.error)
    return false
  }
  
  const operationsTest = await testLeaderboardOperations()
  if (!operationsTest.success) {
    console.error('Operations test failed:', operationsTest.error)
    return false
  }
  
  console.log('=== All tests passed! ===')
  return true
}
