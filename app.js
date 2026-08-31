import './styles.css';

const screens = {
  home: document.querySelector('#home-screen'),
  garden: document.querySelector('#garden-screen'),
  activity: document.querySelector('#activity-screen'),
  complete: document.querySelector('#complete-screen'),
};

const instruction = document.querySelector('#activity-instruction');
const activityTitle = document.querySelector('#activity-title');
const activityEyebrow = document.querySelector('#activity-eyebrow');
const activityActions = document.querySelector('#activity-actions');
const soapBar = document.querySelector('#soap-bar');
const dentalHose = document.querySelector('#dental-hose');
const progressDots = document.querySelector('#progress-dots');
const toast = document.querySelector('#toast');
const dentalBoard = document.querySelector('#dental-board');
let step = 0;
let dirtLevel = [];
let soapLevel = [];
let dragActive = false;
let dragX = 0;
let dragY = 0;
let lastFrame = 0;
let frameId = null;
let soundEnabled = true;

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => screen.classList.toggle('hidden', key !== name));
}

function makeProgress(total, current) {
  progressDots.innerHTML = Array.from({ length: total }, (_, index) => `<span class="progress-dot ${index <= current ? 'active' : ''}"></span>`).join('');
}

function notify(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  window.setTimeout(() => toast.classList.add('hidden'), 1800);
}

// Explosão de estrelas cobrindo a tela inteira.
const STAR_CHARS = ['⭐', '✨', '🌟'];
function burstStars(count = 24) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.className = 'star-burst';
    star.textContent = STAR_CHARS[i % STAR_CHARS.length];
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.fontSize = `${22 + Math.random() * 30}px`;
    star.style.setProperty('--tx', `${(Math.random() - 0.5) * 160}px`);
    star.style.setProperty('--ty', `${(Math.random() - 0.5) * 160}px`);
    star.style.setProperty('--rot', `${Math.random() * 360 - 180}deg`);
    star.style.animationDelay = `${Math.random() * 0.35}s`;
    document.body.appendChild(star);
    window.setTimeout(() => star.remove(), 1500);
  }
}

const allDirt = () => document.querySelectorAll('.dirt');
const allSoap = () => document.querySelectorAll('.soap');
// Tempo para ensaboar ou enxaguar cada manchinha (fração por milissegundo).
const TOOL_RATE = 1 / 1000;
const dirtRotations = ['-14deg', '16deg', '-8deg', '10deg'];

function resetTool(tool) {
  tool.style.left = '';
  tool.style.top = '';
  tool.style.right = '';
  tool.style.bottom = '';
  tool.style.transform = '';
  tool.classList.remove('is-dragging', 'spraying');
}

function startFaceWashActivity() {
  step = 1;
  dirtLevel = Array.from(allDirt(), () => 1);
  soapLevel = Array.from(allSoap(), () => 0);
  dentalBoard.classList.remove('reveal-mouth', 'brush-demo', 'rinsing');
  resetTool(soapBar);
  resetTool(dentalHose);
  soapBar.classList.remove('tool-off', 'done', 'hidden-tool');
  dentalHose.classList.remove('tool-off', 'done', 'hose-ready');
  updateSpotVisuals();
  updateToolAvailability();
  // Força uma nova execução da animação sempre que a atividade for aberta novamente.
  void dentalBoard.offsetWidth;
  dentalBoard.classList.add('reveal-mouth');
  activityEyebrow.textContent = 'Cuidando do Pipo';
  activityTitle.textContent = 'Vamos lavar o rostinho do Pipo?';
  instruction.textContent = 'Olha! O rostinho do Pipo está cheio de manchinhas.';
  activityActions.innerHTML = '';
  makeProgress(3, 0);
  showScreen('activity');
  window.setTimeout(() => {
    if (step === 1) instruction.textContent = 'Segure o sabonete sobre as manchinhas!';
  }, 1700);
}

function moveSoapTo(clientX, clientY) {
  const boardRect = dentalBoard.getBoundingClientRect();
  const x = clientX - boardRect.left;
  const y = clientY - boardRect.top;
  soapBar.style.left = `${x}px`;
  soapBar.style.top = `${y}px`;
  soapBar.style.bottom = 'auto';
  soapBar.style.transform = 'translate(-50%, -50%) rotate(-12deg) scale(1.15)';
}

