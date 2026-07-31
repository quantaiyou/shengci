// js/speak.js

let currentSpeech = null;

function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (typeof resetProgressBar === "function") resetProgressBar();
}

function speakPromise(text, lang = "zh-CN", rate = 0.85, withProgressBar = false) {
  return new Promise((resolve) => {
    if (!text || !window.speechSynthesis) {
      resolve();
      return;
    }

    stopSpeaking();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;

    let isResolved = false;
    const safeResolve = () => {
      if (!isResolved) {
        isResolved = true;
        resolve();
      }
    };

    const safetyTimer = setTimeout(safeResolve, Math.max(text.length * 400, 2500));

    utter.onstart = () => {
      if (withProgressBar && typeof startProgressBar === "function") {
        const estimatedDuration = Math.max(text.length * 300, 1500);
        startProgressBar(estimatedDuration);
      }
    };

    utter.onend = () => {
      clearTimeout(safetyTimer);
      safeResolve();
    };

    utter.onerror = () => {
      clearTimeout(safetyTimer);
      safeResolve();
    };

    window.speechSynthesis.speak(utter);
  });
}

// ★ 맞춤 학습 시퀀스 (백지 -> 첫음성 -> 1초 대기 -> 병음 -> 단어 -> 두번째 음성 -> 1초 대기 -> 뒤집기)
async function speakWordSequence() {
  if (!words || words.length === 0 || !words[index]) return;

  const currentWord = words[index];

  // 1. [백지 카드] 0.2초 짧은 대기
  await new Promise((r) => setTimeout(r, 200));

  // 2. [첫번째 음성] 백지 상태에서 먼저 발음
  await speakPromise(currentWord.word, "zh-CN", 0.85);

  // 3. [생각할 시간] 음성 끝난 후 1초 동안 백지 유지
  await new Promise((r) => setTimeout(r, 1000));

  // 4. [병음 등장]
  if (typeof revealPinyin === "function") revealPinyin();
  await new Promise((r) => setTimeout(r, 600));

  // 5. [단어 등장]
  if (typeof revealWord === "function") revealWord();
  await new Promise((r) => setTimeout(r, 1000));

  // 6. [두번째 음성] 단어가 들어온 후 다시 발음
  await speakPromise(currentWord.word, "zh-CN", 0.85);

  // 7. [대기] 두번째 음성 완료 후 1초 대기
  await new Promise((r) => setTimeout(r, 1000));

  // 8. [카드 뒤집기] 뒷면(뜻/예문)으로 이동
  if (typeof flipCard === "function") flipCard(true);
  await new Promise((r) => setTimeout(r, 500));

  // 9. [예문 읽기] 예문 2회 출력
  if (currentWord.example) {
    await speakPromise(currentWord.example, "zh-CN", 0.8, true);
    await new Promise((r) => setTimeout(r, 300));

    await speakPromise(currentWord.example, "zh-CN", 0.8, true);
    await new Promise((r) => setTimeout(r, 200));
  }
}