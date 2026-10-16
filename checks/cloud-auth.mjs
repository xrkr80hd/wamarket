import assert from 'node:assert/strict';
import {createAccountHandler} from '../api/accounts.js';
import {createAdminHandler} from '../supabase/functions/wamarket-admin/core.js';
const master={id:'master',email:'xrkr80hd@gmail.com',email_confirmed_at:'2026-10-16',app_metadata:{}};
const member={id:'member',email:'member@example.com',email_confirmed_at:'2026-10-16',app_metadata:{wamarket_access:true,wamarket_role:'viewer'}};
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'public-test'};
let saved;
const authFetch=async(url,options)=>{const path=new URL(url).pathname;let data;
 if(path.endsWith('/user'))data=options.headers.Authorization==='Bearer master-token'?master:member;
 else if(path.endsWith('/admin/users/member'))data=member;
 else if(path.endsWith('/admin/users')&&options.method==='POST'){saved=JSON.parse(options.body);data={...saved,id:'created'}}
 else if(path.endsWith('/admin/users'))data={users:[master,member]};
 else if(path.endsWith('/token'))data={user:master,access_token:'master-token',expires_in:3600};
 else throw Error('Unexpected call '+url);
 return new Response(JSON.stringify(data),{status:200});
};
const edge=createAdminHandler({...env,SUPABASE_SERVICE_ROLE_KEY:'server-only-test'},authFetch);
const fetcher=(url,o)=>url.includes('/functions/')?edge(new Request(url,o)):authFetch(url,o);
async function run(route,method='GET',body={},cookie='',origin='https://wamark.finishmylaunch.com'){
 const handler=createAccountHandler(env,fetcher),headers={};const res={setHeader:(k,v)=>headers[k]=v,status(n){this.code=n;return this},json(d){this.data=d;return this}};
 await handler({query:{route},method,body,headers:{origin,host:'wamark.finishmylaunch.com',cookie}},res);return {...res,headers};
}
assert.equal((await run('me')).code,401);
assert.equal((await run('me','GET',{},'wam_cloud_session=master-token')).data.user.isAdmin,true);
assert.match((await run('login','POST',{email:master.email,password:'test'})).headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);
assert.equal((await run('login','POST',{},'','https://evil.example')).code,403);
assert.equal((await run('users')).code,401);
assert.equal((await run('users','GET',{},'wam_cloud_session=member-token')).code,403);
assert.equal((await run('users','GET',{},'wam_cloud_session=master-token')).data.users.length,2);
assert.equal((await run('users','POST',{name:'New person',email:'new@example.com',password:'test-password-12',role:'viewer',active:true},'wam_cloud_session=master-token')).code,200);
assert.equal(saved.app_metadata.wamarket_access,true);
assert.equal(saved.email_confirm,true);
assert.equal((await run('users','POST',{name:'Bad',email:'bad@example.com',password:'short',role:'viewer'},'wam_cloud_session=master-token')).code,400);
assert.equal((await run('bootstrap','POST',{setupKey:'wrong',email:master.email,password:'test-password-12'})).code,403);
assert.match((await run('logout','POST')).headers['Set-Cookie'],/Max-Age=0/);
const noAuth=await edge(new Request('https://example.supabase.co/functions/v1/wamarket-admin'));assert.equal(noAuth.status,401);
const unauthorized=await edge(new Request('https://example.supabase.co/functions/v1/wamarket-admin',{headers:{Authorization:'Bearer member-token'}}));assert.equal(unauthorized.status,403);
console.log('15 authentication and user-management checks passed');
