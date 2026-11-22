// ---- Переключение вкладок ----
var tabs = document.querySelectorAll('.tab');
var panels = document.querySelectorAll('.panel');

tabs.forEach(function (btn) {
  btn.addEventListener('click', function () {
    tabs.forEach(function (b) { b.classList.remove('active'); });
    panels.forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'fun') growTree();
  });
});

// ---- PIN (вкладка "Главная") ----
var app = document.querySelector('#tab-main .card');
var pin = document.getElementById('pin');
var btn = document.getElementById('go');
var msg = document.getElementById('msg');
var CORRECT_PIN = '1234';

btn.addEventListener('click', function () {
  if (pin.value === CORRECT_PIN) {
    msg.style.color = '#55efc4';
    msg.textContent = 'Доступ разрешён';
    setTimeout(function () {
      app.innerHTML = '<h1>Добро пожаловать!</h1><p>Приложение работает.</p>';
    }, 800);
  } else {
    msg.textContent = 'Неверный PIN';
    pin.value = '';
  }
});

// ---- Растущее дерево из иероглифов ----
var LEAVES = '葉枝花榮茂椛樺';
var TRUNK = '木';
var ROOTS = '根';
var GROUND = '土土土土土土土土土土土土土土土土';

function buildTree() {
  var height = 11;
  var maxW = 13;
  var lines = [];
  for (var i = 0; i < height; i++) {
    var w = 1 + Math.floor((i / height) * maxW);
    var pad = Math.floor((maxW - w) / 2) + 4;
    var row = '';
    for (var c = 0; c < w; c++) {
      row += Math.random() < 0.85
        ? LEAVES.charAt(Math.floor(Math.random() * LEAVES.length))
        : ' ';
    }
    lines.push(' '.repeat(pad) + row);
  }
  var tp = Math.floor(maxW / 2) + 3;
  lines.push(' '.repeat(tp) + '丨');
  lines.push(' '.repeat(tp) + TRUNK);
  lines.push(' '.repeat(tp) + TRUNK);
  lines.push(' '.repeat(tp - 1) + ROOTS + TRUNK + ROOTS);
  lines.push(GROUND);
  return lines;
}

var treeEl = document.getElementById('tree');
var timer = null;

function growTree() {
  clearInterval(timer);
  treeEl.textContent = '';
  treeEl.style.color = '#7bed9f';
  var lines = buildTree();
  var i = 0;
  timer = setInterval(function () {
    treeEl.textContent += lines[i] + '\n';
    i++;
    if (i >= lines.length) {
      clearInterval(timer);
      treeEl.style.color = '#f9ca24'; // дерево "зацвело" — золотеет
    }
  }, 600);
}

document.getElementById('grow').addEventListener('click', growTree);
