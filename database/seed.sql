INSERT INTO categories (name, slug, description) VALUES
  ('Groceries', 'groceries', 'Daily staples and household essentials'),
  ('Bakery', 'bakery', 'Fresh breads, cakes, and snacks'),
  ('Pharmacy', 'pharmacy', 'Wellness and personal care'),
  ('Fashion', 'fashion', 'Clothing and seasonal picks')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO business_profiles (
  business_name,
  tagline,
  about,
  phone,
  email,
  address,
  whatsapp_number,
  maps_embed_url,
  hero_title,
  hero_subtitle
) VALUES (
  'FreshMart Local',
  'Groceries, bakery, daily essentials, and quick WhatsApp ordering.',
  'FreshMart Local helps nearby families shop faster with fresh stock, visible offers, and simple order pickup.',
  '+91 98765 43210',
  'hello@freshmart.local',
  'Market Road, Your City',
  '919876543210',
  'https://www.google.com/maps?q=India&output=embed',
  'Fresh everyday essentials from your local store',
  'Browse popular products, grab limited offers, and send your order straight to WhatsApp.'
);

