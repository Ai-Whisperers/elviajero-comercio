# OAuth Setup Guide — El Viajero

## 1. Set Supabase Auth URLs
Go to https://supabase.com/dashboard/project/qyvokpribmbrosafntqa/auth/url-configuration
Set:
- Site URL: `https://el-viajero.paragu-ai.com`
- Redirect URLs: `https://el-viajero.paragu-ai.com/auth/callback`

## 2. Google OAuth
1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new OAuth 2.0 Client ID (Web application)
3. Authorized redirect URIs: `https://qyvokpribmbrosafntqa.supabase.co/auth/v1/callback`
4. Copy Client ID + Secret
5. Go to Supabase Dashboard → Auth → Providers → Google
6. Enable, paste keys

## 3. Facebook OAuth
1. Go to https://developers.facebook.com
2. Create App → Consumer
3. Add "Facebook Login" product
4. Valid OAuth Redirect URIs: `https://qyvokpribmbrosafntqa.supabase.co/auth/v1/callback`
5. Copy App ID + App Secret
6. Go to Supabase Dashboard → Auth → Providers → Facebook
7. Enable, paste keys

## 4. Test
Visit https://el-viajero.paragu-ai.com/login — click Google/Facebook buttons — should redirect to auth and back.
