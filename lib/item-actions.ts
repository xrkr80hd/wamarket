import{getState,mutate,user,conversation}from'./preview-store';
export type ItemRef={kind:string,id:string,parent?:string};
export const refKey=(r:ItemRef)=>[r.kind,r.parent||'',r.id].join('|');
export function resolveItem(s:any,r:ItemRef):any{if(r.kind==='personal')return s.personal[user().id]?.find((x:any)=>x.id===r.id);if(r.kind==='annotation-comment')return s.annotations.find((x:any)=>x.id===r.parent)?.comments?.[Number(r.id)];if(r.kind==='record')return s.records.find((x:any)=>x.id===r.id);if(r.kind==='message')return s.messages.find((x:any)=>x.id===r.id);if(r.kind==='annotation')return s.annotations.find((x:any)=>x.id===r.id);if(r.kind==='shot')return s.records.find((x:any)=>x.id===r.parent)?.shots?.find((x:any)=>x.id===r.id);if(r.kind==='task')return s.records.find((x:any)=>x.id===r.parent)?.tasks?.[Number(r.id)];if(r.kind==='comment')return s.records.find((x:any)=>x.id===r.parent)?.comments?.[Number(r.id)];return null}
export function canEdit(s:any,r:ItemRef,item:any){if(!item)throw Error('Item is no longer available');if(user().role==='viewer')throw Error('Viewer accounts are read-only');if(r.kind==='message'){conversation(item.conversationId,s);if(item.sender_id!==user().id)throw Error('Only the sender may edit or remove this message')}if(r.kind==='personal'&&r.parent!==user().id)throw Error('Private workspace access denied');if((r.kind==='comment'||r.kind==='annotation-comment')&&item.by!==user().name&&user().role!=='owner')throw Error('Only the author or marketing lead may edit this comment');if(user().role==='executive'&&['shot','task'].includes(r.kind))throw Error('Production work belongs to the marketing team');if(user().role==='executive'&&r.kind==='record'&&!['asset','video','content'].includes(item.kind))throw Error('Executive role reviews deliverables')}
export function updateItem(r:ItemRef,patch:any){mutate(s=>{const item=resolveItem(s,r);canEdit(s,r,item);Object.assign(item,patch)},'Edited '+r.kind)}
export function bulkItems(refs:ItemRef[],action:string,values:any={}){
 const before:any[]=[],copies:any[]=[],successes:string[]=[],failures:string[]=[];
 mutate(s=>{for(const r of refs){try{
  const item=resolveItem(s,r);canEdit(s,r,item);
  if(action==='duplicate'&&!['record','shot','task','personal'].includes(r.kind))throw Error('Duplicate is unavailable for this item');
  before.push({r,old:structuredClone(item)});
  if(action==='archive')item.archived=true;
  else if(action==='restore')item.archived=false;
  else if(action==='unassign'){if(r.kind==='record'){item.project='';item.folder='';item.dealership='';item.associations=[];item.owner=''}else{item.assigned='';item.assignee=''}}
  else if(action==='assign'){Object.assign(item,values);if(r.kind==='task'&&values.owner)item.assignee=values.owner==='Travis'?'Trav':values.owner}
  else if(action==='duplicate'){
   const copy={...structuredClone(item),id:crypto.randomUUID(),title:item.title?item.title+' — Copy':undefined,archived:false};
   if(copy.kind==='video'){copy.versions=[];copy.status='Planned'}
   if(r.kind==='personal')s.personal[user().id].push(copy);else if(r.kind==='record')s.records.push(copy);else if(r.kind==='shot')s.records.find((x:any)=>x.id===r.parent).shots.push(copy);else s.records.find((x:any)=>x.id===r.parent).tasks.push(copy);
   copies.push({...r,id:copy.id});
  }else throw Error('Unsupported action');
  successes.push(item.title||item.text||r.id);
 }catch(e:any){failures.push(r.kind+': '+e.message)}}},action+' selected items');
 return{successes,failures,undo:()=>mutate(s=>{
  for(const r of copies){if(r.kind==='personal')s.personal[user().id]=s.personal[user().id].filter((x:any)=>x.id!==r.id);else if(r.kind==='record')s.records=s.records.filter((x:any)=>x.id!==r.id);else{const parent=s.records.find((x:any)=>x.id===r.parent);const key=r.kind==='shot'?'shots':'tasks';if(parent)parent[key]=parent[key].filter((x:any)=>x.id!==r.id)}}
  for(const {r,old}of before){const item=resolveItem(s,r);if(item){for(const k of Object.keys(item))delete item[k];Object.assign(item,old)}}
 },'Undid bulk action')};
}
