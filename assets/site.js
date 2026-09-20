/* Aight — minimal page behaviour, mirroring the interactions in Codex's prototype. */
(function () {
  var money = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  // Announcement banner dismiss + mobile menu toggle
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var a = b.dataset.action;
    if (a === 'dismiss') { var banner = b.closest('.banner'); if (banner) banner.remove(); }
    if (a === 'menu') { var nav = b.closest('.nav'); if (nav) nav.classList.toggle('expanded'); }
  });

  // Models catalogue: category tabs + search
  var rows = document.getElementById('a-modelrows');
  if (rows) {
    var filter = 'All', query = '';
    var apply = function () {
      var visible = 0;
      rows.querySelectorAll('tr[data-category]').forEach(function (tr) {
        var ok = (filter === 'All' || tr.dataset.category === filter) && tr.dataset.search.indexOf(query.toLowerCase()) !== -1;
        tr.hidden = !ok; if (ok) visible++;
      });
      var none = document.getElementById('a-nomatch'); if (none) none.hidden = visible > 0;
    };
    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(function (x) { x.classList.toggle('selected', x === btn); });
        apply();
      });
    });
    var search = document.getElementById('a-search');
    if (search) search.addEventListener('input', function () { query = search.value; apply(); });
  }

  // Discover: category tabs
  var tabs = document.querySelectorAll('[data-discovery]');
  if (tabs.length) {
    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var c = btn.dataset.discovery;
        tabs.forEach(function (x) { x.classList.toggle('selected', x === btn); });
        document.querySelectorAll('.discovercard[data-category]').forEach(function (card) {
          card.hidden = !(c === 'All' || card.dataset.category === c);
        });
      });
    });
  }

  // Usage rewards calculator
  var amountInput = document.getElementById('a-creditamount');
  if (amountInput) {
    amountInput.addEventListener('input', function () {
      var amount = Math.max(0, Number(amountInput.value) || 0);
      var base = document.getElementById('a-base'), bonus = document.getElementById('a-bonus');
      if (base) base.textContent = money(amount);
      if (bonus) bonus.textContent = '+' + money(amount * 0.1);
    });
  }

  // Contact / support forms: no backend on this static site, so open the visitor's
  // mail client addressed to hello@getaight.ai with the form contents.
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [];
      form.querySelectorAll('input,select,textarea').forEach(function (el) {
        if (el.name) lines.push(el.name + ': ' + el.value);
      });
      var subject = form.dataset.form === 'support' ? 'Aight support request' : 'Aight enquiry';
      window.location.href = 'mailto:hello@getaight.ai?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();
