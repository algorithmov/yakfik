-- Run this in your Supabase SQL editor (once per project).
-- Tables are shared; data is scoped per app by app_id / source_app.

-- ─────────────────────────────────────────────────
-- 1. RESTAURANTS
-- ─────────────────────────────────────────────────
create table if not exists restaurants (
  id          uuid primary key default gen_random_uuid(),
  app_id      text not null,          -- 'talabat' | 'snoonu'
  name        text not null,
  cuisine     text not null,
  rating      numeric(2,1) not null default 4.0
);

-- ─────────────────────────────────────────────────
-- 2. MENU ITEMS
-- ─────────────────────────────────────────────────
create table if not exists menu_items (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  price         numeric(8,2) not null,
  eta_minutes   int not null default 30
);

-- ─────────────────────────────────────────────────
-- 3. DEALS
-- ─────────────────────────────────────────────────
create table if not exists deals (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  description   text not null,
  discount_pct  numeric(5,2) not null default 0,
  active        boolean not null default true
);

-- ─────────────────────────────────────────────────
-- 4. ORDERS
-- ─────────────────────────────────────────────────
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null,
  restaurant_id uuid not null references restaurants(id),
  item_id       uuid not null references menu_items(id),
  total_price   numeric(8,2) not null,
  source_app    text not null,         -- 'talabat' | 'snoonu'
  status        text not null default 'confirmed',
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────
-- 5. SEED DATA — Talabat (app_id = 'talabat')
-- ─────────────────────────────────────────────────
do $$
declare
  r_alreef   uuid;
  r_bella    uuid;
  r_stack    uuid;
begin
  -- Only seed if no talabat restaurants yet
  if not exists (select 1 from restaurants where app_id = 'talabat') then

    insert into restaurants (app_id, name, cuisine, rating)
    values ('talabat', 'Al Reef Lebanese', 'Lebanese', 4.6)
    returning id into r_alreef;

    insert into restaurants (app_id, name, cuisine, rating)
    values ('talabat', 'Bella Napoli', 'Italian', 4.4)
    returning id into r_bella;

    insert into restaurants (app_id, name, cuisine, rating)
    values ('talabat', 'Stack House', 'American', 4.3)
    returning id into r_stack;

    -- Menu items
    insert into menu_items (restaurant_id, name, price, eta_minutes) values
      (r_alreef, 'Chicken Shawarma',  18.00, 25),
      (r_alreef, 'Beef Shawarma',     22.00, 25),
      (r_alreef, 'Falafel Wrap',      12.00, 20),
      (r_bella,  'Margherita Pizza',  35.00, 35),
      (r_bella,  'Pepperoni Pizza',   42.00, 35),
      (r_stack,  'Chicken Burger',    28.00, 30),
      (r_stack,  'Smash Burger',      32.00, 30);

    -- Deals
    insert into deals (restaurant_id, description, discount_pct, active) values
      (r_alreef, '20% off all wraps',          20, true),
      (r_stack,  'Free drink with any burger',  0, true);

  end if;
end $$;

-- ─────────────────────────────────────────────────
-- 6. SEED DATA — Snoonu (app_id = 'snoonu')
--    Deliberately different prices/etas to make comparison meaningful
-- ─────────────────────────────────────────────────
do $$
declare
  r_doha    uuid;
  r_palace  uuid;
  r_blvd    uuid;
begin
  if not exists (select 1 from restaurants where app_id = 'snoonu') then

    insert into restaurants (app_id, name, cuisine, rating)
    values ('snoonu', 'Doha Grill House', 'Lebanese', 4.5)
    returning id into r_doha;

    insert into restaurants (app_id, name, cuisine, rating)
    values ('snoonu', 'Pizza Palace', 'Italian', 4.2)
    returning id into r_palace;

    insert into restaurants (app_id, name, cuisine, rating)
    values ('snoonu', 'Burger Boulevard', 'American', 4.4)
    returning id into r_blvd;

    -- Menu items — shawarma cheaper+faster, pizza cheaper+slower, burger cheaper
    insert into menu_items (restaurant_id, name, price, eta_minutes) values
      (r_doha,   'Chicken Shawarma',  15.00, 20),
      (r_doha,   'Mixed Shawarma',    20.00, 20),
      (r_doha,   'Hummus Plate',      14.00, 15),
      (r_palace, 'Margherita Pizza',  30.00, 40),
      (r_palace, 'BBQ Chicken Pizza', 38.00, 40),
      (r_blvd,   'Classic Burger',    25.00, 25),
      (r_blvd,   'Double Smash',      35.00, 28);

    -- Deals
    insert into deals (restaurant_id, description, discount_pct, active) values
      (r_doha,  '15% off shawarma orders', 15, true);

  end if;
end $$;
