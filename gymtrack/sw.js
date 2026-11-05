/* Service worker: האפליקציה עובדת גם בלי אינטרנט.
   קבצי האפליקציה: קודם מהרשת (כדי לקבל עדכונים), ואם אין רשת מהמטמון.
   בקשות לשרתים אחרים (Google) לא נשמרות במטמון. */
const CACHE = 'gymtrack-v24';
const REMIND = 'gymtrack-remind'; /* הגדרות התזכורת, נכתבות מהאפליקציה ולא נמחקות בעדכון גרסה */
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== REMIND).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  /* רשת קודם, אבל אם היא איטית (חדר כושר עם קליטה חלשה) יותר מ-4 שניות, מציגים מיד מהמטמון והעדכון ממשיך ברקע */
  const net = fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  const slow = new Promise(r => setTimeout(() => r(null), 4000));
  e.respondWith(
    Promise.race([net, slow])
      .then(res => res || caches.match(req, { ignoreSearch: true }).then(c => c || net))
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});

/* תזכורת אימון ברקע (Periodic Background Sync, כרום באנדרואיד). מתריעים פעם ביום, בין שעת התזכורת ל-22:00,
   ביום עם תוכנית קבועה, אם עוד לא נרשם אימון היום */
const pad = n => String(n).padStart(2, '0');
async function remindCheck() {
  const c = await caches.open(REMIND);
  const r = await c.match('remind.json');
  if (!r) return;
  const cfg = await r.json();
  const now = new Date(), today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const names = (cfg.byDay || {})[now.getDay()];
  if (!cfg.on || !names || !names.length || cfg.last === today || now.getHours() < cfg.hour || now.getHours() >= 22) return;
  const n = await c.match('notified.json');
  if (n && (await n.text()) === today) return;
  await self.registration.showNotification('💪 היום יום אימון', { body: names.join(' · ') + '. גם אימון מקוצר נחשב.', tag: 'remind', icon: 'icon-192.png' });
  await c.put('notified.json', new Response(today));
}
self.addEventListener('periodicsync', e => { if (e.tag === 'gt-remind') e.waitUntil(remindCheck()); });

/* לחיצה על התראה (המנוחה נגמרה / תזכורת אימון) מחזירה לאפליקציה */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const open = list.find(c => c.url.startsWith(self.registration.scope));
    return open ? open.focus() : self.clients.openWindow('./');
  }));
});
