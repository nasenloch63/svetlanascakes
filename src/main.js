import './style.css';
import { translations, menu, whatsappUrl } from './content.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const german = {
  closeNav: 'Menü schließen', imprintTitle: 'Impressum', privacyTitle: 'Datenschutz',
  imprintText: 'Dies ist ein klar gekennzeichneter Platzhalter und kein vollständiges Impressum. Die gesetzlich erforderlichen Betreiberangaben müssen vor der Veröffentlichung ergänzt und geprüft werden.',
  privacyText: 'Dies ist ein klar gekennzeichneter Platzhalter und keine vollständige Datenschutzerklärung. Vor der Veröffentlichung muss der Betreiber eine zum tatsächlichen Hosting und den verwendeten Diensten passende Datenschutzerklärung ergänzen und prüfen lassen.',
  zoomOut: 'Bild verkleinern', pageTitle: document.title, pageDescription: $('meta[name="description"]').content,
};
const attributes = [['data-i18n', 'innerHTML'], ['data-label', 'aria-label'], ['data-alt', 'alt'], ['data-placeholder', 'placeholder']];
for (const [dataAttribute, target] of attributes) {
  for (const element of $$(`[${dataAttribute}]`)) {
    german[element.getAttribute(dataAttribute)] = target === 'innerHTML' ? element.innerHTML : element.getAttribute(target);
  }
}
translations.de = german;
let language = 'de';
let category = 'sweet';
let galleryIndex = 0;
let lightboxType = 'gallery';
let legalType = 'imprint';
const gallery = [
  ['cafe-interior', 'galleryInterior', 'galleryCaption1'],
  ['desserts', 'dessertAlt', 'galleryCaption2'],
  ['sweet-moment', 'sweetAlt', 'galleryCaption3'],
  ['cafe-window', 'windowAlt', 'galleryCaption4'],
  ['pastries', 'pastryAlt', 'galleryCaption5'],
];
const t = (key) => translations[language][key] ?? translations.de[key] ?? key;

function renderMenu() {
  $('#menu-items').replaceChildren(...menu[language][category].map(([title, description]) => {
    const row = document.createElement('div');
    row.className = 'menu-row';
    const heading = document.createElement('h3');
    heading.textContent = title;
    const text = document.createElement('p');
    text.textContent = description;
    row.append(heading, text);
    return row;
  }));
}

function setLanguage(value) {
  language = value === 'en' ? 'en' : 'de';
  document.documentElement.lang = language;
  for (const [dataAttribute, target] of attributes) {
    for (const element of $$(`[${dataAttribute}]`)) {
      const value = t(element.getAttribute(dataAttribute));
      if (target === 'innerHTML') element.innerHTML = value;
      else element.setAttribute(target, value);
    }
  }
  for (const button of $$('[data-lang]')) button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  document.title = t('pageTitle');
  $('meta[name="description"]').content = t('pageDescription');
  $('meta[property="og:title"]').content = t('pageTitle');
  $('meta[property="og:description"]').content = t('pageDescription');
  $('meta[property="og:locale"]').content = language === 'de' ? 'de_DE' : 'en_GB';
  $('.nav-toggle').setAttribute('aria-label', t($('.nav-toggle').getAttribute('aria-expanded') === 'true' ? 'closeNav' : 'openNav'));
  try { localStorage.setItem('svetlana-language', language); } catch { /* Site remains usable when storage is disabled. */ }
  renderMenu();
  if ($('#lightbox').open) renderLightbox();
  if ($('#legal-dialog').open) renderLegal();
}

for (const button of $$('[data-lang]')) button.addEventListener('click', () => setLanguage(button.dataset.lang));
try { language = localStorage.getItem('svetlana-language') === 'en' ? 'en' : 'de'; } catch { /* German remains the default. */ }
setLanguage(language);

function setNavigation(open) {
  $('.nav-toggle').setAttribute('aria-expanded', String(open));
  $('.nav-toggle').setAttribute('aria-label', t(open ? 'closeNav' : 'openNav'));
  $('#navigation').classList.toggle('is-open', open);
}
$('.nav-toggle').addEventListener('click', () => setNavigation($('.nav-toggle').getAttribute('aria-expanded') !== 'true'));
for (const anchor of $$('#navigation a')) anchor.addEventListener('click', () => setNavigation(false));
document.addEventListener('click', (event) => { if (!$('.header').contains(event.target)) setNavigation(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('.nav-toggle').getAttribute('aria-expanded') === 'true') { setNavigation(false); $('.nav-toggle').focus(); }
});
const desktop = matchMedia('(min-width: 900px)');
desktop.addEventListener('change', () => setNavigation(false));

