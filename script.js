const chapterButtons = document.querySelectorAll('.chapter-button');
const actionButtons = document.querySelectorAll('[data-target]');
const chapterPanels = document.querySelectorAll('.chapter-panel');
const showMoreLoveButton = document.getElementById('showMoreLove');
const extraMessage = document.getElementById('extraMessage');
const letterModal = document.getElementById('letterModal');
const openLetterButtons = [document.getElementById('openLetter'), document.getElementById('openLetterTop')];
const closeLetterButton = document.getElementById('closeLetter');
const closeModalBackdrop = document.getElementById('closeModalBackdrop');
const letterDialog = letterModal.querySelector('.modal-content');
const musicToggle = document.getElementById('musicToggle');
const musicState = document.getElementById('musicState');
const bgMusic = document.getElementById('bgMusic');
const particles = document.getElementById('particles');
const cursorHeart = document.querySelector('.cursor-heart');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');

const extraMessages = [
  'Even after all these years, you still feel like my favorite surprise.',
  'If I had to choose my home in one word, I would still choose your name.',
  'You and me, food, long drives, and late night talks. That is my perfect life.',
  'You are the calm my heart looks for after every difficult day.',
  'The best part of growing up has been growing with you.',
  'Your love makes ordinary moments feel like precious memories.',
  'I still smile at my phone because of you, just like I did in the beginning.',
  'No matter how much we change, I hope we always stay this deeply ours.'
];

let currentScore = 0;
let heartSpawnInterval = null;
let musicStarted = false;
let activePanelId = 'anniversary';

function setActivePanel(targetId) {
  activePanelId = targetId;

  chapterButtons.forEach((button) => {
    const isActive = button.dataset.target === targetId;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  chapterPanels.forEach((panel) => {
    const isActive = panel.id === targetId;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });

  if (targetId === 'game') {
    startGameHearts();
  }
}

chapterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setActivePanel(button.dataset.target);
  });
});

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    if (targetId) {
      setActivePanel(targetId);
    }
  });
});

showMoreLoveButton.addEventListener('click', () => {
  const randomMessage = extraMessages[Math.floor(Math.random() * extraMessages.length)];
  extraMessage.textContent = randomMessage;
  extraMessage.classList.remove('visible');

  requestAnimationFrame(() => {
    extraMessage.classList.add('visible');
  });
});

function openLetterModal() {
  letterModal.classList.add('open');
  letterModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeLetterButton.focus();
}

function closeLetterModal() {
  letterModal.classList.remove('open');
  letterModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

openLetterButtons.forEach((button) => {
  button.addEventListener('click', openLetterModal);
});

closeLetterButton.addEventListener('click', closeLetterModal);
closeModalBackdrop.addEventListener('click', closeLetterModal);
letterDialog.addEventListener('click', (event) => {
  event.stopPropagation();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && letterModal.classList.contains('open')) {
    closeLetterModal();
  }
});

async function toggleMusic() {
  if (!musicStarted) {
    musicStarted = true;
    bgMusic.volume = 0.35;
  }

  if (bgMusic.paused) {
    try {
      await bgMusic.play();
      musicState.textContent = 'Pause Music';
    } catch (error) {
      musicState.textContent = 'Tap Again for Music';
    }
  } else {
    bgMusic.pause();
    musicState.textContent = 'Play Music';
  }
}

musicToggle.addEventListener('click', toggleMusic);

function createHeroParticle() {
  const particle = document.createElement('span');
  const isHeart = Math.random() > 0.45;
  particle.className = isHeart ? 'heart-particle' : 'sparkle';

  if (isHeart) {
    particle.textContent = ['❤', '♡', '💗', '💕'][Math.floor(Math.random() * 4)];
    particle.style.fontSize = `${0.8 + Math.random() * 1.1}rem`;
  } else {
    particle.style.width = `${5 + Math.random() * 6}px`;
    particle.style.height = particle.style.width;
  }

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.bottom = '-20px';
  particle.style.animationDuration = `${6 + Math.random() * 8}s`;
  particles.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 15000);
}

setInterval(createHeroParticle, 380);

document.addEventListener('pointermove', (event) => {
  cursorHeart.style.left = `${event.clientX}px`;
  cursorHeart.style.top = `${event.clientY}px`;
});

function showScoreBurst(x, y) {
  const burst = document.createElement('span');
  burst.className = 'score-pop';
  burst.textContent = '+1 love';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  gameArea.appendChild(burst);

  setTimeout(() => {
    burst.remove();
  }, 800);
}

function spawnGameHeart() {
  if (activePanelId !== 'game') {
    return;
  }

  const heart = document.createElement('button');
  heart.type = 'button';
  heart.className = 'collect-heart';
  heart.textContent = ['💖', '💗', '💕', '💘'][Math.floor(Math.random() * 4)];

  const maxX = gameArea.clientWidth - 48;
  const maxY = gameArea.clientHeight - 48;

  heart.style.left = `${Math.max(0, Math.random() * maxX)}px`;
  heart.style.top = `${Math.max(0, Math.random() * maxY)}px`;

  heart.addEventListener('click', () => {
    currentScore += 1;
    scoreElement.textContent = currentScore;
    showScoreBurst(heart.offsetLeft, heart.offsetTop);
    heart.remove();
  });

  gameArea.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2200);
}

function startGameHearts() {
  if (heartSpawnInterval) {
    return;
  }

  heartSpawnInterval = setInterval(spawnGameHeart, 900);
}

setActivePanel(activePanelId);
