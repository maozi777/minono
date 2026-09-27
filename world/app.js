const $=s=>document.querySelector(s),clamp=(n,a=0,b=1)=>Math.min(b,Math.max(a,n));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)},out=t=>1-Math.pow(1-clamp(t),3),inside=t=>Math.pow(clamp(t),3);
const glide=$('#glide'),music=$('#music'),explore=$('#explore'),flight=$('#flight'),copy=$('.hero-copy'),sky=$('.sky'),wipe=$('.cloud-wipe'),record=$('.record-scene'),title=$('.section-title'),left=$('#worldCard'),right=$('#duduCard'),welcome=$('.welcome-art');
const clouds=[...document.querySelectorAll('.cloud')],nav=[...document.querySelectorAll('.scene-nav a')];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=scrollY,target=scrollY,frame=0;
function card(el,p,side){
 const t=clamp(p)*2.3,entry=out(t),exit=inside(t-1.3);
 const x=side==='left'?(-100*(1-entry)-200*exit):(200*(1-entry)+200*exit);
 const y=side==='left'?(150-200*entry):(100-150*entry-70*exit);
 const rx=(side==='left'?-25:-30)*(1-entry)+(side==='left'?-15:-5)*exit;
 const ry=(side==='left'?-2:5)*(1-entry)+(side==='left'?-20:10)*exit;
 const rz=(side==='left'?-5:12)*(1-entry);
 el.style.transform=`translate(${x}%,${y}%) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${.5+.5*entry})`;
 el.style.opacity=p<=0||p>=1?'0':'1';el.style.visibility=p<=0||p>=1?'hidden':'visible';
}
function draw(){
 current=reduced.matches?target:current+(target-current)*.09;
 const h=innerHeight,g=clamp(current/(glide.offsetHeight-h)),m=clamp((current-music.offsetTop)/(music.offsetHeight-h)),mobile=innerWidth<=760;
 const turn=smooth(g/.95),exit=smooth((g-.86)/.14);
 flight.style.transform=`translate3d(${-turn*(mobile?6:4)}vw,${turn*8}vh,0) rotateX(${18*(1-turn)}deg) rotateY(${-12*(1-turn)}deg) rotateZ(${-9+turn*12-Math.sin(g*Math.PI*2)*2}deg) scale(${1.04-.04*turn})`;
 const level=$('#levelFlight'),angle=smooth((g-.40)/.26);level.style.transform=flight.style.transform;level.style.opacity=String(angle);flight.style.opacity=String(1-angle);sky.style.setProperty('--mist',String(.12+smooth(g)*.72));
 $('.flight-veil').style.opacity=String(smooth((g-.28)/.20)*(1-smooth((g-.60)/.20))*.90);
 copy.style.opacity=String(1-smooth((g-.42)/.5));copy.style.transform=`translateY(${mobile?-g*30:-50-g*20}%) rotate(${-g*2}deg)`;
 sky.style.transform=`translateY(${-g*3}%) scale(${1.08-g*.06})`;
 clouds.forEach((c,i)=>{const speeds=[65,100,120,175,200,235];c.style.transform=`translate3d(${Math.sin(g*2+i)*g*(i<3?3:8)}vw,${-g*speeds[i]}vh,0) scale(${1+g*(i<3?.06:.14)})`;});
 wipe.style.transform=`translateY(${100-exit*100}%)`;$('.scroll-hint').style.opacity=String(1-clamp(g*8));
 const reveal=out((current-music.offsetTop+h*.65)/(h*.65));
 title.style.opacity=String(reveal);title.style.transform=`translateX(${(1-reveal)*40}%) skewX(${(1-reveal)*18}deg)`;
 const shift=smooth((m-.42)/.22);
 record.style.transform=`translate3d(${-shift*(mobile?0:28)}vw,${(1-reveal)*20-Math.sin(m*Math.PI)*2}vh,0) rotate(${-2+shift*4}deg) scale(${.92+reveal*.08})`;
 record.style.opacity=String(reveal);card(left,m/.6,'left');card(right,(m-.5)/.5,'right');
 const f=clamp((current-explore.offsetTop+h)/h);
 welcome.style.transform=reduced.matches?'none':`translateY(${(1-out(f))*100}px) rotate(${(1-out(f))*-12}deg) scale(${.8+.2*out(f)})`;
 const active=current>=explore.offsetTop-h*.4?2:current>=music.offsetTop-h*.3?1:0;
 nav.forEach((n,i)=>{n.classList.toggle('active',i===active);if(i===active)n.setAttribute('aria-current','location');else n.removeAttribute('aria-current');});
 if(Math.abs(current-target)>.2)frame=requestAnimationFrame(draw);else frame=0;
}
function update(){target=scrollY;if(!frame)frame=requestAnimationFrame(draw)}
addEventListener('scroll',update,{passive:true});addEventListener('resize',update);addEventListener('load',update);reduced.addEventListener('change',update);
nav.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const el=$(a.getAttribute('href'));const offset=el===music?(music.offsetHeight-innerHeight)*.16:0;scrollTo({top:el.offsetTop+offset,behavior:reduced.matches?'instant':'smooth'});}));
$('#backTop').addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
const dialog=$('#roomDialog');document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{$('#roomTitle').textContent=b.dataset.room;dialog.showModal();}));
$('.dialog-close').addEventListener('click',()=>dialog.close());$('.dialog-back').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const veil=document.createElement('div');veil.className='flight-veil';veil.setAttribute('aria-hidden','true');$('.glide-stage').append(veil);
const experience=document.createElement('dialog');experience.className='experience-dialog';experience.innerHTML='<div class="experience-bar"><button type="button" class="experience-back">← 返回蝴蝶门</button><span class="experience-name"></span><a class="experience-open" target="_blank" rel="noopener">独立打开 ↗</a></div><iframe title="NONO互动体验" allow="autoplay; fullscreen"></iframe>';document.body.append(experience);
const closeExperience=()=>{experience.querySelector('iframe').src='about:blank';experience.close();};
experience.querySelector('.experience-back').addEventListener('click',closeExperience);experience.addEventListener('cancel',e=>{e.preventDefault();closeExperience()});
addEventListener('message',e=>{const allowed=e.origin===location.origin||e.origin==='https://nono-butterfly-wardrobe.terwasegod63.chatgpt.site';if(allowed&&e.source===experience.querySelector('iframe').contentWindow&&e.data?.type==='nono-close-experience')closeExperience();});
document.querySelectorAll('[data-link]').forEach(b=>b.addEventListener('click',()=>{experience.querySelector('.experience-name').textContent=b.textContent.replace('↗','');experience.querySelector('iframe').src=b.dataset.link;experience.querySelector('.experience-open').href=b.dataset.link;experience.showModal();}));
const video=$('#recordVideo');let videoTimer;
new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!reduced.matches)video.play().catch(()=>{});else video.pause();},{threshold:.15}).observe(video);
addEventListener('scroll',()=>{if(video.getBoundingClientRect().bottom>0&&video.getBoundingClientRect().top<innerHeight){video.playbackRate=1.6;clearTimeout(videoTimer);videoTimer=setTimeout(()=>video.playbackRate=1,220);}},{passive:true});
update();
const idleSrc='./assets/nono-welcome-idle.gif',stillSrc='./assets/nono-welcome.png';
const idleObserver=new IntersectionObserver(([e])=>{welcome.src=e.isIntersecting&&!reduced.matches?idleSrc:stillSrc;},{threshold:.1});idleObserver.observe(welcome);
reduced.addEventListener('change',()=>{welcome.src=reduced.matches?stillSrc:idleSrc});
