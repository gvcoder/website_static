(function () {
  var root = document.documentElement;

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    localStorage.setItem('theme', t);
  });

  // Mobile menu
  var menu = document.getElementById('menu-toggle'), links = document.getElementById('nav-links');
  menu.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function () { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); });

  // Articles
  var box = document.getElementById('articles');
  (window.ARTICLES || []).forEach(function (a) {
    var el = document.createElement('a');
    el.className = 'card reveal';
    el.href = a.url; el.target = '_blank'; el.rel = 'noopener';
    var t = document.createElement('time'); t.textContent = a.date;
    var h = document.createElement('h3'); h.textContent = a.title;
    el.append(t, h);
    box.appendChild(el);
  });

  // Badges
  var grid = document.getElementById('badge-grid');
  (window.BADGES || []).forEach(function (b) {
    var el = document.createElement(b.url ? 'a' : 'div');
    el.className = 'badge reveal';
    if (b.url) { el.href = b.url; el.target = '_blank'; el.rel = 'noopener'; }
    var img = document.createElement('img');
    img.src = b.image; img.alt = b.name; img.loading = 'lazy'; img.width = 96; img.height = 96;
    img.onerror = function () { img.onerror = null; img.src = 'assets/badges/placeholder.svg'; };
    var n = document.createElement('strong'); n.textContent = b.name;
    var i = document.createElement('span'); i.textContent = b.issuer;
    el.append(img, n, i);
    grid.appendChild(el);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Scroll reveal
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Counters
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', n = 0, step = Math.max(1, Math.ceil(end / 50));
      var id = setInterval(function () {
        n = Math.min(end, n + step); el.textContent = n + (n === end ? suf : '');
        if (n === end) clearInterval(id);
      }, 25);
      cio.unobserve(el);
    });
  });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // Contact form
  var form = document.getElementById('contact-form'), status = document.getElementById('form-status');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) { status.textContent = 'Please complete all fields with a valid email.'; return; }
    status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        status.textContent = d.ok ? 'Thank you! I will get back to you soon.' : (d.error || 'Something went wrong.');
        if (d.ok) form.reset();
      })
      .catch(function () { status.textContent = 'Could not send right now. Please connect via LinkedIn.'; });
  });
})();
