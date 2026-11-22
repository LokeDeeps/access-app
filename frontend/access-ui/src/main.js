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

// ---- Растущее дерево в горшке ----
var LEAVES = '葉枝花榮茂椛樺桂森楠苔萱蘭蕾華茂盛榮翠菁菱蕨蕾蔓藤薜荔萝荷菊楓梅柳桜';
var TRUNK = '木';
var ROOTS = '根';

// Горшок из символов (ширина задана под кадр 30 знаков)
var POT = [
  '   ╭───────────────╮   ',
  '  ╭╯               ╰╮  ',
  ' ╭╯   土  器  土   ╰╮  ',
  ' ╰╮               ╭╯  ',
  '  ╰╮             ╭╯   ',
  '   ╰─────────────╯    ',
  '  ╰╮             ╭╯   ',
  '   ╰─────────────╯    '
];

function buildTree() {
  var width = 23;          // ширина кроны
  var crown = 13;          // строк кроны
  var trunk = 5;           // строк ствола
  var lines = [];

  // Крона: широкая, плотная, до width знаков в строке
  for (var i = 0; i < crown; i++) {
    // ширина слоя растёт от 5 до width, с лёгкой "рваностью" краёв
    var base = 5 + Math.floor((i / crown) * (width - 5));
    var wobble = Math.floor(Math.random() * 5) - 2;
    var w = Math.max(4, Math.min(width, base + wobble));
    var pad = Math.floor((width - w) / 2) + 3;
    var row = '';
    for (var c = 0; c < w; c++) {
      row += Math.random() < 0.12
        ? ' '  // просветы, чтобы крона дышала
        : LEAVES.charAt(Math.floor(Math.random() * LEAVES.length));
    }
    lines.push(' '.repeat(pad) + row);
  }

  // Ствол: три 木 в ряд
  var tp = Math.floor(width / 2) + 1;
  for (var t = 0; t < trunk; t++) {
    lines.push(' '.repeat(tp - 1) + TRUNK + TRUNK + TRUNK);
  }

  // Корни над горшком
  lines.push(' '.repeat(tp - 2) + ROOTS + ROOTS + TRUNK + ROOTS + ROOTS);

  // Горшок
  POT.forEach(function (p) { lines.push(p); });

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
  // Растёт снизу вверх: рисуем с последней строки к первой
  timer = setInterval(function () {
    treeEl.textContent = lines[lines.length - 1 - i] + '\n' + treeEl.textContent;
    i++;
    if (i >= lines.length) {
      clearInterval(timer);
      treeEl.style.color = '#f9ca24'; // крона "золотеет"
    }
  }, 450);
}

document.getElementById('grow').addEventListener('click', growTree);
