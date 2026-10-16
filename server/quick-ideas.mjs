import {randomUUID} from 'node:crypto';
export function setupQuickIdeas(db){db.exec('CREATE TABLE IF NOT EXISTS quick_ideas(id TEXT PRIMARY KEY,record TEXT NOT NULL);CREATE TABLE IF NOT EXISTS quick_idea_media(id TEXT PRIMARY KEY,owner TEXT,name TEXT,type TEXT,bytes BLOB);')}
export async function quickIdeasRoute({route,method,req,res,me,db,body,reply,url}){
 if(!route.startsWith('/__local/quick-ideas'))return false;
 if(route==='/__local/quick-ideas/media'&&method==='GET'){
  const id=url.searchParams.get('id'),m=db.prepare('SELECT * FROM quick_idea_media WHERE id=?').get(id);
  const shared=db.prepare('SELECT record FROM quick_ideas').all().some(r=>JSON.parse(r.record).attachments?.some(a=>a.id===id));
  if(!m||m.owner!==me.id&&!shared){reply(res,404,{error:'Media unavailable'});return true}
  res.writeHead(200,{'Content-Type':m.type,'Content-Length':m.bytes.length,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'});res.end(m.bytes);return true;
 }
 if(method==='GET'){reply(res,200,{records:db.prepare('SELECT record FROM quick_ideas').all().map(r=>JSON.parse(r.record))});return true}
 if(me.role==='viewer'){reply(res,403,{error:'Your role can view quick ideas only'});return true}
 if(route==='/__local/quick-ideas/media'&&method==='POST'){
  const type=(req.headers['content-type']||'').split(';')[0];
  if(!['image/png','image/jpeg','image/webp','image/gif','image/avif','image/heic','video/mp4','video/webm','video/quicktime','video/x-msvideo'].includes(type))throw Error('Use a photo, screenshot or video file');
  const bytes=await body(req,100*1024*1024),id=randomUUID(),title=decodeURIComponent(req.headers['x-file-name']||'Media').slice(0,250);
  if(!bytes.length)throw Error('The file is empty');
  db.prepare('INSERT INTO quick_idea_media VALUES(?,?,?,?,?)').run(id,me.id,title,type,bytes);
  reply(res,201,{id,title,type,size:bytes.length});return true;
 }
 const b=JSON.parse((await body(req)).toString()),old=b.id?db.prepare('SELECT record FROM quick_ideas WHERE id=?').get(b.id):null;
 let r=old?JSON.parse(old.record):null;
 if(b.action==='save'){
  if(!String(b.title||'').trim())throw Error('Give the idea a quick label');
  if(r&&r.authorId!==me.id&&!me.admin&&me.role!=='owner')throw Error('Only the author or marketing lead can edit this idea');
  const attachments=b.attachments||[];if(!Array.isArray(attachments)||attachments.length>12)throw Error('Attach up to 12 files');
  for(const a of attachments){const m=db.prepare('SELECT owner FROM quick_idea_media WHERE id=?').get(a.id);if(!m||m.owner!==me.id&&!r?.attachments?.some(x=>x.id===a.id))throw Error('One attached file is unavailable')}
  r={...r,id:r?.id||randomUUID(),kind:'quickidea',title:String(b.title).trim().slice(0,180),notes:String(b.notes||'').slice(0,4000),attachments,authorId:r?.authorId||me.id,author:r?.author||me.name,created:r?.created||new Date().toISOString(),votes:r?.votes||{},comments:r?.comments||[],updated:new Date().toISOString()};
 }else{
  if(!r)throw Error('Idea not found');
  if(b.action==='ack'){if(!['seen','onit',''].includes(b.value))throw Error('Choose Seen or On it');r.acknowledgements||={};if(b.value){r.acknowledgements[me.id]={name:me.name,status:b.value,at:new Date().toISOString()};r.seenBy||={};r.seenBy[me.id]=new Date().toISOString()}else{delete r.acknowledgements[me.id];if(r.seenBy)delete r.seenBy[me.id]}}else if(b.action==='seen'){r.seenBy||={};if(b.value===false)delete r.seenBy[me.id];else r.seenBy[me.id]=new Date().toISOString()}
  else if(b.action==='react'){if(![-1,0,1].includes(b.value))throw Error('Choose thumbs up or thumbs down');r.votes[me.id]=b.value}
  else if(b.action==='comment'){if(!String(b.text||'').trim())throw Error('Write a note');r.comments.push({id:randomUUID(),text:String(b.text).trim().slice(0,4000),by:me.name,authorId:me.id,at:new Date().toISOString()})}
  else if(b.action==='archive'||b.action==='restore'){if(r.authorId!==me.id&&!me.admin&&me.role!=='owner')throw Error('Only the author or marketing lead can archive this idea');r.archived=b.action==='archive'}
  else if(b.action==='delete-comment'){const c=r.comments.find(x=>x.id===b.commentId);if(!c||c.authorId!==me.id&&!me.admin&&me.role!=='owner')throw Error('You cannot remove that note');c.archived=true}
  else throw Error('Unknown quick idea action');
 }
 db.prepare('INSERT INTO quick_ideas VALUES(?,?) ON CONFLICT(id) DO UPDATE SET record=excluded.record').run(r.id,JSON.stringify(r));reply(res,200,{record:r});return true;
}
