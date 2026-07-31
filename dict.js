// js/dict.js

let wordList = {};
let isDictLoaded = false; // 사전 로드 완료 여부 플래그

// 1. 사전 데이터 비동기 로드 함수
async function loadDictionary() {
    if (isDictLoaded) return true;

    try {
        const res = await fetch("data/data.json");
        const data = await res.json();

        // 데이터가 배열로 들어올 경우를 대비한 자동 변환 안전장치
        if (Array.isArray(data)) {
            wordList = {};
            data.forEach(item => {
                if (item && item.word) {
                    wordList[item.word] = item;
                }
            });
        } else {
            wordList = data;
        }

        isDictLoaded = true;
        console.log("📖 사전 데이터 로드 완료!");
        return true;
    } catch (err) {
        console.error("사전 데이터를 불러오는 데 실패했습니다:", err);
        return false;
    }
}

// 초기화 시 사전 미리 로드 실행
loadDictionary();

// 2. 최장 일치법(Longest Match) 단어 분할 함수
function splitByDict(text) {
    if (!text) return [];

    // 사전 미로드 시 기본 글자 단위 분할
    if (!isDictLoaded && Object.keys(wordList).length === 0) {
        return text.split("");
    }

    const result = [];
    let i = 0;

    while (i < text.length) {
        let found = false;

        // 4글자 -> 3글자 -> 2글자 -> 1글자 순으로 사전 매칭
        for (let len = 4; len >= 1; len--) {
            if (i + len > text.length) continue;

            const part = text.slice(i, i + len);

            if (wordList[part]) {
                result.push(part);
                i += len;
                found = true;
                break;
            }
        }

        // 사전에 없는 문자(특수문자, 공백 등)는 1글자 단위로 추가
        if (!found) {
            result.push(text[i]);
            i++;
        }
    }

    return result;
}