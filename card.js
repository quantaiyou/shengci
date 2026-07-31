// js/card.js
function loadCard() {
  if (!words || words.length === 0) {
    const wordEl = document.getElementById("word");
    if (wordEl) wordEl.innerText = "학습할 단어가 없습니다 🎉";
    const counterEl = document.getElementById("counter");
    if (counterEl) counterEl.innerText = "0 / 0";
    return;
  }

  if (index >= words.length) index = 0;
  if (index < 0) index = words.length - 1;

  const currentWord = words[index];

  const wordEl = document.getElementById("word");
  const pinyinEl = document.getElementById("pinyin");
  const speakCountEl = document.getElementById("speak-count");
  const meaningEl = document.getElementById("meaning");
  const exampleEl = document.getElementById("example");
  const exPyEl = document.getElementById("example_pinyin") || document.getElementById("example_py");

  // 앞면 빈 카드 준비
  if (wordEl) wordEl.innerText = "";
  if (pinyinEl) pinyinEl.innerText = "";
  if (speakCountEl) speakCountEl.innerText = "";

  // 뒷면 준비
  if (meaningEl) {
    meaningEl.innerText = currentWord.word || "";
    meaningEl.classList.remove("fade-meaning");
  }

  // 예문 하이라이트
  if (exampleEl) {
    const wordStr = currentWord.word || "";
    const exStr = currentWord.example || "";
    if (wordStr && exStr.includes(wordStr)) {
      const highlighted = exStr.replace(new RegExp(wordStr, 'g'), `<mark class="ex-highlight">${wordStr}</mark>`);
      exampleEl.innerHTML = highlighted;
    } else {
      exampleEl.innerText = exStr;
    }
  }

  if (exPyEl) exPyEl.innerText = currentWord.example_pinyin || "";

  // 카운터(1/10 등) 즉시 반영
  const counterEl = document.getElementById("counter");
  if (counterEl) counterEl.innerText = `${index + 1} / ${words.length}`;

  if (typeof resetProgressBar === "function") resetProgressBar();
  resetCardFlip();
}

function revealFrontContent() {
  if (!words || !words[index]) return;

  const wordEl = document.getElementById("word");
  const pinyinEl = document.getElementById("pinyin");

  if (wordEl) wordEl.innerText = words[index].word || "";
  if (pinyinEl) pinyinEl.innerText = words[index].pinyin || "";
}

function animateMeaningText() {
  const meaningEl = document.getElementById("meaning");
  if (!meaningEl || !words[index]) return;

  setTimeout(() => {
    meaningEl.innerText = words[index].meaning || "";
    meaningEl.classList.add("fade-meaning");
  }, 600);
}

function startProgressBar(durationMs) {
  const fillEl = document.querySelector(".progress-fill-back");
  if (!fillEl) return;

  fillEl.style.transition = "none";
  fillEl.style.width = "0%";
  void fillEl.offsetWidth;

  fillEl.style.transition = `width ${durationMs}ms linear`;
  fillEl.style.width = "100%";
}

function resetProgressBar() {
  const fillEl = document.querySelector(".progress-fill-back");
  if (fillEl) {
    fillEl.style.transition = "none";
    fillEl.style.width = "0%";
  }
}

function resetCardFlip() {
  const cardInner = document.querySelector(".word-card-inner") || document.querySelector(".word-card");
  if (cardInner) cardInner.classList.remove("flipped");
}

function flipCard(showBack) {
  const cardInner = document.querySelector(".word-card-inner") || document.querySelector(".word-card");
  if (!cardInner) return;

  const isFlipped = cardInner.classList.contains("flipped");

  if (typeof showBack === "boolean") {
    if (showBack && !isFlipped) {
      cardInner.classList.add("flipped");
      animateMeaningText();
    } else if (!showBack && isFlipped) {
      cardInner.classList.remove("flipped");
      if (typeof stopSpeaking === "function") stopSpeaking();
    }
  } else {
    cardInner.classList.toggle("flipped");
    if (cardInner.classList.contains("flipped")) {
      animateMeaningText();
    } else {
      if (typeof stopSpeaking === "function") stopSpeaking();
    }
  }
}
// 1. 병음만 먼저 등장
function revealPinyin() {
  if (!words || !words[index]) return;
  const pinyinEl = document.getElementById("pinyin");
  if (pinyinEl) pinyinEl.innerText = words[index].pinyin || "";
}

// 2. 단어(한자) 등장
function revealWord() {
  if (!words || !words[index]) return;
  const wordEl = document.getElementById("word");
  if (wordEl) wordEl.innerText = words[index].word || "";
}

// (기존 함수 호환용)
function revealFrontContent() {
  revealPinyin();
  revealWord();
}