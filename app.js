const opening = document.querySelector('#opening');
const idleVideo = document.querySelector('#idleVideo');
const video = document.querySelector('#openingVideo');
const finaleVideo = document.querySelector('#finaleVideo');
const start = document.querySelector('#startButton');
const butterflyButton = document.querySelector('#butterflyButton');
const butterflyReveal = document.querySelector('#butterflyReveal');
const skip = document.querySelector('#skipButton');
const motion = document.querySelector('#motionButton');
const sound = document.querySelector('#soundButton');
const replay = document.querySelector('#replayButton');
const progress = document.querySelector('#progressBar');
const progressWrap = document.querySelector('#progress');
const status = document.querySelector('#status');

const systemReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let reduced = systemReduced || localStorage.getItem('butterfly-motion') === 'reduced';
let entering = false;
let switchTimer;
let finaleTimer;
let finaleStarted = false;
let revealTimer;

function announce(message) { status.textContent = message; }

function updateMotion() {
  opening.classList.toggle('is-reduced', reduced);
  motion.setAttribute('aria-pressed', String(reduced));
  motion.setAttribute('aria-label', reduced ? '恢复动态' : '减少动态');
  motion.querySelector('.desktop-label').textContent = reduced ? '恢复动态' : '减少动态';
  if (reduced) {
    idleVideo.pause();
  } else if (!opening.classList.contains('is-playing') && butterflyReveal.hidden) {
    idleVideo.play().catch(() => announce('点击 START 气泡，推开蝴蝶门'));
  }
}

function startIntro() {
  opening.classList.remove('is-entering', 'is-playing', 'is-switching', 'is-finale', 'is-final-switching', 'is-awaiting-butterfly', 'is-butterfly-clicked', 'is-butterfly-revealing', 'is-butterfly-page');
  window.clearTimeout(switchTimer);
  window.clearTimeout(finaleTimer);
  window.clearTimeout(revealTimer);
  entering = false;
  finaleStarted = false;
  video.pause();
  video.currentTime = 0;
  finaleVideo.pause();
  finaleVideo.currentTime = 0;
  butterflyButton.hidden = true;
  butterflyButton.disabled = false;
  butterflyReveal.hidden = true;
  idleVideo.currentTime = 0;
  if (!reduced) idleVideo.play().catch(() => {});
  progress.style.width = '0%';
  progressWrap.hidden = true;
  announce('点击 START 气泡，推开蝴蝶门');
  start.focus({ preventScroll: true });
}

async function playFinale() {
  if (finaleStarted || entering) return;
  finaleStarted = true;
  finaleVideo.currentTime = 0;
  try {
    if (finaleVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise((resolve, reject) => {
        finaleVideo.addEventListener('loadeddata', resolve, { once: true });
        finaleVideo.addEventListener('error', reject, { once: true });
        finaleVideo.load();
      });
    }
    opening.classList.add('is-finale', 'is-final-switching');
    await finaleVideo.play();
    finaleTimer = window.setTimeout(() => {
      video.pause();
      opening.classList.remove('is-final-switching');
    }, 760);
    announce('跟随蝴蝶，继续向前');
  } catch {
    finaleStarted = false;
    announce('蝴蝶动画暂时无法播放，请点击画面重试');
    finaleVideo.onclick = () => playFinale();
  }
}

async function playDoorOpening() {
  if (opening.classList.contains('is-playing') || entering) return;
  video.currentTime = 0;
  try {
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await new Promise((resolve, reject) => {
        video.addEventListener('loadeddata', resolve, { once: true });
        video.addEventListener('error', reject, { once: true });
        video.load();
      });
    }
    await video.play();
    opening.classList.add('is-switching', 'is-playing');
    switchTimer = window.setTimeout(() => {
      idleVideo.pause();
      opening.classList.remove('is-switching');
    }, 920);
    progressWrap.hidden = false;
    announce('蝴蝶门正在打开');
  } catch {
    opening.classList.remove('is-playing');
    progressWrap.hidden = true;
    announce('动画暂时无法播放，请再次点击 START');
  }
}

function enterWorld() {
  if (entering) return;
  entering = true;
  idleVideo.pause();
  video.pause();
  finaleVideo.pause();
  window.location.assign('./world/index.html');
}

function revealWorldThroughButterfly() {
  enterWorld();
}

start.addEventListener('click', playDoorOpening);
skip.addEventListener('click', () => enterWorld({ immediate: true }));
replay.addEventListener('click', startIntro);

motion.addEventListener('click', () => {
  reduced = !reduced;
  localStorage.setItem('butterfly-motion', reduced ? 'reduced' : 'full');
  updateMotion();
  announce(reduced ? '已开启减少动态模式' : '已恢复完整动态');
});

sound.addEventListener('click', async () => {
  const turnOn = video.muted;
  video.muted = !turnOn;
  finaleVideo.muted = !turnOn;
  sound.setAttribute('aria-pressed', String(turnOn));
  sound.setAttribute('aria-label', turnOn ? '关闭声音' : '开启声音');
  localStorage.setItem('butterfly-sound', turnOn ? 'on' : 'off');
  if (turnOn && opening.classList.contains('is-finale')) await finaleVideo.play().catch(() => announce('浏览器暂时无法播放声音'));
  else if (turnOn && opening.classList.contains('is-playing')) await video.play().catch(() => announce('浏览器暂时无法播放声音'));
  announce(turnOn ? '声音已开启' : '声音已关闭');
});

video.addEventListener('timeupdate', () => {
  if (video.duration) progress.style.width = `${Math.min(50, video.currentTime / video.duration * 50)}%`;
  if (!reduced && video.duration && video.duration - video.currentTime <= .72) playFinale();
});
finaleVideo.addEventListener('timeupdate', () => {
  if (finaleVideo.duration) progress.style.width = `${Math.min(100, 50 + finaleVideo.currentTime / finaleVideo.duration * 50)}%`;
});
video.addEventListener('ended', () => { if (!finaleStarted) playFinale(); });
finaleVideo.addEventListener('ended', () => {
  progress.style.width = '100%';
  opening.classList.add('is-awaiting-butterfly');
  butterflyButton.hidden = false;
  announce('点击手心中的蝴蝶，进入门后的世界');
  butterflyButton.focus({ preventScroll: true });
});
butterflyButton.addEventListener('click', () => {
  if (!opening.classList.contains('is-awaiting-butterfly') || entering) return;
  opening.classList.remove('is-awaiting-butterfly');
  opening.classList.add('is-butterfly-clicked');
  butterflyButton.disabled = true;
  window.setTimeout(revealWorldThroughButterfly, 180);
});
idleVideo.addEventListener('error', () => announce('动态开屏暂时无法加载，仍可点击 START 进入'));
video.addEventListener('error', () => { opening.classList.remove('is-playing'); progressWrap.hidden = true; announce('视频暂时无法加载，请使用“跳过动画”进入'); });
finaleVideo.addEventListener('error', () => announce('蝴蝶动画暂时无法加载，请刷新重试'));

// Restoring this entry from browser history must start at the original door.
window.addEventListener('pageshow', event => { if (event.persisted) startIntro(); });

updateMotion();
startIntro();
