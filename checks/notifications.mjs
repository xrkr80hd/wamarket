import assert from 'node:assert/strict';
import {createDecipheriv,diffieHellman,createPrivateKey,createPublicKey,hkdfSync,verify} from 'node:crypto';
import {newVapidKeys,sendWebPush,validSubscription,encode64,decode64} from '../supabase/functions/wamarket-workspace/web-push.js';
import {createWorkspaceHandler} from '../supabase/functions/wamarket-workspace/core.js';
const utf=s=>Buffer.from(s);
const receiver=await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
const receiverRaw=new Uint8Array(await crypto.subtle.exportKey('raw',receiver.publicKey));
const auth=crypto.getRandomValues(new Uint8Array(16));
const subscription={endpoint:'https://fcm.googleapis.com/fcm/send/test-device',keys:{p256dh:encode64(receiverRaw),auth:encode64(auth)}};
const vapid=await newVapidKeys();let request;
assert(validSubscription(subscription));assert(!validSubscription({...subscription,endpoint:'https://localhost/private'}));assert(!validSubscription({...subscription,endpoint:'https://fcm.googleapis.com.evil.example/push'}));assert(!validSubscription({...subscription,endpoint:'http://fcm.googleapis.com/push'}));
const payload={title:'New message',userId:'recipient',id:'one',badge:3};
assert.equal(await sendWebPush(subscription,payload,vapid,async(url,options)=>{request={url,...options};return new Response('',{status:201})}),201);
// Independently decrypt with node:crypto, verifying interoperability of the wire format.
const body=Buffer.from(request.body),salt=body.subarray(0,16),senderRaw=body.subarray(21,21+body[20]),encrypted=body.subarray(21+body[20]);
assert.equal(body.readUInt32BE(16),4096);
const senderJwk={kty:'EC',crv:'P-256',x:encode64(senderRaw.subarray(1,33)),y:encode64(senderRaw.subarray(33))};
const secret=diffieHellman({privateKey:createPrivateKey({key:await crypto.subtle.exportKey('jwk',receiver.privateKey),format:'jwk'}),publicKey:createPublicKey({key:senderJwk,format:'jwk'})});
const ikm=hkdfSync('sha256',secret,auth,Buffer.concat([utf('WebPush: info\0'),Buffer.from(receiverRaw),senderRaw]),32);
const cek=hkdfSync('sha256',ikm,salt,utf('Content-Encoding: aes128gcm\0'),16),nonce=hkdfSync('sha256',ikm,salt,utf('Content-Encoding: nonce\0'),12);
const decipher=createDecipheriv('aes-128-gcm',Buffer.from(cek),Buffer.from(nonce));decipher.setAuthTag(encrypted.subarray(-16));const plain=Buffer.concat([decipher.update(encrypted.subarray(0,-16)),decipher.final()]);assert.equal(plain.at(-1),2);assert.deepEqual(JSON.parse(plain.subarray(0,-1)),payload);
const token=request.headers.Authorization.match(/t=([^,]+),/)[1].split('.');assert(verify('sha256',Buffer.from(token.slice(0,2).join('.')),{key:createPublicKey({key:vapid.privateJwk,format:'jwk'}),dsaEncoding:'ieee-p1363'},decode64(token[2])));assert.equal(JSON.parse(Buffer.from(token[1],'base64url')).aud,'https://fcm.googleapis.com');
const users=[{id:'actor',email:'xrkr80hd@gmail.com',email_confirmed_at:'2026-10-19',app_metadata:{},user_metadata:{name:'Travis'}},...['recipient','outsider'].map(id=>({id,email:id+'@test.invalid',email_confirmed_at:'2026-10-19',app_metadata:{wamarket_access:true,wamarket_role:'coordinator'},user_metadata:{name:id}}))];
const rows=new Map(),integrations=new Map(),personal=new Map();let pushCount=0;
rows.set('private-chat',{id:'private-chat',data:{id:'private-chat',kind:'__conversation',title:'Private',members:['actor','recipient'],privateMembers:['actor','recipient']},version:1});
const fetcher=async(url,o={})=>{
 const u=new URL(url),p=u.pathname,method=o.method||'GET';
 if(u.host==='fcm.googleapis.com'){pushCount++;return new Response('',{status:201})}
 const b=o.body?JSON.parse(o.body):null;
 if(p==='/auth/v1/user')return Response.json(users.find(x=>o.headers.Authorization==='Bearer '+x.id)||{});
 if(p==='/auth/v1/admin/users')return Response.json({users});
 if(p==='/rest/v1/wamarket_presence')return Response.json([]);
 if(p==='/rest/v1/wamarket_dashboards')return Response.json(personal.has(u.searchParams.get('user_id')?.slice(3))?[{data:personal.get(u.searchParams.get('user_id').slice(3))}]:[]);
 if(p==='/rest/v1/wamarket_integrations'){
  const provider=u.searchParams.get('provider');
  if(method==='POST'){if(!integrations.has(b.provider)||!o.headers.Prefer?.includes('ignore'))integrations.set(b.provider,b.data);return Response.json(null)}
  if(method==='DELETE'){integrations.delete(provider.slice(3));return Response.json(null)}
  return Response.json([...integrations].filter(([key])=>!provider||(provider.startsWith('eq.')?key===provider.slice(3):key.startsWith('wam-push:'))).map(([provider,data])=>({provider,data})));
 }
 if(p==='/rest/v1/wamarket_records'){
  if(method==='POST'){if(!rows.has(b.id)||!o.headers.Prefer?.includes('ignore'))rows.set(b.id,b);return Response.json([rows.get(b.id)])}
  const id=u.searchParams.get('id')?.slice(3);
  if(method==='PATCH'){const old=rows.get(id);if(old?.version!==Number(u.searchParams.get('version').slice(3)))return Response.json([]);const row={...old,...b};rows.set(id,row);return Response.json([row])}
  const kind=u.searchParams.get('data->>kind'),member=u.searchParams.get('data->privateMembers');
  return Response.json([...rows.values()].filter(r=>(!id||r.id===id)&&(!kind||(kind==='eq.__notification'?r.data.kind==='__notification':r.data.kind!=='__notification'))&&(!member||r.data.privateMembers?.includes(JSON.parse(member.slice(3))[0]))));
 }
 throw Error('Unexpected request '+url);
};
const handler=createWorkspaceHandler({SUPABASE_URL:'https://test.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'server-test'},fetcher);
const call=async(user,route,body)=>{const response=await handler(new Request('https://test.supabase.co/functions/v1/wamarket-workspace?route='+route,{method:body?'POST':'GET',headers:user?{Authorization:'Bearer '+user,'Content-Type':'application/json'}:{},...(body?{body:JSON.stringify(body)}:{})}));return{status:response.status,data:await response.json()}};
assert.equal((await call(null,'notifications')).status,401);
const settings=await call('recipient','notifications');assert.equal(settings.status,200);assert(settings.data.publicKey);assert(!JSON.stringify(settings.data).includes('privateJwk'));
assert.equal((await call('recipient','notifications',{action:'subscribe',subscription})).status,200);
assert.equal((await call('actor','record',{record:{id:'message-one',kind:'__message',title:'private secret text',text:'private secret text',sender_id:'spoof',conversationId:'private-chat',created_at:new Date().toISOString()}})).status,200);
let recipient=await call('recipient','notifications'),outsider=await call('outsider','notifications');assert.equal(recipient.data.items.filter(x=>!x.read).length,1);assert(!JSON.stringify(recipient.data).includes('private secret text'));assert.equal(outsider.data.items.filter(x=>x.category==='message').length,0);assert.equal(pushCount,1);
assert.equal((await call('recipient','notifications',{action:'read',ids:[recipient.data.items[0].id]})).status,200);assert((await call('recipient','notifications')).data.items.every(x=>x.read));
assert.equal((await call('actor','record',{record:{id:'note-one',kind:'note',title:'Footage links',notes:'https://example.com'}})).status,200);recipient=await call('recipient','notifications');assert(recipient.data.items.some(x=>x.targetId==='note-one'&&!x.read));assert((await call('actor','notifications')).data.items.find(x=>x.targetId==='note-one').read);
const state=await call('recipient','state');assert(state.data.records.every(x=>x.data.kind!=='__notification'));assert(!JSON.stringify(state.data).includes(subscription.endpoint));
assert.equal((await call('actor','record',{record:{id:'forged',kind:'__notification',title:'Fake'}})).status,403);
assert.equal((await call('actor','record',{record:{id:'message-one',kind:'note',title:'Change type'}})).status,400);
await call('recipient','notifications',{action:'read',all:true});assert((await call('recipient','notifications')).data.items.every(x=>x.read));
await call('outsider','notifications',{action:'unsubscribe',subscription});assert([...integrations.values()].some(x=>x.subscription));await call('recipient','notifications',{action:'unsubscribe',subscription});assert(![...integrations.values()].some(x=>x.subscription));
console.log('PASS notification authentication, private recipients, sender attribution, summary redaction, unread/read state, subscription ownership, VAPID signature and independent push decryption');
