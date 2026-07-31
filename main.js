// js/main.js

let words = [];
let index = 0;

window.addEventListener("DOMContentLoaded", () => {
    // 1. 로컬스토리지 단어 로드
    const savedWords = localStorage.getItem("myWords");
    if (savedWords) {
        try {
            words = JSON.parse(savedWords);
            index = 0;
            if (words.length > 0 && typeof loadCard === "function") {
                loadCard();
            }
        } catch (e) {
            console.error("단어 데이터 로드 오류:", e);
        }
    }
});

// CSV 파일 업로드 파싱
function loadCSVFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");

    reader.onload = function (e) {
        const csvContent = e.target.result;
        const parsedData = parseCSV(csvContent);

        if (parsedData.length === 0) {
            alert("CSV 파일에서 읽을 수 있는 단어가 없습니다.");
            return;
        }

        words = parsedData;
        index = 0;

        localStorage.setItem("myWords", JSON.stringify(words));
        alert(`총 ${words.length}개의 단어를 불러왔습니다!`);

        if (typeof loadCard === "function") loadCard();
        event.target.value = "";
    };
}

function parseCSV(text) {
    const lines = text.split(/\r\n|\n/);
    if (lines.length <= 1) return [];

    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const row = [];
        let insideQuotes = false;
        let entry = "";

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                if (insideQuotes && line[j + 1] === '"') {
                    entry += '"';
                    j++;
                } else {
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                row.push(entry.trim());
                entry = "";
            } else {
                entry += char;
            }
        }
        row.push(entry.trim());

        const clean = (val) => (val ? val.replace(/^"|"$/g, "").trim() : "");
        const word = clean(row[0]);
        if (!word) continue;

        result.push({
            word: word,
            pinyin: clean(row[1]),
            meaning: clean(row[2]),
            example: clean(row[3]),
            example_pinyin: clean(row[4])
        });
    }
    return result;
}

// 앱 시작 팝업 제어
function initApp() {
    const overlay = document.getElementById("start-overlay");
    if (overlay) overlay.style.display = "none";

    if (words && words.length > 0) {
        if (typeof loadCard === "function") loadCard();
        if (typeof speakWordSequence === "function") {
            speakWordSequence();
        }
    }
}