import assert from 'node:assert/strict';
import {createAccountHandler} from '../api/accounts.js';
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'public-test'};
const master={id:'master',email:'xrkr80hd@gmail.com',email_confirmed_at:'2026-10-16',app_metadata:{}};
async function run(route,method='GET',body={},cookie='',reply=master,origin='https://wamark.finishmylaunch.com'){
 let calls=0;const handler=createAccountHandler(env,async()=>{calls++;return {ok:true,json:async()=>reply}});const headers={};const res={setHeader:(k,v)=>headers[k]=v,status(n){this.code=n;return this},json(d){this.data=d;return this}};
 await handler({query:{route},method,body,headers:{origin,host:'wamark.finishmylaunch.com',cookie}},res);return {...res,headers,calls};
}
assert.equal((await run('me')).code,401);
assert.equal((await run('me','GET',{},'wam_cloud_session=valid')).code,200);
assert.equal((await run('login','POST',{email:master.email,password:'test'},'',{user:master,access_token:'valid',expires_in:3600})).headers['Set-Cookie'].includes('HttpOnly; Secure; SameSite=Strict'),true);
assert.equal((await run('login','POST',{},'',{user:{...master,email_confirmed_at:null}})).code,403);
assert.equal((await run('login','POST',{},'',{user:{...master,email:'other@example.com',user_metadata:{wamarket_access:true}}})).code,403);
assert.equal((await run('me','GET',{},'wam_cloud_session=valid',{...master,app_metadata:{wamarket_active:false}})).code,403);
assert.equal((await run('signup','POST',{email:'other@example.com',password:'longpassword'})).calls,0);
assert.equal((await run('signup','POST',{email:master.email,password:'short'})).code,400);
assert.equal((await run('login','POST',{},'',{},'https://evil.example')).code,403);
assert.equal((await run('users','GET',{},'wam_cloud_session=valid')).code,503);
assert.match((await run('logout','POST')).headers['Set-Cookie'],/Max-Age=0/);
console.log('11 cloud authentication boundary checks passed');
