const juniorMenuButton = document.querySelector('.menu-button');
const juniorMobileMenu = document.querySelector('.mobile-menu');

juniorMenuButton?.addEventListener('click', () => {
  const open = juniorMenuButton.getAttribute('aria-expanded') === 'true';
  juniorMenuButton.setAttribute('aria-expanded', String(!open));
  juniorMobileMenu.hidden = open;
});

juniorMobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  juniorMenuButton.setAttribute('aria-expanded', 'false');
  juniorMobileMenu.hidden = true;
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const choiceTexts = {
  wish: 'Хороший вариант, если Мира сначала сравнит желания и поймёт, какое из них действительно важнее. Остаток можно сохранить.',
  split: 'Разделить деньги можно, но важно заранее решить пропорции: часть на покупку, часть на подарок и часть оставить на цель.',
  wait: 'Пауза помогает проверить желание. Если через неделю вещь всё ещё важна, решение будет более осознанным.'
};

document.querySelectorAll('[data-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-choice]').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    document.getElementById('choice-result').textContent = choiceTexts[button.dataset.choice];
  });
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('.bots-burger[open]').forEach((menu) => {
    if (!menu.contains(event.target)) menu.removeAttribute('open');
  });
});

