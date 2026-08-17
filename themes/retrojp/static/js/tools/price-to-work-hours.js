// ── Price → Work Hours ────────────────────────────────────────
// Turns a price into the working time it costs, from salary and
// working pattern. Everything stays in the browser.
(function () {
  const root = document.getElementById('wh-calc');
  if (!root) return;

  const STORE_KEY = 'simpletools:price-to-work-hours';
  const WEEKS_PER_YEAR = 52;
  const DASH = '—';

  const el = {
    salary:     document.getElementById('wh-salary'),
    hours:      document.getElementById('wh-hours'),
    days:       document.getElementById('wh-days'),
    off:        document.getElementById('wh-off'),
    price:      document.getElementById('wh-price'),
    rate:       document.getElementById('wh-rate'),
    rateNote:   document.getElementById('wh-rate-note'),
    result:     document.getElementById('wh-result'),
    resultNote: document.getElementById('wh-result-note'),
  };

  // Only the working pattern is remembered — the price is per-visit.
  const SAVED = ['salary', 'hours', 'days', 'off'];

  const money = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const oneDp = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 });
  const whole = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

  // NaN for blank or non-numeric, so every caller has one thing to check.
  function num(input) {
    if (!input || input.value.trim() === '') return NaN;
    const n = Number(input.value);
    return Number.isFinite(n) ? n : NaN;
  }

  function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

  function hoursPerDay() {
    const h = num(el.hours);
    return h > 0 ? clamp(h, 0, 24) : NaN;
  }

  function annualHours() {
    const perDay = hoursPerDay();
    const days = num(el.days);
    const off = num(el.off);
    if (!(perDay > 0) || !(days > 0)) return NaN;
    const workDays = clamp(days, 0, 7) * WEEKS_PER_YEAR - (Number.isFinite(off) && off > 0 ? off : 0);
    // More days off than working days leaves nothing to divide by.
    if (!(workDays > 0)) return NaN;
    return workDays * perDay;
  }

  // Paid days off raise the rate: same salary, fewer hours worked.
  function hourlyRate() {
    const salary = num(el.salary);
    const total = annualHours();
    if (!(salary > 0) || !(total > 0)) return NaN;
    return salary / total;
  }

  // Days here are working days, not 24-hour days.
  function breakdown(hours, perDay) {
    if (!(perDay > 0) || hours < perDay) return '';
    const days = Math.floor(hours / perDay);
    const rest = hours - days * perDay;
    const label = days + (days === 1 ? ' work day' : ' work days');
    return rest < 0.05 ? label : label + ' + ' + oneDp.format(rest) + ' h';
  }

  function render() {
    const rate = hourlyRate();

    if (Number.isFinite(rate)) {
      el.rate.textContent = money.format(rate) + ' / h';
      el.rateNote.textContent = whole.format(annualHours()) + ' working hours a year';
    } else {
      el.rate.textContent = DASH;
      el.rateNote.textContent = 'Fill in salary, hours and days to get a rate.';
    }

    const price = num(el.price);
    if (Number.isFinite(rate) && Number.isFinite(price) && price >= 0) {
      const hours = price / rate;
      const detail = breakdown(hours, hoursPerDay());
      el.result.textContent = oneDp.format(hours) + (hours === 1 ? ' hour' : ' hours');
      el.resultNote.textContent = detail ? 'that is ' + detail + ' of your life' : 'of work to afford it';
    } else {
      el.result.textContent = DASH;
      el.resultNote.textContent = 'Enter a price to see what it costs in work time.';
    }
  }

  function save() {
    try {
      const data = {};
      SAVED.forEach(k => { data[k] = el[k].value; });
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) { /* private mode or quota — not worth breaking the tool over */ }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      SAVED.forEach(k => {
        if (typeof data[k] === 'string' && data[k] !== '') el[k].value = data[k];
      });
    } catch (e) { /* malformed saved state — fall back to the markup defaults */ }
  }

  root.addEventListener('input', () => { save(); render(); });

  restore();
  render();
})();
