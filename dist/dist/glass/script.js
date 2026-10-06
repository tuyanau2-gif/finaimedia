const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  mobileMenu.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (canHover.matches && !reducedMotion.matches) {
  document.querySelectorAll('.tilt-3d').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      item.style.transform = `perspective(950px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateY(-3px)`;
    });
    item.addEventListener('pointerleave', () => { item.style.transform = ''; });
  });
}

const botProfiles = {
  balance: {
    title: 'FinAI Balance',
    role: 'Финансовый консультант',
    icon: 'bot-balance-3d.webp',
    copy: 'Начните с ясной картины своих денег. Помощник разберёт денежные потоки, найдёт точки экономии и превратит финансовую цель в реалистичный ежемесячный план.',
    steps: ['Аудит бюджета', 'План накоплений', 'Приоритеты по долгам'],
    link: 'balance.html'
  },
  invest: {
    title: 'FinAI Invest',
    role: 'AI-анализатор акций',
    icon: 'bot-invest-3d.webp',
    copy: 'Помощник читает фундаментальные показатели компании и переводит отчётность на понятный язык: показывает сильные стороны, риски и контекст инвестиционного горизонта без сигналов и обещаний доходности.',
    steps: ['Фундаментальные показатели', 'Риски компании', 'Контекст российского рынка'],
    link: 'invest.html'
  },
  mentor: {
    title: 'FinAI Mentor',
    role: 'Персональный AI-ментор развития',
    icon: 'bot-mentor-3d.webp',
    copy: 'Ментор определит, каких знаний не хватает для выбранной профессии, предложит короткие уроки и продолжит обучение с учётом вашего прогресса.',
    steps: ['Диагностика навыков', 'Персональные уроки', 'История прогресса'],
    link: 'mentor.html'
  },
  business: {
    title: 'FinAI Business',
    role: 'Финансы малого бизнеса',
    icon: 'bot-business-3d.webp',
    copy: 'Помощник анализирует Excel- и PDF-отчёты, маркетинговые показатели и договоры с поставщиками, чтобы показать потери, спорные условия и точки роста.',
    steps: ['Финансы и маркетинг', 'Отчёты Excel и PDF', 'Проверка договоров'],
    link: 'business.html'
  },
  junior: {
    title: 'FinAI Junior',
    role: 'Игровой помощник для детей и родителей',
    icon: 'bot-junior-3d.webp',
    copy: 'Помощник объясняет деньги через истории, выборы и семейные задания с учётом возраста ребёнка. Без скучной теории и запугивания ошибками.',
    steps: ['Финансовые сказки', 'Игровые задания', 'Разговоры о деньгах в семье'],
    link: 'junior.html'
  }
};

const scoreMap = {
  budget: { balance: 5 },
  save: { balance: 4, invest: 1 },
  debt: { balance: 5 },
  invest: { invest: 6 },
  career: { mentor: 7 },
  business: { business: 8 },
  junior: { junior: 9 }
};

const form = document.getElementById('recommendation-form');
const checkboxes = [...form.querySelectorAll('input[name="task"]')];
const submitButton = form.querySelector('button[type="submit"]');
const formHint = form.querySelector('.form-hint');
const recommendation = document.getElementById('recommendation');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const count = checkboxes.filter((item) => item.checked).length;
    submitButton.disabled = count === 0;
    formHint.textContent = count === 0
      ? 'Отметьте хотя бы одну задачу'
      : `Выбрано задач: ${count}`;
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const selected = checkboxes.filter((item) => item.checked).map((item) => item.value);
  if (!selected.length) return;

  const scores = { balance: 0, invest: 0, mentor: 0, business: 0, junior: 0 };
  selected.forEach((task) => {
    Object.entries(scoreMap[task]).forEach(([bot, score]) => { scores[bot] += score; });
  });

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const profile = botProfiles[winner];

  document.getElementById('result-icon').src = profile.icon;
  document.getElementById('result-title').textContent = profile.title;
  document.getElementById('result-role').textContent = profile.role;
  document.getElementById('result-copy').textContent = profile.copy;
  document.getElementById('result-link').href = profile.link;
  document.getElementById('result-list').innerHTML = profile.steps.map((step) => `<li>${step}</li>`).join('');

  form.hidden = true;
  recommendation.hidden = false;
  recommendation.focus({ preventScroll: true });
});

