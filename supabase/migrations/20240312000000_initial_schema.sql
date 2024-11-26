-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  address text,
  city text,
  state text,
  zip_code text,
  role text default 'user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  frame jsonb not null,
  size jsonb not null,
  image_url text not null,
  total_price numeric not null,
  status text default 'pending',
  shipping_address jsonb not null,
  assigned_vendor_id uuid references vendors(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create vendors table
create table vendors (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  status text default 'active',
  username text unique not null,
  password text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Set up row level security (RLS)
alter table profiles enable row level security;
alter table orders enable row level security;
alter table vendors enable row level security;

-- Create policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Vendors can view assigned orders"
  on orders for select
  using (auth.uid()::text = assigned_vendor_id::text);

create policy "Admins can view all orders"
  on orders for all
  using (exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can manage vendors"
  on vendors for all
  using (exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  ));

-- Function to handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, email)
  values (new.id, '', '', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();