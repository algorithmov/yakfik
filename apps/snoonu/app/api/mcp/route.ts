import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const APP_ID = 'snoonu';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function buildServer() {
  const server = new McpServer({ name: 'snoonu-mcp', version: '1.0.0' });

  server.tool(
    'search_menu',
    'Search Snoonu menu items by name or type. Returns matching items with price, eta, and restaurant.',
    { query: z.string().describe('Search query, e.g. "shawarma" or "burger"') },
    async ({ query }) => {
      const sb = getSupabase();
      const { data, error } = await sb
        .from('menu_items')
        .select('id, name, price, eta_minutes, restaurants!inner(id, name, cuisine, rating, app_id)')
        .eq('restaurants.app_id', APP_ID)
        .ilike('name', `%${query}%`);

      if (error) {
        return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
      }

      const results = (data ?? []).map((item: any) => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        eta_minutes: item.eta_minutes,
        restaurant_id: item.restaurants.id,
        restaurant: item.restaurants.name,
        cuisine: item.restaurants.cuisine,
        rating: item.restaurants.rating,
        source_app: APP_ID,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  server.tool(
    'get_deals',
    'Get all active deals on Snoonu.',
    {},
    async () => {
      const sb = getSupabase();
      const { data, error } = await sb
        .from('deals')
        .select('id, description, discount_pct, restaurants!inner(id, name, app_id)')
        .eq('active', true)
        .eq('restaurants.app_id', APP_ID);

      if (error) {
        return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
      }

      const results = (data ?? []).map((deal: any) => ({
        deal_id: deal.id,
        description: deal.description,
        discount_pct: deal.discount_pct,
        restaurant_id: deal.restaurants.id,
        restaurant: deal.restaurants.name,
        source_app: APP_ID,
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    },
  );

  server.tool(
    'place_order',
    'Place an order on Snoonu. Returns an order confirmation with order ID.',
    {
      item_id: z.string().describe('The menu item ID to order'),
      restaurant_id: z.string().describe('The restaurant ID'),
      session_id: z.string().describe('Anonymous session identifier for the user'),
    },
    async ({ item_id, restaurant_id, session_id }) => {
      const sb = getSupabase();

      const { data: item, error: itemErr } = await sb
        .from('menu_items')
        .select('id, name, price')
        .eq('id', item_id)
        .single();

      if (itemErr || !item) {
        return { content: [{ type: 'text', text: `Error: item not found — ${itemErr?.message}` }] };
      }

      const { data: order, error: orderErr } = await sb
        .from('orders')
        .insert({
          session_id,
          restaurant_id,
          item_id,
          total_price: item.price,
          source_app: APP_ID,
          status: 'confirmed',
        })
        .select('id, total_price, status, created_at')
        .single();

      if (orderErr || !order) {
        return { content: [{ type: 'text', text: `Error placing order: ${orderErr?.message}` }] };
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            order_id: order.id,
            item: item.name,
            total_price: order.total_price,
            status: order.status,
            source_app: APP_ID,
            placed_at: order.created_at,
          }, null, 2),
        }],
      };
    },
  );

  return server;
}

async function handleRequest(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = buildServer();
  await server.connect(transport);
  const response = await transport.handleRequest(req);
  await server.close();
  return response;
}

export async function GET(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}

export async function DELETE(req: Request) {
  return handleRequest(req);
}
