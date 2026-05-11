/* Navbar scroll */
const nb = document.getElementById('navbar');
if (nb) window.addEventListener('scroll', () => nb.classList.toggle('scrolled', scrollY > 20), {passive: true});

/* Mobile menu */
const hb = document.getElementById('hamburger');
const mm = document.getElementById('mmenu');
if (hb && mm) {
  const mclose = document.getElementById('mclose');
  if (mclose) mclose.onclick = cm;
  hb.onclick = () => {
    mm.classList.add('open');
    hb.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
}
function cm() {
  const menu = document.getElementById('mmenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Dropdown nav */
function cna() { document.querySelectorAll('.nitem').forEach(e => e.classList.remove('open')); }
function tn(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const was = el.classList.contains('open');
  cna();
  if (!was) el.classList.add('open');
}
document.addEventListener('click', e => { if (!e.target.closest('.nitem')) cna(); });

/* Scroll reveal */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
  });
}, {threshold: .1, rootMargin: '0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth'}); }
  });
});

/* Contact form — Formspree */
const FORMSPREE_URL = 'https://formspree.io/f/xwvyyeyv';

function showFormError(form, btn, originalText, msg) {
  let errEl = form.querySelector('.ferr');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'ferr';
    btn.parentNode.insertBefore(errEl, btn);
  }
  errEl.textContent = msg;
  btn.textContent = originalText;
  btn.disabled = false;
}

function initForm(form) {
  if (!form) return;

  /* Inject honeypot field (hidden via .hp-field CSS class) */
  if (!form.querySelector('[name="_gotcha"]')) {
    const hp = document.createElement('input');
    hp.type = 'text';
    hp.name = '_gotcha';
    hp.className = 'hp-field';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    form.appendChild(hp);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    /* Honeypot check — silently drop bot submissions */
    const honeypot = this.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    const btn = this.querySelector('.fsub');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    /* Append context fields */
    const data = new FormData(this);
    data.append('page_url',      window.location.href);
    data.append('page_title',    document.title);
    data.append('submitted_at',  new Date().toISOString());

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      });

      if (res.ok) {
        this.style.display = 'none';
        const successEl = document.getElementById('fsuccess');
        if (successEl) successEl.style.display = 'block';
      } else {
        const json = await res.json().catch(() => ({}));
        const msg  = (json.errors || []).map(er => er.message).join(', ') || 'Something went wrong. Please try again.';
        showFormError(this, btn, originalText, msg);
      }
    } catch (_) {
      showFormError(this, btn, originalText, 'Network error. Please check your connection and try again.');
    }
  });
}

document.querySelectorAll('#cform, .lead-form').forEach(initForm);

/* FAQ accordion */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', function () {
    const item   = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
