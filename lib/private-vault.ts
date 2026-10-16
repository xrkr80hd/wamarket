import {env} from 'cloudflare:workers';
const encoder=new TextEncoder();
function bytes(value:string){return Uint8Array.from(atob(value),c=>c.charCodeAt(0))}
async function key(){const secret=(env as any).WORKSPACE_VAULT_KEY;if(!secret)throw Error('Account storage is unavailable');return crypto.subtle.importKey('raw',bytes(secret),'AES-GCM',false,['encrypt','decrypt'])}
export async function sealWorkspace(value:any,userId:string,id:string){const iv=crypto.getRandomValues(new Uint8Array(12));const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:encoder.encode(userId+':'+id)},await key(),encoder.encode(JSON.stringify(value))));return JSON.stringify({iv:btoa(String.fromCharCode(...iv)),data:btoa(Array.from(encrypted,b=>String.fromCharCode(b)).join(''))})}
export async function openWorkspace(sealed:string,userId:string,id:string){const value=JSON.parse(sealed);const plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(value.iv),additionalData:encoder.encode(userId+':'+id)},await key(),bytes(value.data));return JSON.parse(new TextDecoder().decode(plaintext))}
