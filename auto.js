// js/auto.js
var autoRunning = false;
let autoTimeoutId = null;

// ==========================================
// [자동 모드]
// ==========================================
function startAuto() {
  if (autoRunning) return;
  autoRunning = true;

  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.innerText = "▶ 자동재생 중...";

  if (typeof stopSpeaking === "function") stopSpeaking();
  playNextStep();
}

async function playNextStep() {
  if (!autoRunning) return;

  if (!words || words.length === 0) {
    stopAuto();
    return;
  }

  // 1. 카드 데이터 로드
  if (typeof loadCard === "function") loadCard();

  // 2. 음성 시퀀스 진행
  if (typeof speakWordSequence === "function") {
    await speakWordSequence();
  }

  if (!autoRunning) return;

  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.innerText = "⏳ 다음 단어로 이동...";

  if (autoTimeoutId) clearTimeout(autoTimeoutId);
  autoTimeoutId = setTimeout(() => {
    if (!autoRunning) return;
    index = (index + 1) % words.length;
    playNextStep();
  }, 1000);
}

function stopAuto() {
  autoRunning = false;

  if (autoTimeoutId) {
    clearTimeout(autoTimeoutId);
    autoTimeoutId = null;
  }

  if (typeof stopSpeaking === "function") stopSpeaking();

  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.innerText = "⏹ 정지됨";
}

// ==========================================
// [수동 모드] (누르는 즉시 반응)
// ==========================================
function playManual(direction) {
  // 자동 루프/타이머 즉시 정지
  stopAuto();

  if (!words || words.length === 0) return;

  // 인덱스 계산
  if (direction === "next") {
    index = (index + 1) % words.length;
  } else if (direction === "prev") {
    index = (index - 1 + words.length) % words.length;
  }

  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.innerText = "👆 수동 이동";

  // ★ 1. 수동 조작 시 즉시 새 카드 로드 및 번호 반영!
  if (typeof loadCard === "function") loadCard();

  // ★ 2. 1회 연출 시작
  if (typeof speakWordSequence === "function") {
    speakWordSequence();
  }
}