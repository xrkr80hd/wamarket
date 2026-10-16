import assert from 'node:assert/strict';
import {createWorkspaceHandler} from '../supabase/functions/wamarket-workspace/core.js';
import {startCloudWorkspace,stopCloudWorkspace} from '../lib/cloud-workspace';
import {people,user,setUser,saveRecord,getState} from '../lib/preview-store';
import {roleLabel} from '../lib/dashboard';
const master={id:'master',email:'xrkr80hd@gmail.com',email_confirmed_at:'2026-10-16',app_metadata:{wamarket_access:true,wamarket_role:'coordinator'},user_metadata:{name:'Travis'}};
const viewer={id:'viewer',email:'viewer@example.com',email_confirmed_at:'2026-10-16',app_metadata:{wamarket_access:true,wamarket_role:'viewer'},user_metadata:{name:'Viewer',isAdmin:true}};
const coordinator={...viewer,id:'coordinator',email:'coordinator@example.com',app_metadata:{wamarket_access:true,wamarket_role:'coordinator'}};
const rows:any[]=[];
const handler=createWorkspaceHandler({SUPABASE_URL:'https://example.test',SUPABASE_SERVICE_ROLE_KEY:'test'},async(url:any,options:any)=>{
 const u=new URL(url);
 if(u.pathname==='/auth/v1/user')return Response.json(options.headers.Authorization==='Bearer master'?master:options.headers.Authorization==='Bearer coordinator'?coordinator:viewer);
 if(u.pathname==='/auth/v1/admin/users')return Response.json({users:[master,viewer,coordinator]});
 if(u.pathname==='/rest/v1/wamarket_presence'||u.pathname==='/rest/v1/wamarket_dashboards')return Response.json([]);
 if(u.pathname==='/rest/v1/wamarket_records'){
  if(options.method==='POST'){const r=JSON.parse(options.body);rows.push(r);return Response.json([r])}
  return Response.json(u.searchParams.has('id')?rows.filter(r=>'eq.'+r.id===u.searchParams.get('id')):rows);
 }
 throw Error('Unexpected request '+url);
});
async function request(token:string,route='state',body?:any){return handler(new Request('https://example.test/?route='+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})}));}
const state=await (await request('master')).json();
assert.equal(state.members[0].isAdmin,true);assert.equal(state.members[0].role,'owner');assert.equal(state.members[1].isAdmin,false);
assert.equal((await request('master','record',{record:{id:'approved',kind:'project',title:'Owner approval',status:'Approved'}})).status,200);
assert.equal((await request('viewer','record',{record:{id:'denied',kind:'project',title:'Denied'}})).status,403);
assert.equal((await request('coordinator','record',{record:{id:'denied',kind:'project',title:'Denied',status:'Approved'}})).status,403);
const storage=()=>{const m=new Map();return{getItem:(k:string)=>m.get(k)||null,setItem:(k:string,v:string)=>m.set(k,v),removeItem:(k:string)=>m.delete(k)}};
const events=new EventTarget();Object.assign(globalThis,{localStorage:storage(),sessionStorage:storage(),document:{visibilityState:'visible'},window:{dispatchEvent:events.dispatchEvent.bind(events),addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events)}});
const me={...state.members[0],role:'coordinator'};people.push(me);setUser(me.id);
globalThis.fetch=async(url:any,options:any)=>request('master',new URL('https://example.test'+url).searchParams.get('route')||'state',options.body?JSON.parse(options.body):undefined);
await startCloudWorkspace(me);
try{assert.equal(user().isAdmin,true);assert.equal(user().role,'owner');assert.match(roleLabel(user().role,user().isAdmin),/Site Owner/);saveRecord({id:'local-approved',kind:'project',title:'Owner can approve after sync',status:'Approved'});assert(getState().records.some((r:any)=>r.id==='local-approved'));}finally{stopCloudWorkspace()}
console.log('Owner permissions survive workspace sync; owner approval succeeds; viewer/coordinator restrictions remain enforced.');
