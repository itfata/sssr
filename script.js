const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const menuButton = document.querySelector('[data-menu]');
const gallery = document.querySelector('[data-gallery]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = lightbox?.querySelector('img');
const closeLightbox = document.querySelector('[data-close]');
const form = document.querySelector('[data-form]');
const formNote = document.querySelector('[data-form-note]');

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  header.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
});

nav?.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    nav.classList.remove('is-open');
    header.classList.remove('is-open');
  }
});

gallery?.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  const image = button?.querySelector('img');
  if (!image || !lightboxImage) return;

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
});

const hideLightbox = () => {
  lightbox?.classList.remove('is-open');
  lightbox?.setAttribute('aria-hidden', 'true');
};

closeLightbox?.addEventListener('click', hideLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) hideLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideLightbox();
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  submitButton.disabled = true;
  submitButton.textContent = 'Надсилаємо...';
  formNote.textContent = 'Заявка відправляється. Зачекайте кілька секунд.';

  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    formNote.textContent = "Дякуємо! Заявку надіслано. Ми зв'яжемося з вами найближчим часом.";
    form.reset();
  } catch (error) {
    formNote.textContent = 'Не вдалося надіслати заявку. Будь ласка, зателефонуйте або спробуйте ще раз.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Надіслати заявку';
  }
});
