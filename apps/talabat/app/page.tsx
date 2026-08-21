import { supabase } from '../lib/supabase';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  eta_minutes: number;
  restaurants: { name: string; cuisine: string; rating: number } | null;
};

type Deal = {
  id: string;
  description: string;
  discount_pct: number;
  restaurant_id: string;
  restaurants: { name: string } | null;
};

async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('id, name, price, eta_minutes, restaurants!inner(name, cuisine, rating)')
    .eq('restaurants.app_id', 'talabat')
    .order('name');

  if (error || !data?.length) {
    // Static fallback for Phase 1 testing before DB is seeded
    return [
      { id: '1', name: 'Chicken Shawarma', price: 18, eta_minutes: 25, restaurants: { name: 'Al Reef Lebanese', cuisine: 'Lebanese', rating: 4.6 } },
      { id: '2', name: 'Beef Shawarma', price: 22, eta_minutes: 25, restaurants: { name: 'Al Reef Lebanese', cuisine: 'Lebanese', rating: 4.6 } },
      { id: '3', name: 'Falafel Wrap', price: 12, eta_minutes: 20, restaurants: { name: 'Al Reef Lebanese', cuisine: 'Lebanese', rating: 4.6 } },
      { id: '4', name: 'Margherita Pizza', price: 35, eta_minutes: 35, restaurants: { name: 'Bella Napoli', cuisine: 'Italian', rating: 4.4 } },
      { id: '5', name: 'Pepperoni Pizza', price: 42, eta_minutes: 35, restaurants: { name: 'Bella Napoli', cuisine: 'Italian', rating: 4.4 } },
      { id: '6', name: 'Chicken Burger', price: 28, eta_minutes: 30, restaurants: { name: 'Stack House', cuisine: 'American', rating: 4.3 } },
      { id: '7', name: 'Smash Burger', price: 32, eta_minutes: 30, restaurants: { name: 'Stack House', cuisine: 'American', rating: 4.3 } },
    ];
  }
  return data as unknown as MenuItem[];
}

async function getDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('id, description, discount_pct, restaurant_id, restaurants!inner(name)')
    .eq('active', true)
    .eq('restaurants.app_id', 'talabat');

  if (error || !data?.length) {
    return [
      { id: 'd1', description: '20% off all wraps', discount_pct: 20, restaurant_id: 'r1', restaurants: { name: 'Al Reef Lebanese' } },
      { id: 'd2', description: 'Free drink with any burger', discount_pct: 0, restaurant_id: 'r3', restaurants: { name: 'Stack House' } },
    ];
  }
  return data as unknown as Deal[];
}

// Group items by restaurant
function groupByRestaurant(items: MenuItem[]) {
  const map = new Map<string, { info: { name: string; cuisine: string; rating: number }; items: MenuItem[] }>();
  for (const item of items) {
    const restName = item.restaurants?.name ?? 'Unknown';
    if (!map.has(restName)) {
      map.set(restName, { info: item.restaurants ?? { name: restName, cuisine: '', rating: 0 }, items: [] });
    }
    map.get(restName)!.items.push(item);
  }
  return map;
}

export default async function TalabatPage() {
  const [items, deals] = await Promise.all([getMenuItems(), getDeals()]);
  const restaurants = groupByRestaurant(items);
  const dealRestaurantIds = new Set(deals.map((d) => d.restaurants?.name));

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 48px' }}>
      {/* Header */}
      <header style={{
        background: 'var(--brand)',
        color: '#fff',
        padding: '20px 24px',
        margin: '0 -16px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>
          🍔 Talabat
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>Food delivery across Qatar</div>
      </header>

      {/* Active deals banner */}
      {deals.length > 0 && (
        <section style={{
          background: '#fff3f0',
          border: '1px solid #ffd0c4',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🔥 Active Deals
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deals.map((deal) => (
              <div key={deal.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <span className="deal-badge">{deal.discount_pct > 0 ? `-${deal.discount_pct}%` : 'DEAL'}</span>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{deal.description}</span>
                <span style={{ color: 'var(--muted)', marginLeft: 'auto' }}>@ {deal.restaurants?.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Restaurant + menu list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[...restaurants.entries()].map(([restName, { info, items: restItems }]) => (
          <section key={restName} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            {/* Restaurant header */}
            <div style={{
              background: dealRestaurantIds.has(restName) ? '#fff3f0' : 'var(--bg)',
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{info.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{info.cuisine}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {dealRestaurantIds.has(restName) && <span className="deal-badge">Deal</span>}
                <div style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 600 }}>⭐ {info.rating}</div>
              </div>
            </div>

            {/* Menu items */}
            <div>
              {restItems.map((item, idx) => (
                <div key={item.id} style={{
                  padding: '14px 20px',
                  borderBottom: idx < restItems.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--text)' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>⏱ {item.eta_minutes} min</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--brand)', whiteSpace: 'nowrap' }}>
                    {item.price} QAR
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: 'var(--muted)' }}>
        Mock app — part of Yakfik demo
      </footer>
    </div>
  );
}
