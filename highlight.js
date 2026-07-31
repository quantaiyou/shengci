// js/highlight.js

/**
 * 음성 재생 진행에 따라 예문/단어 및 병음 스팬을 하이라이트
 */
function highlightWord(idx, cnWords, cnSpans, pySpans) {
    if (!cnWords || !cnWords.length) return;

    let charCount = 0;
    let wordIndex = -1;

    // 1. 현재 글자 위치(idx)가 속한 단어의 인덱스 찾기
    for (let i = 0; i < cnWords.length; i++) {
        const item = cnWords[i];
        const text = (typeof item === "string") ? item : (item.word || "");
        const len = text.length;

        if (idx >= charCount && idx < charCount + len) {
            wordIndex = i;
            break;
        }
        charCount += len;
    }

    // 2. 한자(Chinese) DOM 요소 하이라이트
    if (cnSpans && cnSpans.length) {
        cnSpans.forEach((span, i) => {
            if (span && span.style) {
                span.style.backgroundColor = (i === wordIndex) ? "#fff176" : "transparent";
                span.style.borderRadius = (i === wordIndex) ? "3px" : "0px";
                span.style.transition = "background-color 0.2s ease";
            }
        });
    }

    // 3. 병음(Pinyin) DOM 요소 하이라이트
    if (pySpans && pySpans.length) {
        pySpans.forEach((span, i) => {
            if (span && span.style) {
                span.style.backgroundColor = (i === wordIndex) ? "#fff176" : "transparent";
                span.style.borderRadius = (i === wordIndex) ? "3px" : "0px";
                span.style.transition = "background-color 0.2s ease";
            }
        });
    }
}

/**
 * 4. 하이라이트 전체 해제 함수
 */
function clearHighlight(cnSpans, pySpans) {
    if (cnSpans) {
        cnSpans.forEach(span => { if (span && span.style) span.style.backgroundColor = "transparent"; });
    }
    if (pySpans) {
        pySpans.forEach(span => { if (span && span.style) span.style.backgroundColor = "transparent"; });
    }

    const activeHighlights = document.querySelectorAll(".ex-highlight, .highlight");
    activeHighlights.forEach(el => {
        if (el && el.style) el.style.backgroundColor = "transparent";
    });
}