function moveHoseTo(clientX, clientY) {
  const boardRect = dentalBoard.getBoundingClientRect();
  const x = clientX - boardRect.left;
  const y = clientY - boardRect.top;
  // A ponta da mangueirinha acompanha o dedo; o cabo fica à direita.
  dentalHose.style.left = `${x}px`;
  dentalHose.style.top = `${y - 30}px`;
  dentalHose.style.right = 'auto';
  dentalHose.style.bottom = 'auto';
}

function spotHitTest(index, clientX, clientY) {
  const boardRect = dentalBoard.getBoundingClientRect();
  const dirt = allDirt()[index];
  if (!dirt) return false;
  const rect = dirt.getBoundingClientRect();
  const sx = rect.left - boardRect.left;
  const sy = rect.top - boardRect.top;
  const lx = clientX - boardRect.left;
  const ly = clientY - boardRect.top;
  return lx >= sx - 28 && lx <= sx + rect.width + 28 && ly >= sy - 28 && ly <= sy + rect.height + 28;
}

function updateSpotVisuals() {
  const soapEls = allSoap();
  allDirt().forEach((dirt, index) => {
    const d = dirtLevel[index];
    dirt.style.opacity = String(Math.max(0, Math.min(1, d)));
    dirt.style.transform = `scale(${0.45 + 0.55 * d}) rotate(${dirtRotations[index] || '0deg'})`;
    if (soapEls[index]) {
      const s = soapLevel[index];
      soapEls[index].style.opacity = String(Math.max(0, Math.min(1, s)));
      soapEls[index].style.transform = `scale(${0.3 + 0.7 * s})`;
    }
  });
}

function updateToolAvailability() {
  const hasDirt = dirtLevel.some((d) => d > 0.01);
  soapBar.classList.toggle('tool-off', !hasDirt);
  dentalHose.classList.toggle('tool-off', hasDirt);
}

// Estrelinha pequena que aparece no lugar da manchinha ao ser ensaboada ou lavada.
function spawnSpotStar(index) {
  const spot = allDirt()[index] || allSoap()[index];
  if (!spot) return;
  const rect = spot.getBoundingClientRect();
  const star = document.createElement('span');
  star.className = 'spot-star';
  star.textContent = '⭐';
  star.style.left = `${rect.left + rect.width / 2}px`;
  star.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(star);
  window.setTimeout(() => star.remove(), 900);
}

function applySoapHold(clientX, clientY, dt) {
  if (step !== 1) return;
  let changed = false;
  allDirt().forEach((dirt, index) => {
    if (dirtLevel[index] <= 0) return;
    if (!spotHitTest(index, clientX, clientY)) return;
    const wasSoaped = soapLevel[index] >= 1;
    const amount = TOOL_RATE * dt;
    dirtLevel[index] = Math.max(0, dirtLevel[index] - amount);
    soapLevel[index] = Math.min(1, soapLevel[index] + amount);
    if (!wasSoaped && soapLevel[index] >= 1) spawnSpotStar(index);
    changed = true;
  });
  if (changed) {
    updateSpotVisuals();
    if (dirtLevel.every((d) => d <= 0)) startRinsing();
  }
}

function applyRinseHold(clientX, clientY, dt) {
  if (step !== 2) return;
  let changed = false;
  allDirt().forEach((dirt, index) => {
    if (soapLevel[index] <= 0) return;
    if (!spotHitTest(index, clientX, clientY)) return;
    soapLevel[index] = Math.max(0, soapLevel[index] - TOOL_RATE * dt);
    if (soapLevel[index] <= 0) spawnSpotStar(index);
    changed = true;
  });
  if (changed) {
    updateSpotVisuals();
    if (soapLevel.every((s) => s <= 0)) finishWash();
  }
}

function startRinsing() {
  if (step !== 1) return;
  step = 2;
  endHold();
  updateToolAvailability();
  instruction.textContent = 'Agora arraste a mangueirinha para tirar a espuma!';
  activityActions.innerHTML = '';
  makeProgress(3, 1);
  burstStars();
}

function finishWash() {
  if (step !== 2) return;
  step = 3;
  endHold();
  updateToolAvailability();
  dentalHose.classList.add('done');
  dentalBoard.classList.add('rinsing');
  makeProgress(3, 2);
  instruction.textContent = 'Que rostinho brilhando!';
  window.setTimeout(() => showScreen('complete'), 1300);
}

// --- Segurar a ferramenta para acumular ensaboar/enxaguar ---
function startHold(clientX, clientY) {
  dragActive = true;
  dragX = clientX;
  dragY = clientY;
  lastFrame = performance.now();
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(holdTick);
}

