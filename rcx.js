/* Reitcyclopedia ad runtime. Shared by index.html (live) and ads.html (previews). */
(function(){
const F={'120x600':{w:120,h:600,k:'side'},'160x600':{w:160,h:600,k:'side'},'300x250':{w:300,h:250,k:'side'},'300x600':{w:300,h:600,k:'side'},
'320x50':{w:320,h:50,k:'bottom'},'320x100':{w:320,h:100,k:'bottom'},'468x60':{w:468,h:60,k:'bottom'},'728x90':{w:728,h:90,k:'bottom'}};
const b64=u=>{let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode(...u.subarray(i,i+8192));return btoa(s)};
const unb=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const pipe=async(d,T)=>new Uint8Array(await new Response(new Blob([d]).stream().pipeThrough(new T('gzip'))).arrayBuffer());
const pack=async o=>b64(await pipe(JSON.stringify(o),CompressionStream));
const unpack=async s=>JSON.parse(new TextDecoder().decode(await pipe(unb(s),DecompressionStream)));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lum=h=>{const n=parseInt((h||'#000').slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
function bgCss(a){
 if(a.bg){const d=a.dim||0;return`linear-gradient(rgba(0,0,0,${d}),rgba(0,0,0,${d})),url("${a.bg}") center/cover`}
 const g=a.g||{t:'linear',a:135,c1:'#1565d8',c2:'#6d86ff',p:'center'};
 if(g.t==='radial')return`radial-gradient(circle at ${g.p||'center'},${g.c1},${g.c2})`;
 if(g.t==='conic')return`conic-gradient(from ${g.a||0}deg at 50% 50%,${g.c1},${g.c2},${g.c1})`;
 return`linear-gradient(${g.a??135}deg,${g.c1},${g.c2})`}
function textColor(a){if(a.tc==='light')return'#fff';if(a.tc==='dark')return'#111';if(a.bg)return'#fff';const g=a.g||{};return(lum(g.c1)+lum(g.c2))/2>.62?'#111':'#fff'}
function fit(el){el.querySelectorAll('[data-t]').forEach(t=>{let s=+t.dataset.t;t.style.fontSize=s+'px';while(s>8&&t.scrollHeight>t.clientHeight+1){s-=.5;t.style.fontSize=s+'px'}})}
function render(a,key,o={}){
 const f=F[key],w=f.w,h=f.h,wide=w/h>=3,tall=h/w>=1.8&&w<200,tc=textColor(a),el=document.createElement('div');
 const cta=a.link?`<span style="flex:none;background:rgba(255,255,255,.92);color:#111;padding:5px 12px;border-radius:999px;font:600 12px sans-serif;white-space:nowrap">${esc(a.cta||'Learn more')}</span>`:'';
 const logo=ls=>a.logo?`<div style="flex:none;width:${ls}px;height:${ls}px;border-radius:${a.shape==='circle'?'50%':Math.round(ls*.2)+'px'};background:url('${a.logo}') center/cover;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`:'';
 const ttl=`<div style="font-weight:bold;line-height:1.15;font-size:1.15em;word-break:break-word">${esc(a.title)}</div>`;
 const one=h<70?'white-space:nowrap;text-overflow:ellipsis;overflow:hidden;':'word-break:break-word;';
 const desc=`<div style="font-size:.85em;line-height:1.3;opacity:.92;margin-top:2px;${one}">${esc(a.desc)}</div>`;
 let inner;
 if(wide){const p=h<60?6:10,ls=h-2*p;
  inner=`<div style="display:flex;align-items:center;gap:9px;width:100%;padding:${p}px ${p+18}px ${p}px ${p}px;box-sizing:border-box">${logo(ls)}<div data-t="13" style="flex:1;min-width:0;height:${h-2*p}px;display:flex;flex-direction:column;justify-content:center;overflow:hidden">${ttl}${desc}</div>${w>=440?cta:''}</div>`}
 else if(tall){const ls=Math.min(w-24,80);
  inner=`<div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;width:100%;height:100%;padding:24px 10px 10px;box-sizing:border-box">${logo(ls)}<div style="font-weight:bold;font-size:15px;line-height:1.15;word-break:break-word;flex:none;max-height:72px;overflow:hidden">${esc(a.title)}</div><div data-t="13" style="flex:1;min-height:0;overflow:hidden;line-height:1.3;opacity:.92;word-break:break-word">${esc(a.desc)}</div>${cta}</div>`}
 else{const ls=h<300?52:64;
  inner=`<div style="display:flex;flex-direction:column;gap:8px;width:100%;height:100%;padding:12px 12px 14px;box-sizing:border-box"><div style="display:flex;align-items:center;gap:10px;padding-right:18px">${logo(ls)}<div style="font-weight:bold;font-size:17px;line-height:1.15;word-break:break-word;max-height:40px;overflow:hidden">${esc(a.title)}</div></div><div data-t="14" style="flex:1;min-height:0;overflow:hidden;line-height:1.35;opacity:.92;word-break:break-word">${esc(a.desc)}</div><div style="display:flex;justify-content:flex-end">${cta}</div></div>`}
 el.style.cssText=`all:initial;box-sizing:border-box;position:relative;display:flex;overflow:hidden;width:${w}px;height:${h}px;background:${bgCss(a)};color:${tc};font-family:'Average',Georgia,serif;border-radius:${a.r??10}px;cursor:${a.link?'pointer':'default'};box-shadow:0 2px 10px rgba(0,0,0,.25);border:1px solid rgba(0,0,0,.12);user-select:none`;
 el.innerHTML=inner+(h>=90&&!wide?'<i style="position:absolute;left:8px;bottom:3px;font:normal 9px sans-serif;opacity:.55">Ad</i>':'')+'<b data-x style="position:absolute;top:4px;right:4px;width:16px;height:16px;border-radius:50%;background:rgba(0,0,0,.5);color:#fff;font:bold 12px/16px sans-serif;text-align:center;cursor:pointer;z-index:2">×</b>';
 el.onclick=e=>{if(e.target.closest('[data-x]')){e.stopPropagation();o.onClose&&o.onClose();return}if(a.link&&!o.noLink)window.open(a.link,'_blank','noopener')};
 el._fit=()=>fit(el);return el}
function removed(f){const d=document.createElement('div');d.textContent='Ad removed';d.style.cssText=`all:initial;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:${f.w}px;height:${f.h}px;background:#eef1f6;color:#667085;border:1px dashed #c5ccd8;border-radius:10px;font:14px sans-serif`;return d}
function best(fm,kind,mw,mh){let b=null;for(const k of fm||[]){const f=F[k];if(!f||f.k!==kind||f.w>mw||f.h>mh)continue;if(!b||f.w*f.h>F[b].w*F[b].h)b=k}return b}

/* ---- live mounting (locked slots) ---- */
const R=()=>Math.random().toString(36).slice(2,9);
function mount(all){
 let slots=[],sig='',raf=0;
 const mob=()=>innerWidth<760,plat=()=>mob()?'mobile':'desktop';
 const pool=()=>all.filter(a=>(a.plat||['desktop','mobile']).includes(plat()));
 const kindOf=p=>p==='B'?'bottom':'side';
 function plan(){const W=innerWidth,H=innerHeight,sp=(W-980)/2-16;
  if(!mob()&&sp>=120&&pool().some(a=>best(a.fmts,'side',sp,H-100)))return[{p:'L',mw:sp,mh:H-100},{p:'R',mw:sp,mh:H-100}];
  return[{p:'B',mw:W,mh:120}]}
 function pick(s,ex){const c=pool().filter(a=>best(a.fmts,kindOf(s.p),s.mw,s.mh));let l=c.filter(a=>!ex.includes(a.id));if(!l.length)l=c;return l[Math.floor(Math.random()*l.length)]}
 function pos(s){const f=F[s.key];let c='all:initial;position:fixed;z-index:2147483647;display:block;visibility:visible;opacity:1;pointer-events:auto;width:'+f.w+'px;height:'+f.h+'px;';
  if(s.p==='B')c+='bottom:0;left:50%;transform:translateX(-50%);';
  else if(s.p==='L')c+='top:90px;left:'+Math.max(0,(innerWidth-980)/2-f.w-12)+'px;';
  else c+='top:90px;right:'+Math.max(0,(innerWidth-980)/2-f.w-12)+'px;';
  s.host.style.cssText=c.replace(/;/g,' !important;');s.sty=s.host.getAttribute('style')}
 function body(){const b=slots.find(s=>s.p==='B'&&s.key);if(b)document.body.style.setProperty('padding-bottom',F[b.key].h+'px','important');else document.body.style.removeProperty('padding-bottom')}
 function show(s,ad){if(!ad)return;s.ad=ad;s.key=best(ad.fmts,kindOf(s.p),s.mw,s.mh);pos(s);const el=render(ad,s.key,{onClose:()=>close(s)});s.sh.replaceChildren(el);requestAnimationFrame(()=>el._fit());body()}
 function next(s){show(s,pick(s,slots.map(x=>x.ad&&x.ad.id).filter(Boolean)))}
 function close(s){s.sh.replaceChildren(removed(F[s.key]));clearTimeout(s.t);s.t=setTimeout(()=>next(s),3000)}
 function make(p){const host=document.createElement('div'),s={p,host,sh:host.attachShadow({mode:'closed'}),mw:p.mw,mh:p.mh,ad:null,key:null,t:0};s.p=p.p;host.id='x'+R();host.className='q'+R();document.body.append(host);return s}
 function build(){slots.forEach(s=>{clearTimeout(s.t);s.host.remove()});slots=[];const pl=plan();sig=pl.map(x=>x.p).join();
  pl.forEach(x=>{const s=make(x);s.mw=x.mw;s.mh=x.mh;slots.push(s);next(s)});body()}
 function resize(){const pl=plan(),n=pl.map(x=>x.p).join();if(n!==sig)return build();
  slots.forEach((s,i)=>{s.mw=pl[i].mw;s.mh=pl[i].mh;if(!s.ad||best(s.ad.fmts,kindOf(s.p),s.mw,s.mh)!==s.key)next(s);else pos(s)});body()}
 function guard(){raf=0;slots.forEach(s=>{if(!s.host.isConnected)document.body.append(s.host);
  const cs=getComputedStyle(s.host);if(s.host.getAttribute('style')!==s.sty||cs.display!=='block'||cs.visibility!=='visible'||+cs.opacity<1){if(s.key)pos(s)}
  const id=s.host.id;if(!id)s.host.id='x'+R()});
  const b=slots.find(s=>s.p==='B'&&s.key);if(b&&document.body.style.paddingBottom!==F[b.key].h+'px')body()}
 new MutationObserver(()=>{if(!raf)raf=requestAnimationFrame(guard)}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','hidden','id']});
 setInterval(guard,800);let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(resize,250)});build()}

window.RCAds={F,pack,unpack,render,removed,best,bgCss,mount};
if(!window.RC_NOAUTO)fetch('target.json',{cache:'no-cache'}).then(r=>r.json()).then(async j=>{const l=Array.isArray(j)?j:j.ads||[],ads=[];
 for(const z of l){try{ads.push(await unpack(z))}catch(e){}}
 if(ads.length)mount(ads)}).catch(()=>{});
})();
