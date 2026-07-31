// js/speak.js

let currentSpeech = null;
window.currentUtterance = null;
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

   const synth = window.speechSynthesis;

    // ★ 1. 브라우저 음성 엔진이 멈춰있는 경우 일시정지 해제 및 완전 초기화
    if (synth.paused) synth.resume();
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;

    // ★ 핵심 1: 전역 변수에 참조를 유지하여 브라우저가 음성 객체를 중간에 삭제하지 못하게 방지
    window.currentUtterance = utter;

    let isResolved = false;
    const safeResolve = () => {
      if (!isResolved) {
        isResolved = true;
        window.currentUtterance = null; // 재생 완료 후 해제
        resolve();
      }
    };

    // 문장 길이에 따라 대기 시간 여유 있게 조정
    const safetyTimer = setTimeout(safeResolve, Math.max(text.length * 800, 4000));

    utter.onstart = () => {
      if (withProgressBar && typeof startProgressBar === "function") {
        const estimatedDuration = Math.max(text.length * 500, 2500);
        startProgressBar(estimatedDuration);
      }
    };

    utter.onend = () => {
      clearTimeout(safetyTimer);
      safeResolve();
    };

    utter.onerror = (e) => {
      console.warn("TTS Error:", e);
      clearTimeout(safetyTimer);
      safeResolve();
    };

    // ★ 핵심 2: cancel 후 아주 미세한 딜레이(50ms)를 주고 speak 호출
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, 350);
  });
}

// ★ 맞춤 학습 시퀀스 (백지 -> 첫음성 -> 1초 대기 -> 병음 -> 단어 -> 두번째 음성 -> 1초 대기 -> 뒤집기)
async function speakWordSequence() {
  if (!words || words.length === 0 || !words[index]) return;

  const currentWord = words[index];

  // 1. [백지 카드] 0.2초 짧은 대기
  await new Promise((r) => setTimeout(r, 500));

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
  await new Promise((r) => setTimeout(r, 1000));

  // 9. [예문 읽기] 예문 2회 출력
  if (currentWord.example) {
    await speakPromise(currentWord.example, "zh-CN", 0.8, true);
    await new Promise((r) => setTimeout(r, 800));

    await speakPromise(currentWord.example, "zh-CN", 0.8, true);
    await new Promise((r) => setTimeout(r, 300));
  }
}
