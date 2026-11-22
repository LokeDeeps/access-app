var KEY = 'bj_save';

var save = null;
try {
  save = JSON.parse(localStorage.getItem(KEY));
} catch (e) {
  save = null;
}
if (!save) {
  save = { balance: 100, bet: 10 };
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(save));
}

// ---- Колода ----
var SUITS = ['♠', '♥', '♦', '♣'];
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function newDeck() {
  var deck = [];
  for (var s = 0; s < 4; s++) {
    for (var r = 0; r < 13; r++) {
      deck.push({ rank: RANKS[r], suit: SUITS[s] });
    }
  }
  // Тасовка Фишера-Йетса
  for (var i = deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
  return deck;
}

function handValue(cards) {
  var sum = 0;
  var aces = 0;
  cards.forEach(function (c) {
    if (c.rank === 'A') {
      aces++;
      sum = sum + 11;
    } else if (c.rank === 'J' || c.rank === 'Q' || c.rank === 'K') {
      sum = sum + 10;
    } else {
      sum = sum + parseInt(c.rank, 10);
    }
  });
  while (sum > 21 && aces > 0) {
    sum = sum - 10;
    aces--;
  }
  return sum;
}

// ---- Элементы ----
var dealerCardsEl = document.getElementById('dealer-cards');
var playerCardsEl = document.getElementById('player-cards');
var dealerSumEl = document.getElementById('dealer-sum');
var playerSumEl = document.getElementById('player-sum');
var statusEl = document.getElementById('status');
var balanceEl = document.getElementById('balance');
var betEl = document.getElementById('bet');
var dealBtn = document.getElementById('deal');
var hitBtn = document.getElementById('hit');
var standBtn = document.getElementById('stand');

var deck = [];
var player = [];
var dealer = [];
var inRound = false;

function showCards(cards, hideFirst) {
  return cards
    .map(function (c, i) {
      if (i === 0 && hideFirst) return '<div class="card back">?</div>';
      return '<div class="card">' + c.rank + c.suit + '</div>';
    })
    .join('');
}

function updateUi(hideDealer) {
  dealerCardsEl.innerHTML = showCards(dealer, hideDealer);
  playerCardsEl.innerHTML = showCards(player, false);
  dealerSumEl.textContent = hideDealer ? '?' : String(handValue(dealer));
  playerSumEl.textContent = String(handValue(player));
  balanceEl.textContent = String(save.balance);
  betEl.textContent = String(save.bet);
}

function setButtons() {
  dealBtn.disabled = inRound;
  hitBtn.disabled = !inRound;
  standBtn.disabled = !inRound;
}

function log(text, cls) {
  statusEl.innerHTML = '&gt; ' + text;
  if (cls) statusEl.className = 'status-line ' + cls;
  else statusEl.className = 'status-line';
}

// ---- Раунд ----
dealBtn.addEventListener('click', function () {
  if (save.balance < save.bet) {
    log('НЕДОСТАТОЧНО ЧИПОВ!', 'lose');
    return;
  }
  save.balance = save.balance - save.bet;
  persist();
  deck = newDeck();
  player = [deck.pop(), deck.pop()];
  dealer = [deck.pop(), deck.pop()];
  inRound = true;
  setButtons();
  updateUi(true);
  log('КАРТЫ РАЗДАНЫ. ТВОЙ ХОД');
});

hitBtn.addEventListener('click', function () {
  player.push(deck.pop());
  var v = handValue(player);
  updateUi(true);
  if (v > 21) {
    endRound('bust');
  } else if (v === 21) {
    stand();
  } else {
    log('У ТЕБЯ ' + v + '. ЕЩЁ ИЛИ СТОП?');
  }
});

standBtn.addEventListener('click', function () {
  stand();
});

function stand() {
  // Дилер добирает до 17
  while (handValue(dealer) < 17) {
    dealer.push(deck.pop());
  }
  updateUi(false);
  var pv = handValue(player);
  var dv = handValue(dealer);
  if (dv > 21) endRound('dealer_bust');
  else if (dv > pv) endRound('dealer_win');
  else if (pv > dv) endRound('player_win');
  else endRound('push');
}

function endRound(result) {
  inRound = false;
  setButtons();
  updateUi(false);
  var payout = 0;
  var text = '';
  var cls = '';
  if (result === 'bust') {
    text = 'ПЕРЕБОР! ТЫ ПРОИГРАЛ ' + save.bet + ' ЧИПОВ';
    cls = 'lose';
  } else if (result === 'dealer_win') {
    text = 'ДИЛЕР ПОБЕДИЛ. ' + save.bet + ' ЧИПОВ СГОРЕЛО';
    cls = 'lose';
  } else if (result === 'push') {
    payout = save.bet;
    text = 'НИЧЬЯ. СТАВКА ВОЗВРАЩЕНА';
  } else if (result === 'dealer_bust') {
    payout = save.bet * 2;
    text = 'У ДИЛЕРА ПЕРЕБОР! ВЫИГРЫШ ' + save.bet * 2;
    cls = 'win';
  } else {
    payout = save.bet * 2;
    text = 'ТЫ ВЫИГРАЛ ' + save.bet * 2 + ' ЧИПОВ!';
    cls = 'win';
  }
  save.balance = save.balance + payout;
  persist();
  updateUi(false);
  log(text, cls);
  if (save.balance <= 0) {
    setTimeout(function () {
      log('ВСЁ ПРОИГРАЛ... ВОТ ТЕ 100 НА ПОПРОБУЙ');
      save.balance = 100;
      persist();
      updateUi(false);
    }, 2500);
  }
}

// ---- Ставки ----
function addBet(amount) {
  if (inRound) return;
  save.bet = Math.min(save.bet + amount, Math.max(save.balance, 10));
  persist();
  updateUi(false);
}
document.getElementById('bet10').addEventListener('click', function () { addBet(10); });
document.getElementById('bet50').addEventListener('click', function () { addBet(50); });
document.getElementById('bet100').addEventListener('click', function () { addBet(100); });

updateUi(false);
setButtons();