document.getElementById('reset-button').addEventListener('click', () => {
  recommendation.hidden = true;
  form.hidden = false;
  checkboxes.forEach((item) => { item.checked = false; });
  submitButton.disabled = true;
  formHint.textContent = 'Отметьте хотя бы одну задачу';
  checkboxes[0].focus();
});

document.getElementById('result-link').addEventListener('click', (event) => {
  const href = event.currentTarget.getAttribute('href');
  if (!href.startsWith('#')) return;
  const card = document.querySelector(href);
  if (!card) return;
  document.querySelectorAll('.bot-card').forEach((item) => item.classList.remove('highlight'));
  card.classList.add('highlight');
  window.setTimeout(() => card.classList.remove('highlight'), 2400);
});

const leadDialog = document.getElementById('lead-dialog');

document.querySelectorAll('[data-open-lead]').forEach((button) => {
  button.addEventListener('click', () => {
    if (leadDialog?.showModal) leadDialog.showModal();
  });
});

leadDialog?.querySelector('.lead-dialog-close')?.addEventListener('click', () => leadDialog.close());
leadDialog?.addEventListener('click', (event) => {
  const bounds = leadDialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
    && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) leadDialog.close();
});

leadDialog?.querySelector('[data-print-lead]')?.addEventListener('click', () => window.print());

document.querySelectorAll('.article-open').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (dialog?.showModal) dialog.showModal();
  });
});

document.querySelectorAll('.article-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
      && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    if (!inside) dialog.close();
  });
});

const privacyDialog = document.getElementById('privacy-dialog');

document.querySelectorAll('[data-open-privacy]').forEach((button) => {
  button.addEventListener('click', () => {
    if (privacyDialog?.showModal) privacyDialog.showModal();
  });
});

privacyDialog?.querySelector('.privacy-close').addEventListener('click', () => privacyDialog.close());
privacyDialog?.addEventListener('click', (event) => {
  const bounds = privacyDialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
    && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) privacyDialog.close();
});

const cookieBanner = document.getElementById('cookie-banner');

try {
  if (!localStorage.getItem('finai_cookie_choice')) {
    cookieBanner.hidden = false;
    document.body.classList.add('cookie-visible');
  }
} catch (error) {
  cookieBanner.hidden = false;
  document.body.classList.add('cookie-visible');
}

document.querySelectorAll('[data-cookie-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    try { localStorage.setItem('finai_cookie_choice', button.dataset.cookieChoice); } catch (error) { /* Storage may be unavailable. */ }
    cookieBanner.hidden = true;
    document.body.classList.remove('cookie-visible');
  });
});

const contactWidget = document.getElementById('contact-widget');
const contactToggle = contactWidget.querySelector('.contact-toggle');
const contactMenu = document.getElementById('contact-menu');

const setContactOpen = (open) => {
  contactMenu.hidden = !open;
  contactToggle.setAttribute('aria-expanded', String(open));
};

contactToggle.addEventListener('click', () => {
  setContactOpen(contactToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('click', (event) => {
  if (!contactWidget.contains(event.target)) setContactOpen(false);
  document.querySelectorAll('.bots-burger[open]').forEach((menu) => {
    if (!menu.contains(event.target)) menu.removeAttribute('open');
  });
});

window.setTimeout(() => {
  try {
    if (!sessionStorage.getItem('finai_contact_seen')) {
      setContactOpen(true);
      sessionStorage.setItem('finai_contact_seen', '1');
    }
  } catch (error) {
    setContactOpen(true);
  }
}, 2600);
