import { createClient } from '@/lib/supabase/server';
import { getUserInvoices } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('User error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Simply return the response from getUserInvoices
    return getUserInvoices(user.id);

  } catch (error) {
    console.error('Error in get-invoices:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Error fetching invoices' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}