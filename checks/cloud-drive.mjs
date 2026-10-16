import assert from 'node:assert/strict';
process.env.DRIVE_BRIDGE_SECRET='test-bridge-secret-at-least-32-characters';
process.env.SUPABASE_URL='https://example.supabase.co';
process.env.SUPABASE_PUBLISHABLE_KEY='test-public-key';
process.env.GOOGLE_DRIVE_FOLDER_ID='folder-test';
const {seal,unseal,CALLBACK,driveUpload}=await import('../lib/server-drive.js');
const {default:handler}=await import('../api/drive.js');
let encrypted=null,googleCalls=0;
globalThis.fetch=async(url,options={})=>{
 if(url.endsWith('/auth/v1/user'))return Response.json({id:'master',email:options.headers.Authorization==='Bearer master'?'xrkr80hd@gmail.com':'other@example.com',email_confirmed_at:'2026-10-16',app_metadata:{wamarket_access:true}});
 if(url.includes('/functions/')){if(options.method==='POST'){encrypted=JSON.parse(options.body).encrypted;return Response.json({ok:true})}return Response.json({data:encrypted?{encrypted}:null})}
 if(url==='https://oauth2.googleapis.com/token'){googleCalls++;return Response.json({refresh_token:'private-refresh-token',access_token:'private-google-token'})}
 if(url.includes('/upload/drive/'))return new Response('',{headers:{location:'https://www.googleapis.com/upload/test-session'}});
 throw Error('Unexpected request');
};
async function run(route,body,token='master',extra={}){const res={headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(d){this.data=d;return this},redirect(n,to){this.code=n;this.to=to;return this}};await handler({query:{route,...extra.query},method:body?'POST':'GET',body,headers:{origin:'https://wamark.finishmylaunch.com',cookie:extra.cookie||'wam_cloud_session='+token}},res);return res}
const cipher=seal({secret:'private'});assert.equal(unseal(cipher).secret,'private');assert.ok(!cipher.includes('private'));assert.throws(()=>unseal(cipher.slice(0,-3)+'xyz'));
assert.equal((await run('status')).data.connected,false);
assert.equal((await driveUpload('master',{type:'image/png',size:4})),null);
assert.equal((await run('configure',{web:{client_id:'id',client_secret:'secret',redirect_uris:[CALLBACK]}},'other')).code,403);
assert.equal((await run('configure',{web:{client_id:'id',client_secret:'secret',redirect_uris:['https://evil.example']}})).code,400);
assert.equal((await run('configure',{web:{client_id:'id',client_secret:'secret',redirect_uris:[CALLBACK]}})).data.ok,true);
assert.ok(!encrypted.includes('secret'));
const connect=await run('connect');assert.equal(connect.code,302);assert.ok(connect.headers['Set-Cookie'].includes('HttpOnly; Secure; SameSite=Lax'));
const cookie=connect.headers['Set-Cookie'].split(';')[0],state=new URL(connect.to).searchParams.get('state');
const bad=await run('callback',undefined,'master',{cookie,query:{state:'invalid',code:'test'}});assert.equal(bad.code,400);assert.equal(googleCalls,0);
const callback=await run('callback',undefined,'master',{cookie,query:{state,code:'test'}});assert.equal(callback.code,303);
assert.equal((await run('status')).data.connected,true);assert.ok(!JSON.stringify((await run('status')).data).includes('private-refresh-token'));
assert.equal((await driveUpload('master',{name:'test.png',type:'image/png',size:4})).provider,'gdrive');
console.log('16 Google Drive authorization and encryption checks passed');
