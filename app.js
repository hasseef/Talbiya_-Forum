// App script v7.1
const PARTNERS=["assets/Vision2030.png","assets/hasseef.png","assets/talbiya.png"];
const REGIONS=[
  {id:"riyadh",name:"منطقة الرياض"},{id:"makkah",name:"منطقة مكة المكرمة"},{id:"madinah",name:"منطقة المدينة المنورة"},
  {id:"qassim",name:"منطقة القصيم"},{id:"eastern",name:"المنطقة الشرقية"},{id:"asir",name:"منطقة عسير"},
  {id:"tabuk",name:"منطقة تبوك"},{id:"hail",name:"منطقة حائل"},{id:"northborders",name:"منطقة الحدود الشمالية"},
  {id:"jazan",name:"منطقة جازان"},{id:"najran",name:"منطقة نجران"},{id:"albaha",name:"منطقة الباحة"},{id:"aljouf",name:"منطقة الجوف"}
];
const qs=s=>document.querySelector(s);
const regionGrid=qs('#regionGrid'),regionTabs=qs('#regionTabs'),regionSelect=qs('#regionSelect');
const agendaGrid=qs('#agendaGrid'),speakersGrid=qs('#speakersGrid'),partnersGrid=qs('#partnersGrid');
const topicSelect=qs('#topicSelect'),heroTitle=qs('#heroTitle'),heroLead=qs('#heroLead');
const emirateLogo=qs('#emirateLogo');

function setEmirateLogo(imgEl, regionId){
  const candidates=[`assets/emirates/${regionId}.png`,`assets/emirates/${regionId}.svg`,`assets/emirates/${regionId}.jpg`,`assets/emirates/${regionId}.webp`];
  let i=0; const tryNext=()=>{ if(i>=candidates.length){imgEl.style.display='none';return;} imgEl.onerror=()=>{i++; imgEl.src=candidates[i]||''}; imgEl.src=candidates[i]; imgEl.style.display='block'; };
  tryNext();
}

async function loadRegionData(id){
  const res = await fetch(`data/${id}.json`, {cache:'no-store'});
  if(!res.ok) throw new Error('تعذر تحميل بيانات المنطقة');
  return await res.json();
}

function renderRegions(){
  regionTabs.innerHTML = REGIONS.map(r=>`<a href="#home" data-id="${r.id}">${r.name}</a>`).join('');
  regionGrid.innerHTML = REGIONS.map(r=>`<a href="#home" data-id="${r.id}"><div class="title">${r.name}</div><div style="color:#65728A;font-size:14px">اضغط للانتقال لتفاصيل المنطقة</div></a>`).join('');
  regionSelect.innerHTML = REGIONS.map(r=>`<option value="${r.id}">${r.name}</option>`).join('');
}

async function switchRegion(id, single=false){
  setEmirateLogo(emirateLogo, id);
  const d = await loadRegionData(id);
  heroTitle.textContent = REGIONS.find(r=>r.id===id)?.name || 'منطقتك';
  heroLead.textContent = single ? 'هذه الصفحة تعرض تفاصيل ملتقى المنطقة فقط.' : 'اختر منطقتك واستعرض المحاور والمتحدثين وسجّل حضورك.';
  topicSelect.innerHTML = `<option value="all">كل المحاور</option>`+(d.topics||[]).map(t=>`<option value="${t.id}">${t.title}</option>`).join('');
  agendaGrid.innerHTML = (d.topics||[]).map(t=>`
    <div class="card p">
      <div style="display:grid;grid-template-columns:100px 1fr;gap:12px">
        <div>${t.time||''}</div>
        <div><div style="font-weight:700">${t.title}</div><div style="color:#65728A;margin-top:4px">${t.desc||''}</div></div>
      </div>
    </div>`).join('') || `<div class="card p" style="color:#65728A">لا توجد محاور بعد لهذه المنطقة.</div>`;
  const sel=topicSelect.value;
  const list = sel==='all' ? (d.speakers||[]) : (d.speakers||[]).filter(s=>s.topic===sel);
  speakersGrid.innerHTML = list.map(s=>`
    <div class="card p speaker-card">
      <div class="ph"><img src="${s.photo||'assets/talbiya.png'}" alt="${s.name}" loading="lazy"></div>
      <div class="meta">
        <div class="name">${s.name}</div>
        <div class="role">${s.role||''}</div>
        <p class="bio">${s.bio||''}</p>
      </div>
    </div>`).join('') || `<div class="card p" style="color:#65728A">لا توجد أسماء متحدثين بعد.</div>`;
  partnersGrid.innerHTML=(d.partners||[]).map(src=>`<div class="card p"><img src="${src}" alt="شعار" loading="lazy"></div>`).join('')||`<div class="card p" style="color:#65728A">لا يوجد شركاء بعد.</div>`;
}

async function init(){
  renderRegions();
  const params = new URLSearchParams(location.search);
  let region = params.get('region');
  const single = !!region;
  if(!region) region = 'riyadh';
  regionSelect.value=region;
  if(single){
    document.getElementById('home').classList.add('hide'); 
    document.getElementById('regionTabs').classList.add('hide');
    document.getElementById('regionControl').classList.add('hide');
  }
  await switchRegion(region, single);
  regionTabs.addEventListener('click', async (e)=>{
    const a=e.target.closest('a[data-id]'); if(!a) return; e.preventDefault();
    await switchRegion(a.dataset.id);
    regionSelect.value=a.dataset.id;
  });
  regionGrid.addEventListener('click', async (e)=>{
    const a=e.target.closest('a[data-id]'); if(!a) return; e.preventDefault();
    await switchRegion(a.dataset.id); regionSelect.value=a.dataset.id; location.hash='#agenda';
  });
  regionSelect.addEventListener('change', async ()=>{ await switchRegion(regionSelect.value); });
  topicSelect.addEventListener('change', async ()=>{ await switchRegion(regionSelect.value); });
  document.getElementById('copyLink').addEventListener('click', async ()=>{
    const url = `${location.origin}${location.pathname}?region=${regionSelect.value}`;
    try{ await navigator.clipboard.writeText(url); alert('تم نسخ رابط المنطقة: '+url); } catch{ prompt('انسخ الرابط:',url); }
  });
  if('serviceWorker' in navigator){
    try{ await navigator.serviceWorker.register('./sw.js'); }catch{}
  }
}
init();

document.getElementById('regForm').addEventListener('submit',e=>{
  e.preventDefault(); document.getElementById('regMsg').style.display='block';
  setTimeout(()=>document.getElementById('regMsg').style.display='none',3000);
});
