import assert from 'node:assert/strict';import vm from'node:vm';import{readFile}from'node:fs/promises';import{indexedDB}from'fake-indexeddb';
const listeners=new Map(),shown=[],badges=[],opened=[],messages=[];
const self={location:{origin:'https://wamarket.xrkr80hd.studio'},addEventListener:(name,fn)=>listeners.set(name,fn),navigator:{setAppBadge:async n=>badges.push(n),clearAppBadge:async()=>badges.push(0)},registration:{showNotification:async(title,options)=>shown.push({title,...options})},clients:{claim:async()=>{},matchAll:async()=>[{url:'https://wamarket.xrkr80hd.studio/',focus:async()=>{},postMessage:m=>messages.push(m)}],openWindow:async url=>opened.push(url)}};
vm.runInNewContext(await readFile(new URL('../public/local-files-worker.js',import.meta.url),'utf8'),{self,indexedDB,URL,Response,Promise,Number,String,Math});
async function fire(name,event){let pending;listeners.get(name)({...event,waitUntil:p=>pending=p});await pending}
await fire('message',{data:{type:'WAM_ACCOUNT',userId:'travis'}});await fire('push',{data:{json:()=>({id:'one',userId:'travis',title:'Message',body:'Open your message',badge:2,url:'/?wam-notification=one'})}});assert.equal(shown.length,1);assert.equal(badges.at(-1),2);
await fire('push',{data:{json:()=>({id:'private',userId:'someone-else',badge:9})}});assert.equal(shown.length,1);assert.equal(badges.at(-1),2);
await fire('notificationclick',{notification:{data:{id:'one',userId:'travis',url:'/?wam-notification=one'},close(){}}});assert.equal(messages[0].id,'one');
await fire('message',{data:{type:'WAM_BADGE',count:0}});assert.equal(badges.at(-1),0);await fire('message',{data:{type:'WAM_ACCOUNT',userId:''}});await fire('push',{data:{json:()=>({id:'two',userId:'travis',badge:1})}});assert.equal(shown.length,1);
console.log('PASS worker background push, app badge update/clear, notification click, cross-account isolation and logout suppression');
