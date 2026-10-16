// Vercel-only account boundary. Supabase admin credentials never reach the browser.
const MASTER='xrkr80hd@gmail.com';
const allowedRoles=['owner','coordinator','executive','viewer'];
const publicUser=u=>({id:u.id,email:u.email,name:u.user_metadata?.name||u.email,role:u.email?.toLowerCase()===MASTER?'coordinator':u.app_metadata?.wamarket_role||'viewer',isAdmin:u.email?.toLowerCase()===MASTER,active:u.app_metadata?.wamarket_active!==false});
export function createAccountHandler(env=process.env,fetcher=fetch){
 const url=env.SUPABASE_URL,adminKey=env.SUPABASE_SERVICE_ROLE_KEY||env.SUPABASE_SECRET_KEY,key=adminKey||env.SUPABASE_PUBLISHABLE_KEY;
 async function sup(path,method='GET',body,token=undefined){const r=await fetcher(url+'/auth/v1/'+path,{method,headers:{apikey:key,...(token?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(Error(data.msg||data.message||data.error_description||'Account request failed'),{status:r.status});return data}
 const authorized=u=>u.email_confirmed_at&&(u.email?.toLowerCase()===MASTER||u.app_metadata?.wamarket_access===true)&&u.app_metadata?.wamarket_active!==false;
 const cookie=(res,token='',seconds=0)=>res.setHeader('Set-Cookie',`wam_cloud_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`);
 return async(req,res)=>{const send=(status,data)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(data)};try{
 if(!url||!key)return send(503,{error:'Account setup is not connected yet. The administrator must connect Supabase in Vercel.'});
 const route=req.query?.route||'me';
 if(req.method!=='GET'&&req.headers.origin!==`https://${req.headers.host}`)return send(403,{error:'Invalid request origin'});
 const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
 if(JSON.stringify(b).length>20000)return send(413,{error:'Request too large'});
 if(route==='signup'&&req.method==='POST'){
 const email=String(b.email||'').trim().toLowerCase();if(email!==MASTER)return send(403,{error:'Ask your administrator to add your account.'});
 if(typeof b.password!=='string'||b.password.length<12)return send(400,{error:'Use at least 12 characters for your password.'});
 await sup('signup','POST',{email,password:b.password,data:{name:'Travis'}});return send(200,{ok:true});
 }
 if(route==='login'&&req.method==='POST'){
 const data=await sup('token?grant_type=password','POST',{email:String(b.email||'').trim(),password:b.password});
 if(!authorized(data.user))return send(403,{error:'This account does not have access to Walker Suite.'});cookie(res,data.access_token,Math.min(data.expires_in||3600,3600));return send(200,{user:publicUser(data.user)});
 }
 if(route==='logout'&&req.method==='POST'){cookie(res);return send(200,{ok:true})}
 const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('wam_cloud_session='))?.slice(18);
 if(!token)return send(401,{error:'Sign in to continue.'});
 const me=await sup('user','GET',undefined,decodeURIComponent(token));if(!authorized(me))return send(403,{error:'Workspace access is unavailable.'});
 if(route==='me'&&req.method==='GET')return send(200,{user:publicUser(me)});
 if(me.email?.toLowerCase()!==MASTER)return send(403,{error:'Only the master administrator can manage users.'});
 if(route!=='users')return send(404,{error:'Not found'});
 if(!adminKey)return send(503,{error:'User administration requires the server-side Supabase integration.'});
 if(req.method==='GET'){let users=[];for(let page=1;page<=100;page++){const data=await sup('admin/users?page='+page+'&per_page=100');users.push(...(data.users||[]));if((data.users||[]).length<100)break}return send(200,{users:users.filter(u=>u.email?.toLowerCase()===MASTER||u.app_metadata?.wamarket_access===true).map(publicUser)})}
 if(req.method!=='POST')return send(405,{error:'Method not allowed'});
 if(!allowedRoles.includes(b.role))return send(400,{error:'Choose a valid role.'});
 if(!String(b.name||'').trim()||!/^\S+@\S+\.\S+$/.test(b.email||''))return send(400,{error:'Name and valid email are required.'});
 if(b.password&&b.password.length<12)return send(400,{error:'Use at least 12 characters for the password.'});
 let prior=null;if(b.id){prior=await sup('admin/users/'+encodeURIComponent(b.id));if(!prior.app_metadata?.wamarket_access&&prior.email?.toLowerCase()!==MASTER)return send(403,{error:'This account is outside Walker Suite.'});if(prior.email?.toLowerCase()===MASTER)return send(400,{error:'The master administrator account cannot be changed here.'});if(b.email.toLowerCase()!==prior.email.toLowerCase())return send(400,{error:'Email changes require a verified account-recovery process.'})}
 if(!prior&&!b.password)return send(400,{error:'An initial password is required.'});
 const payload={email:b.email.trim().toLowerCase(),...(b.password?{password:b.password}:{}),user_metadata:{...(prior?.user_metadata||{}),name:b.name.trim()},app_metadata:{...(prior?.app_metadata||{}),wamarket_access:true,wamarket_role:b.role,wamarket_active:b.active!==false},...(!prior?{email_confirm:true}:{})};
 const created=await sup(prior?'admin/users/'+encodeURIComponent(b.id):'admin/users',prior?'PUT':'POST',payload);return send(prior?200:201,{user:publicUser(created)});
 }catch(e){return send(e.status===400||e.status===401?e.status:500,{error:e.status===401?'Your session expired. Sign in again.':e.message||'Unable to complete account request.'})}}
}
export default createAccountHandler();