function selectCategory(value) {
  category = value;
  for (const button of $$('[data-category]')) {
    const active = button.dataset.category === category;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  }
  $('#menu-items').setAttribute('aria-labelledby', `${category}-tab`);
  renderMenu();
}
for (const button of $$('[data-category]')) {
  button.addEventListener('click', () => selectCategory(button.dataset.category));
  button.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const value = event.key === 'Home' ? 'sweet' : event.key === 'End' ? 'drinks' : category === 'sweet' ? 'drinks' : 'sweet';
      selectCategory(value);
      $(`[data-category="${value}"]`).focus();
    }
  });
}

const lightbox = $('#lightbox');
function resetZoom() {
  $('.lightbox-image-wrap').classList.remove('zoomed');
  $('#zoom-image').textContent = '＋';
  $('#zoom-image').setAttribute('aria-label', t('zoomIn'));
  $('.lightbox-image-wrap').scrollTo(0, 0);
}
function renderLightbox() {
  resetZoom();
  const [name, altKey, captionKey] = gallery[galleryIndex];
  $('#lightbox-image').src = lightboxType === 'menu' ? '/images/menu.webp' : `/images/${name}-960.webp`;
  $('#lightbox-image').alt = t(lightboxType === 'menu' ? 'menuAlt' : altKey);
  $('#lightbox-caption').textContent = t(lightboxType === 'menu' ? 'originalMenu' : captionKey);
  $('.lightbox-bottom').hidden = lightboxType === 'menu';
  $('#image-count').textContent = `${galleryIndex + 1} / ${gallery.length}`;
}
function openLightbox(type, index = 0) {
  lightboxType = type;
  galleryIndex = index;
  renderLightbox();
  lightbox.showModal();
  document.body.classList.add('modal-open');
  $('#close-lightbox').focus();
}
for (const button of $$('[data-gallery]')) button.addEventListener('click', () => openLightbox('gallery', Number(button.dataset.gallery)));
for (const button of $$('[data-open-menu]')) button.addEventListener('click', () => openLightbox('menu'));
$('#close-lightbox').addEventListener('click', () => lightbox.close());
function changeImage(direction) {
  galleryIndex = (galleryIndex + direction + gallery.length) % gallery.length;
  renderLightbox();
}
$('#previous-image').addEventListener('click', () => changeImage(-1));
$('#next-image').addEventListener('click', () => changeImage(1));
lightbox.addEventListener('keydown', (event) => {
  if (lightboxType !== 'gallery' || $('.lightbox-image-wrap').classList.contains('zoomed')) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); changeImage(event.key === 'ArrowRight' ? 1 : -1); }
});
$('#zoom-image').addEventListener('click', () => {
  const zoomed = $('.lightbox-image-wrap').classList.toggle('zoomed');
  $('#zoom-image').textContent = zoomed ? '−' : '＋';
  $('#zoom-image').setAttribute('aria-label', t(zoomed ? 'zoomOut' : 'zoomIn'));
});

function renderLegal() {
  $('#legal-title').textContent = t(`${legalType}Title`);
  $('#legal-text').textContent = t(`${legalType}Text`);
}
for (const button of $$('[data-legal]')) button.addEventListener('click', () => {
  legalType = button.dataset.legal;
  renderLegal();
  $('#legal-dialog').showModal();
  document.body.classList.add('modal-open');
});
$('#close-legal').addEventListener('click', () => $('#legal-dialog').close());
for (const dialog of $$('dialog')) {
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
}

$('#whatsapp-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('#name');
  const message = $('#message');
  for (const field of [name, message]) {
    if (!field.value.trim()) { field.value = ''; field.reportValidity(); return; }
  }
  window.open(whatsappUrl(name.value, message.value, language), '_blank', 'noopener,noreferrer');
});
$('#year').textContent = new Date().getFullYear();

const motion = matchMedia('(prefers-reduced-motion: reduce)');
if (!motion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }, { threshold: .08 });
  $$('.reveal').forEach((element) => observer.observe(element));
  motion.addEventListener('change', () => { if (motion.matches) document.documentElement.classList.remove('js-motion'); });
}
const cursorQuery = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const cursor = $('.cursor');
document.addEventListener('pointermove', (event) => {
  if (!cursorQuery.matches || event.pointerType === 'touch') { cursor.classList.remove('active'); return; }
  cursor.classList.add('active');
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
  cursor.classList.toggle('over', Boolean(event.target.closest('a, button')));
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('active'));
cursorQuery.addEventListener('change', () => cursor.classList.remove('active'));
