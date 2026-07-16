require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const globalFetch = fetch;
supabase.realtime = null;

async function fix() {
  const { data, error } = await supabase
    .from('hero_banners')
    .update({ media_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Google Sample Video' })
    .eq('title', 'Vídeo Provisório Apple');
  console.log('Fixed', error);
}
fix();