function moveHold(clientX, clientY) {
  dragX = clientX;
  dragY = clientY;
}

function endHold() {
  dragActive = false;
  if (frameId) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
}

function holdTick(now) {
  if (!dragActive) return;
  const dt = Math.min(now - lastFrame, 50);
  lastFrame = now;
  if (step === 1) applySoapHold(dragX, dragY, dt);
  else if (step === 2) applyRinseHold(dragX, dragY, dt);
  frameId = requestAnimationFrame(holdTick);
}

function showUpcoming(activity) {
  const labels = { bath: 'O banho da Mimi', diaper: 'A troca de fralda do Toto' };
  notify(`${labels[activity]} será a próxima aventura!`);
}

document.querySelector('#play-button').addEventListener('click', () => showScreen('garden'));
document.querySelector('#garden-back').addEventListener('click', () => showScreen('home'));
document.querySelector('#activity-back').addEventListener('click', () => showScreen('garden'));
document.querySelector('#another-button').addEventListener('click', () => showScreen('garden'));
document.querySelector('#sound-toggle').addEventListener('click', (event) => {
  soundEnabled = !soundEnabled;
  event.currentTarget.textContent = soundEnabled ? '🔈' : '🔇';
  notify(soundEnabled ? 'Sons ligados' : 'Sons desligados');
});
document.querySelector('#parent-button').addEventListener('click', () => notify('Área dos responsáveis em breve.'));

document.querySelectorAll('.patient-card').forEach((card) => card.addEventListener('click', () => {
  const activity = card.dataset.activity;
  if (activity === 'wash') startFaceWashActivity();
  else showUpcoming(activity);
}));

soapBar.addEventListener('pointerdown', (event) => {
  if (step !== 1 || soapBar.classList.contains('tool-off')) return;
  event.preventDefault();
  soapBar.setPointerCapture(event.pointerId);
  soapBar.classList.add('is-dragging');
  moveSoapTo(event.clientX, event.clientY);
  startHold(event.clientX, event.clientY);
});
soapBar.addEventListener('pointermove', (event) => {
  if (step !== 1 || !soapBar.classList.contains('is-dragging')) return;
  moveSoapTo(event.clientX, event.clientY);
  moveHold(event.clientX, event.clientY);
});
const endSoapDrag = () => {
  soapBar.classList.remove('is-dragging');
  soapBar.style.left = '';
  soapBar.style.top = '';
  soapBar.style.bottom = '';
  soapBar.style.transform = '';
  endHold();
};
soapBar.addEventListener('pointerup', endSoapDrag);
soapBar.addEventListener('pointercancel', endSoapDrag);
soapBar.addEventListener('keydown', (event) => {
  if (step === 1 && (event.key === 'Enter' || event.key === ' ')) {
    dirtLevel = dirtLevel.map(() => 0);
    soapLevel = soapLevel.map(() => 1);
    updateSpotVisuals();
    startRinsing();
  }
});

dentalHose.addEventListener('pointerdown', (event) => {
  if (step !== 2 || dentalHose.classList.contains('tool-off')) return;
  event.preventDefault();
  dentalHose.setPointerCapture(event.pointerId);
  dentalHose.classList.add('is-dragging', 'spraying');
  moveHoseTo(event.clientX, event.clientY);
  startHold(event.clientX, event.clientY);
});
dentalHose.addEventListener('pointermove', (event) => {
  if (step !== 2 || !dentalHose.classList.contains('is-dragging')) return;
  moveHoseTo(event.clientX, event.clientY);
  moveHold(event.clientX, event.clientY);
});
const endHoseDrag = () => {
  dentalHose.classList.remove('is-dragging', 'spraying');
  dentalHose.style.left = '';
  dentalHose.style.top = '';
  dentalHose.style.right = '';
  dentalHose.style.bottom = '';
  endHold();
};
dentalHose.addEventListener('pointerup', endHoseDrag);
dentalHose.addEventListener('pointercancel', endHoseDrag);
dentalHose.addEventListener('keydown', (event) => {
  if (step === 2 && (event.key === 'Enter' || event.key === ' ')) {
    soapLevel = soapLevel.map(() => 0);
    updateSpotVisuals();
    finishWash();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    if (import.meta.env.PROD) {
      await navigator.serviceWorker.register('./sw.js').catch(() => {});
      return;
    }

    // Evita que o cache do PWA interfira no hot reload e nos arquivos CSS do Vite.
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  });
}
