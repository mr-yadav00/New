/* ============================================================
   SITELAB INDIA — SHARED COMPONENTS JS
   Navigation, Cursor, Scroll, FAQ, Reveal Animations
   ============================================================ */

// ─── NAVIGATION ───
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 40);
});

function toggleMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}

// ─── CURSOR ───
(function() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch || !cursor || !ring) { if(cursor) cursor.style.display='none'; if(ring) ring.style.display='none'; return; }
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
  function animateRing() { rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animateRing); }
  animateRing();
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.2)'; cursor.style.background = 'rgba(255,184,0,0.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'var(--gold)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
})();

// ─── SCROLL REVEAL ───
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ─── FAQ ACCORDION ───
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ─── FILTER BUTTONS ───
window.filterCategory = function(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('[data-category]').forEach(card => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.opacity = '0'; card.style.transform = 'translateY(15px) scale(0.97)';
    if (match) { card.style.display = 'block'; setTimeout(() => { card.style.opacity='1'; card.style.transform='translateY(0) scale(1)'; card.style.transition='opacity 0.3s, transform 0.3s'; }, 50); }
    else { setTimeout(() => { if(card.style.opacity==='0') card.style.display='none'; }, 300); }
  });
};

// ─── WIZARD FORM ───
window.currentStep = 1;
window.selectedGoal = 'Book More Patient Consultations';

window.selectGoal = function(el, goalText) {
  document.querySelectorAll('#step1 .plan-card').forEach(c => { c.style.border = ''; c.style.background = ''; });
  el.style.border = '2px solid var(--gold)'; el.style.background = 'rgba(255,184,0,0.12)';
  window.selectedGoal = goalText;
};

window.goStep = function(n) {
  const required = { 2: ['f_bname', 'f_name', 'f_phone', 'f_city'] };
  if (n > window.currentStep && required[window.currentStep]) {
    for (const id of required[window.currentStep]) {
      const el = document.getElementById(id); if (!el) continue;
      if (!el.value.trim()) { el.focus(); el.style.borderColor='#ff4d4d'; el.addEventListener('input',()=>el.style.borderColor='',{once:true}); return; }
    }
  }
  if (n === 3) buildSummary();
  document.getElementById('step' + window.currentStep).classList.add('hidden');
  document.getElementById('step' + n).classList.remove('hidden');
  window.currentStep = n;
  document.querySelectorAll('.sp-item').forEach(item => {
    const s = parseInt(item.dataset.step);
    item.classList.remove('active','done');
    const numEl = item.querySelector('.sp-num'); const labelEl = item.querySelector('.sp-label');
    if (s < n) { item.classList.add('done'); } else if (s === n) { item.classList.add('active'); }
  });
  const gs = document.getElementById('getstarted'); if(gs) gs.scrollIntoView({behavior:'smooth',block:'start'});
};

function buildSummary() {
  const lines = [
    ['🎯 Goal', window.selectedGoal],
    ['🏢 Brand', document.getElementById('f_bname')?.value || ''],
    ['👤 Contact', document.getElementById('f_name')?.value || ''],
    ['📱 WhatsApp', document.getElementById('f_phone')?.value || ''],
    ['🏙️ City', document.getElementById('f_city')?.value || '']
  ];
  const box = document.getElementById('summaryBox');
  if (box) box.innerHTML = lines.map(([k,v]) => `<strong>${k}:</strong> ${v}`).join('<br>');
}

window.sendToWhatsApp = function() {
  const msg = `🌐 *New Website Audit Request — SiteLab India*\n\n🎯 Goal: ${window.selectedGoal}\n🏢 Brand: ${document.getElementById('f_bname')?.value}\n👤 Contact: ${document.getElementById('f_name')?.value}\n📱 Phone: ${document.getElementById('f_phone')?.value}\n🏙️ City: ${document.getElementById('f_city')?.value}\n\n_Submitted via sitelabindia.in_ ✅`;
  window.open('https://wa.me/917878574692?text=' + encodeURIComponent(msg), '_blank');
};

// ─── SMOOTH ANCHOR LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
