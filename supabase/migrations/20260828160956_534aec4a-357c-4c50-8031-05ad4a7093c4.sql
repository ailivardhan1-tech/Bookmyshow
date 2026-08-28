-- ============ CATALOGUE (public read) ============
CREATE TABLE public.titles (
  id text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('movie','event')),
  category text NOT NULL,
  name text NOT NULL,
  poster_key text NOT NULL,
  backdrop_key text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  formats text[] NOT NULL DEFAULT '{}',
  rating numeric(3,1) NOT NULL DEFAULT 0,
  votes text NOT NULL DEFAULT '0',
  certification text NOT NULL DEFAULT 'U',
  duration text NOT NULL DEFAULT '',
  release_label text NOT NULL DEFAULT '',
  genres text[] NOT NULL DEFAULT '{}',
  synopsis text NOT NULL DEFAULT '',
  venue text,
  date_label text,
  price_from integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.titles TO anon;
GRANT SELECT ON public.titles TO authenticated;
GRANT ALL ON public.titles TO service_role;
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Titles are publicly readable" ON public.titles FOR SELECT USING (true);

CREATE TABLE public.cast_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_id text NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  initials text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.cast_members TO anon;
GRANT SELECT ON public.cast_members TO authenticated;
GRANT ALL ON public.cast_members TO service_role;
ALTER TABLE public.cast_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cast is publicly readable" ON public.cast_members FOR SELECT USING (true);

CREATE TABLE public.theaters (
  id text PRIMARY KEY,
  name text NOT NULL,
  area text NOT NULL,
  distance text NOT NULL DEFAULT '',
  cancellable boolean NOT NULL DEFAULT true,
  amenities text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.theaters TO anon;
GRANT SELECT ON public.theaters TO authenticated;
GRANT ALL ON public.theaters TO service_role;
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Theaters are publicly readable" ON public.theaters FOR SELECT USING (true);

CREATE TABLE public.shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theater_id text NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  time_label text NOT NULL,
  format text NOT NULL,
  status text NOT NULL CHECK (status IN ('available','filling','almost')),
  price integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.shows TO anon;
GRANT SELECT ON public.shows TO authenticated;
GRANT ALL ON public.shows TO service_role;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shows are publicly readable" ON public.shows FOR SELECT USING (true);

CREATE TABLE public.fnb_items (
  id text PRIMARY KEY,
  category text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer NOT NULL,
  emoji text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.fnb_items TO anon;
GRANT SELECT ON public.fnb_items TO authenticated;
GRANT ALL ON public.fnb_items TO service_role;
ALTER TABLE public.fnb_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Snacks are publicly readable" ON public.fnb_items FOR SELECT USING (true);

CREATE TABLE public.coupons (
  code text PRIMARY KEY,
  label text NOT NULL,
  discount integer NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.coupons TO anon;
GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active coupons are publicly readable" ON public.coupons FOR SELECT USING (active);

CREATE TABLE public.seat_tiers (
  name text PRIMARY KEY,
  price integer NOT NULL,
  seat_rows text[] NOT NULL,
  cols integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.seat_tiers TO anon;
GRANT SELECT ON public.seat_tiers TO authenticated;
GRANT ALL ON public.seat_tiers TO service_role;
ALTER TABLE public.seat_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Seat tiers are publicly readable" ON public.seat_tiers FOR SELECT USING (true);

CREATE TABLE public.hero_slides (
  id text PRIMARY KEY,
  title_id text NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  image_key text NOT NULL,
  tag text NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero slides are publicly readable" ON public.hero_slides FOR SELECT USING (true);

CREATE TABLE public.cities (
  name text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.cities TO anon;
GRANT SELECT ON public.cities TO authenticated;
GRANT ALL ON public.cities TO service_role;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are publicly readable" ON public.cities FOR SELECT USING (true);

-- ============ USER DATA ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ref text NOT NULL UNIQUE,
  title_id text NOT NULL REFERENCES public.titles(id),
  theater_id text NOT NULL,
  theater_name text NOT NULL,
  show_date text NOT NULL,
  show_time text NOT NULL,
  format text NOT NULL,
  screen text NOT NULL DEFAULT 'Audi 3',
  seats jsonb NOT NULL DEFAULT '[]'::jsonb,
  fnb jsonb NOT NULL DEFAULT '{}'::jsonb,
  coupon_code text,
  discount integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  cancelled boolean NOT NULL DEFAULT false,
  booked_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read their own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create their own bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX bookings_user_idx ON public.bookings (user_id, booked_at DESC);

-- Booked seats power the "sold" seat map for everyone on a given show.
CREATE TABLE public.booked_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  title_id text NOT NULL,
  theater_id text NOT NULL,
  show_date text NOT NULL,
  show_time text NOT NULL,
  seat_id text NOT NULL,
  UNIQUE (title_id, theater_id, show_date, show_time, seat_id)
);
GRANT SELECT ON public.booked_seats TO anon;
GRANT SELECT, INSERT, DELETE ON public.booked_seats TO authenticated;
GRANT ALL ON public.booked_seats TO service_role;
ALTER TABLE public.booked_seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Taken seats are publicly readable" ON public.booked_seats
  FOR SELECT USING (true);
CREATE POLICY "Users add seats to their own bookings" ON public.booked_seats
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );
CREATE POLICY "Users release seats from their own bookings" ON public.booked_seats
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_id AND b.user_id = auth.uid())
  );

-- Auto-create a profile row on signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();