// ============ PRESUPUESTO ============
const rateInput = document.getElementById('rate');

function formatEUR(n) {
  return '€ ' + n.toLocaleString('es-AR');
}
function formatARS(n) {
  return '$ ' + Math.round(n).toLocaleString('es-AR');
}

function recalcBudget() {
  const rate = parseFloat(rateInput.value) || 0;
  let totalEur = 0;

  document.querySelectorAll('#budget-table tbody tr').forEach(row => {
    const eurCell = row.querySelector('.eur');
    const arsCell = row.querySelector('.ars');
    const eur = parseFloat(eurCell.dataset.eur) || 0;
    totalEur += eur;
    eurCell.textContent = formatEUR(eur);
    arsCell.textContent = formatARS(eur * rate);
  });

  const totalArs = totalEur * rate;
  document.querySelector('.eur-total').textContent = formatEUR(totalEur);
  document.querySelector('.ars-total').textContent = formatARS(totalArs);
  document.querySelector('.eur-pp').textContent = formatEUR(Math.round(totalEur / 4));
  document.querySelector('.ars-pp').textContent = formatARS(totalArs / 4);
}

rateInput.addEventListener('input', recalcBudget);
recalcBudget();

// ============ CHECKLIST (persistente) ============
const checkboxes = document.querySelectorAll('.checklist-group input[type="checkbox"]');

function loadChecklist() {
  const saved = JSON.parse(localStorage.getItem('viaje_checklist') || '{}');
  checkboxes.forEach(cb => { cb.checked = !!saved[cb.dataset.id]; });
}
function saveChecklist() {
  const data = {};
  checkboxes.forEach(cb => { data[cb.dataset.id] = cb.checked; });
  localStorage.setItem('viaje_checklist', JSON.stringify(data));
}
checkboxes.forEach(cb => cb.addEventListener('change', saveChecklist));
loadChecklist();

document.getElementById('reset-check').addEventListener('click', () => {
  if (confirm('¿Reiniciar toda la checklist?')) {
    checkboxes.forEach(cb => cb.checked = false);
    saveChecklist();
  }
});

// ============ NOTAS (persistente) ============
const notes = document.getElementById('notes');
const savedIndicator = document.getElementById('saved');
let saveTimer;

notes.value = localStorage.getItem('viaje_notas') || '';
notes.addEventListener('input', () => {
  localStorage.setItem('viaje_notas', notes.value);
  savedIndicator.classList.add('show');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => savedIndicator.classList.remove('show'), 1500);
});

// ============ TABS activas al hacer scroll ============
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('main section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// Scroll suave
tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(tab.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});
