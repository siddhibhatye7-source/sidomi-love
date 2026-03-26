const chapterButtons = document.querySelectorAll('.chapter-button');
const actionButtons = document.querySelectorAll('[data-target]');
const chapterPanels = document.querySelectorAll('.chapter-panel');
const backButtons = document.querySelectorAll('.back-button');
const homeHub = document.getElementById('homeHub');
const chapterStage = document.getElementById('chapterStage');
const showMoreLoveButton = document.getElementById('showMoreLove');
const extraMessage = document.getElementById('extraMessage');
const letterModal = document.getElementById('letterModal');
const openLetterButtons = [document.getElementById('openLetter'), document.getElementById('openLetterTop')].filter(Boolean);
const closeLetterButton = document.getElementById('closeLetter');
const closeModalBackdrop = document.getElementById('closeModalBackdrop');
const letterDialog = letterModal ? letterModal.querySelector('.modal-content') : null;
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
let activePanelId = null;

function setActivePanel(targetId) {
  if (!homeHub || !chapterStage) {
    return;
  }

  activePanelId = targetId;
  homeHub.hidden = true;
  chapterStage.hidden = false;
  document.body.classList.add('modal-open');

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

function showHomeHub() {
  if (!homeHub || !chapterStage) {
    return;
  }

  activePanelId = null;
  homeHub.hidden = false;
  chapterStage.hidden = true;
  document.body.classList.remove('modal-open');

  chapterButtons.forEach((button) => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });

  chapterPanels.forEach((panel) => {
    panel.classList.remove('active');
    panel.hidden = true;
  });
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

backButtons.forEach((button) => {
  button.addEventListener('click', showHomeHub);
});

if (showMoreLoveButton && extraMessage) {
  showMoreLoveButton.addEventListener('click', () => {
    const randomMessage = extraMessages[Math.floor(Math.random() * extraMessages.length)];
    extraMessage.textContent = randomMessage;
    extraMessage.classList.remove('visible');

    requestAnimationFrame(() => {
      extraMessage.classList.add('visible');
    });
  });
}

function openLetterModal() {
  if (!letterModal || !closeLetterButton) {
    return;
  }

  letterModal.classList.add('open');
  letterModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeLetterButton.focus();
}

function closeLetterModal() {
  if (!letterModal) {
    return;
  }

  letterModal.classList.remove('open');
  letterModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

openLetterButtons.forEach((button) => {
  button.addEventListener('click', openLetterModal);
});

if (closeLetterButton) {
  closeLetterButton.addEventListener('click', closeLetterModal);
}

if (closeModalBackdrop) {
  closeModalBackdrop.addEventListener('click', closeLetterModal);
}

if (letterDialog) {
  letterDialog.addEventListener('click', (event) => {
    event.stopPropagation();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && letterModal && letterModal.classList.contains('open')) {
    closeLetterModal();
  }
});

function createHeroParticle() {
  if (!particles) {
    return;
  }

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

if (particles) {
  setInterval(createHeroParticle, 380);
}

if (cursorHeart) {
  document.addEventListener('pointermove', (event) => {
    cursorHeart.style.left = `${event.clientX}px`;
    cursorHeart.style.top = `${event.clientY}px`;
  });
}

function showScoreBurst(x, y) {
  if (!gameArea) {
    return;
  }

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
  if (activePanelId !== 'game' || !gameArea || !scoreElement) {
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

showHomeHub();
