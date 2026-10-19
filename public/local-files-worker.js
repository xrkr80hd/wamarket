self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const read=id=>new Promise((resolve,reject)=>{const r=indexedDB.open('wam-local-files',1);r.onupgradeneeded=()=>r.result.createObjectStore('files');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,q=db.transaction('files').objectStore('files').get(id);q.onsuccess=()=>{resolve(q.result);db.close()};q.onerror=()=>{reject(q.error);db.close()}}});
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(u.origin!==self.location.origin||!['/api/files','/api/hero-images','/api/profile-photo','/api/link-preview','/api/media-packet'].includes(u.pathname))return;event.respondWith((async()=>{try{const file=await read(u.searchParams.get('id')||u.searchParams.get('image'));if(!file)return new Response('Original is not available in this local preview.',{status:404});return new Response(file,{headers:{'Content-Type':file.type||'application/octet-stream','Content-Length':String(file.size),'Cache-Control':'no-store'}})}catch{return new Response('Local file storage unavailable',{status:503})}})())});

// Keep device identity separate from cached files; never show another user's alerts.
function notificationDevice(write) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('wam-notification-device', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('state');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('state', write ? 'readwrite' : 'readonly');
      const store = tx.objectStore('state');
      const get = store.get('device'); let value;
      get.onsuccess = () => { value = get.result || { userId: '', count: 0 }; if (write) { value = write(value); store.put(value, 'device'); } };
      tx.oncomplete = () => { db.close(); resolve(value); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    };
  });
}
async function appBadge(count) {
  try {
    if (count > 0) await self.navigator.setAppBadge?.(count);
    else await self.navigator.clearAppBadge?.();
  } catch {}
}
self.addEventListener('message', event => {
  const data = event.data;
  if (data?.type === 'WAM_ACCOUNT') event.waitUntil(notificationDevice(previous => ({ userId: String(data.userId || ''), count: previous.userId === data.userId ? previous.count : 0 })).then(device => appBadge(device.count)));
  if (data?.type === 'WAM_BADGE') event.waitUntil(notificationDevice(previous => ({ ...previous, count: Math.max(0, Number(data.count) || 0) })).then(device => appBadge(device.count)));
});
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let data;
    try { data = event.data?.json(); } catch { return; }
    const device = await notificationDevice();
    if (!data?.userId || data.userId !== device.userId) return;
    const count = Math.max(0, Number(data.badge) || 0);
    await notificationDevice(previous => ({ ...previous, count }));
    await appBadge(count);
    await self.registration.showNotification(String(data.title || 'Walker Suite'), {
      body: String(data.body || 'New activity in Walker Suite.'),
      icon: '/icons/walker-192.png', badge: '/icons/walker-192.png',
      tag: String(data.id), data: { id: data.id, userId: data.userId, url: data.url },
    });
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const data = event.notification.data || {};
    const device = await notificationDevice();
    if (device.userId !== data.userId) return;
    const url = new URL(data.url || '/', self.location.origin);
    if (url.origin !== self.location.origin) return;
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = clients.find(client => new URL(client.url).origin === self.location.origin);
    if (client) {
      await client.focus();
      client.postMessage({ type: 'WAM_OPEN_NOTIFICATION', id: data.id });
    } else await self.clients.openWindow(url.href);
  })());
});
