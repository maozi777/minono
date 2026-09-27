const names=['奇妙能力歌','小半','虚拟','芳草地','走马','易燃易爆炸','光'];
const ids=['1413542882','1421693331','1421693767','1421693327','1413543839','1413543583','1413543206'];
const playlist='https://music.apple.com/cn/playlist/chen-li-essentials/pl.444a175c134e47ad87344f15fdd914ac';
const bar=document.createElement('div');
bar.className='music-bar';
bar.innerHTML='<a href="./#explore" id="galleryBack">← 返回蝴蝶门</a><span id="musicStatus" role="status">选择唱片盒，再点唱片 · 抽碟听音乐</span><a id="appleSong" target="_blank" rel="noopener">Apple Music 歌单</a>';
document.body.append(bar);
const status=document.querySelector('#musicStatus'),link=document.querySelector('#appleSong');
link.href=playlist;
const panel=document.createElement('div');
panel.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);width:min(94vw,660px);z-index:1000;background:#fff;border-radius:16px;box-shadow:0 8px 30px #0002;padding:8px';
panel.hidden=true;
document.body.append(panel);
document.querySelector('#galleryBack').addEventListener('click',e=>{if(window.parent!==window){e.preventDefault();window.galleryMusic.stop();window.parent.postMessage({type:'nono-close-experience'},location.origin)}});
window.galleryMusic={
  play(i){
    if(!Number.isInteger(i)||!ids[i])return;
    const songPath='/cn/song/'+encodeURIComponent(names[i])+'/'+ids[i];
    status.textContent='陈粒 · '+names[i]+' · Apple Music';
    link.href='https://music.apple.com'+songPath;link.textContent='在 Apple Music 打开';
    panel.replaceChildren();
    const frame=document.createElement('iframe');
    frame.src='https://embed.music.apple.com'+songPath;
    frame.title='陈粒 · '+names[i]+' · 官方播放器';
    frame.allow='autoplay *; encrypted-media *; fullscreen *; clipboard-write';
    frame.style.cssText='display:block;width:100%;height:175px;border:0;border-radius:12px';
    panel.append(frame);panel.hidden=false;
  },
  stop(){panel.replaceChildren();panel.hidden=true;status.textContent='选择唱片盒，再点唱片 · 抽碟听音乐';link.href=playlist;link.textContent='Apple Music 歌单';}
};
addEventListener('pagehide',()=>window.galleryMusic.stop());
