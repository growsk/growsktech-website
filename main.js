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
  const btn = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
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

/* Form submit (fake success — replace setTimeout with real fetch when ready)
   Formspree example:
     const res = await fetch('https://formspree.io/f/YOUR_ID', {
       method:'POST', headers:{'Accept':'application/json'}, body: new FormData(this)
     });
     if (res.ok) showOk(); else { btn.textContent='Try again'; btn.disabled=false; }
*/
const cf = document.getElementById('cform');
if (cf) {
  cf.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = this.querySelector('.fsub');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(showOk, 800);
  });
}
function showOk() {
  const f = document.getElementById('cform');
  const s = document.getElementById('fsuccess');
  if (f) f.style.display = 'none';
  if (s) s.style.display = 'block';
}

/* FAQ accordion */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
