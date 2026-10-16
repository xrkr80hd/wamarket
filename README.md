# Walker Marketing Suite

React / Vite workspace for Walker Automotive.

## Development

Use Node.js 24, then `npm install` and `npm run dev`. The development server runs on port 4173. `npm run build` produces `dist/`.

## Deployment target

- GitHub: xrkr80hd/wamarket
- Branch: wamarket
- Vercel framework: Vite
- Domain: wamarket.xrkr80hd.studio
- Intended Supabase project: supabase-fuchsia-lighthouse

## Current deployment status

This commit contains the working local preview. Account management is available under Team & Settings using the local development service. Production account integration and shared-data migration are still in progress. The Supabase account endpoint is preliminary and is not yet connected to the UI. Do not treat this build as a finished multi-user production deployment.

Local data, credentials, databases, uploaded files, and reference repository downloads are excluded from Git. Existing browser data is not automatically moved to Supabase by deploying this repository.

## Verification

- `node checks/run.mjs`
- `node checks/accounts.mjs`
- `npm run build`
