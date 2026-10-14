// Game data - will be populated from CSV
let gameData = {
    languages: [],
    todaysLanguage: null,
    allRows: [] // Store all CSV data for date exploration
};

const MAX_GUESSES = 6;
const FIRST_DATE = '2025-06-13'; // Langr #1
const SHARE_URL = 'https://raymondtana.github.io/projects/pages/Langr.html';
const STORAGE_KEY = 'langr-results-v1';

const DECOY_LANGUAGES = ['Abkhaz', 'Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Assamese', 'Asturian', 'Azerbaijani', 'Basaa', 'Bashkir', 'Basque', 'Belarusian', 'Bengali', 'Breton', 'Bulgarian', 'Cantonese', 'Catalan', 'Central Kurdish', 'Chuvash', 'Czech', 'Danish', 'Dhivehi', 'Dioula', 'Dutch', 'Erzya', 'Esperanto', 'Estonian', 'Finnish', 'French', 'Frisian', 'Galician', 'Georgian', 'German', 'Greek', 'Guarani', 'Hakha Chin', 'Hausa', 'Hebrew', 'Hill Mari', 'Hindi', 'Hungarian', 'Icelandic', 'Igbo', 'Indonesian', 'Interlingua', 'Irish', 'Italian', 'Japanese', 'Kabyle', 'Kazakh', 'Kinyarwanda', 'Korean', 'Kurmanji Kurdish', 'Kyrgyz', 'Lao', 'Latvian', 'Lithuanian', 'Luganda', 'Macedonian', 'Malayalam', 'Maltese', 'Mandarin', 'Marathi', 'Meadow Mari', 'Moksha', 'Mongolian', 'Nepali', 'Norwegian Nynorsk', 'Occitan', 'Odia', 'Pashto', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Quechua Chanka', 'Romanian', 'Russian', 'Sakha', 'Santali', 'Saraiki', 'Sardinian', 'Serbian', 'Slovak', 'Slovenian', 'Sorbian', 'Spanish', 'Swahili', 'Swedish', 'Taiwanese', 'Tamazight', 'Tamil', 'Tatar', 'Thai', 'Tigre', 'Tigrinya', 'Toki Pona', 'Turkish', 'Turkmen', 'Twi', 'Ukrainian', 'Urdu', 'Uyghur', 'Uzbek', 'Vietnamese', 'Votic', 'Welsh', 'Yoruba'];

let currentClueIndex = 0;
let guessCount = 1;
let gameEnded = false;
let previousGuesses = [];
let currentDate = null; // Track current game date
let countdownTimer = null;

document.getElementById('guessBtn').disabled = true;

// Initialize game
async function initGame() {
    try {
        await loadGameData();
        setupEventListeners();
        startGameForCurrentDate();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showError('Failed to load game data. Please refresh the page.');
    }
}

// For finding a random row in the case that today doesn't exist in the CSV
function fallbackRow(rows, today) {
    // Hash -> 32-bit int
    let h = 0;
    for (let i = 0; i < today.length; i++)
        h = ((h << 5) - h + today.charCodeAt(i)) | 0; // bit-level hash
    // Map hash to be an index
    return rows[Math.abs(h) % rows.length];
}

// Load and parse CSV data (only fetched once; switching dates reuses allRows)
async function loadGameData(targetDate = null) {
    if (gameData.allRows.length === 0) {
        const response = await fetch('../csv/Langr.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rows = parseCSV(await response.text());
        if (rows.length === 0) {
            throw new Error('No data found in CSV file');
        }
        const answerLanguages = rows.map(row => row.language);
        gameData.allRows = rows;
        gameData.languages = [...new Set([...DECOY_LANGUAGES, ...answerLanguages])].sort();
    }

    currentDate = targetDate || localISODate();

    let targetRow = gameData.allRows.find(row => row.date === currentDate);
    if (!targetRow) {
        console.warn(`No row for ${currentDate}; falling back to a random entry.`);
        targetRow = fallbackRow(gameData.allRows, currentDate);
    }
    gameData.todaysLanguage = targetRow;

    updateDateDisplay();
    setupDatePickerRestrictions();
}

// Get local date in YYYY-MM-DD format
function localISODate(d = new Date()) {
    const local = new Date(d);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10); // YYYY-MM-DD
}

function shiftISODate(iso, days) {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return localISODate(d);
}

function puzzleNumber(iso) {
    const ms = new Date(iso + 'T12:00:00') - new Date(FIRST_DATE + 'T12:00:00');
    return Math.round(ms / 86400000) + 1;
}

// CSV parser that handles quoted fields, escaped "" quotes, and commas inside quotes
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            rows.push(row);
        }
    }

    return rows;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current.trim());
    return values;
}

function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function showError(message) {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.innerHTML = `
        <h1 class="game-title">Langr</h1>
        <div style="padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; color: #721c24;">
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="margin-top: 15px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Retry
            </button>
        </div>
    `;
}

/******* Saved results (localStorage) *******/

function loadResults() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveResult(date, result) {
    try {
        const results = loadResults();
        results[date] = result;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (e) {
        // Storage unavailable (private mode, blocked cookies); progress just won't persist
    }
}

function persistCurrentGame(status) {
    saveResult(currentDate, {
        answer: gameData.todaysLanguage.language,
        guesses: previousGuesses.slice(),
        status: status // 'playing' | 'won' | 'lost'
    });
}

/******* Language input *******/

let comboActiveIndex = -1;

// Languages still guessable, filtered by what's typed: prefix matches first, then substring matches
function filteredLanguages(text) {
    const needle = text.trim().toLowerCase();
    const remaining = gameData.languages.filter(lang => !previousGuesses.includes(lang));
    if (!needle) return remaining;
    const starts = remaining.filter(lang => lang.toLowerCase().startsWith(needle));
    const contains = remaining.filter(lang => !starts.includes(lang) && lang.toLowerCase().includes(needle));
    return [...starts, ...contains];
}

function openLanguageList() {
    const input = document.getElementById('languageSelect');
    const list = document.getElementById('languageOptions');
    const options = filteredLanguages(input.value);
    comboActiveIndex = -1;
    list.innerHTML = options.length
        ? options.map((lang, i) => `<li role="option" id="lang-opt-${i}" data-value="${escapeHTML(lang)}">${escapeHTML(lang)}</li>`).join('')
        : '<li class="combo-empty">No matching languages</li>';
    list.hidden = false;
    list.scrollTop = 0;
    input.setAttribute('aria-expanded', 'true');
}

function closeLanguageList() {
    const list = document.getElementById('languageOptions');
    list.hidden = true;
    comboActiveIndex = -1;
    document.getElementById('languageSelect').setAttribute('aria-expanded', 'false');
}

function moveActiveOption(delta) {
    const items = document.querySelectorAll('#languageOptions li[role="option"]');
    if (!items.length) return;
    comboActiveIndex = (comboActiveIndex + delta + items.length) % items.length;
    items.forEach((li, i) => li.classList.toggle('active', i === comboActiveIndex));
    items[comboActiveIndex].scrollIntoView({ block: 'nearest' });
    document.getElementById('languageSelect').setAttribute('aria-activedescendant', items[comboActiveIndex].id);
}

function chooseLanguage(lang) {
    const input = document.getElementById('languageSelect');
    input.value = lang;
    document.getElementById('guessBtn').disabled = !matchLanguage(lang);
    closeLanguageList();
}

function populateLanguageSelect() {
    closeLanguageList();
}

// Map whatever was typed onto a canonical language name (case-insensitive), or null
function matchLanguage(text) {
    const needle = text.trim().toLowerCase();
    if (!needle) return null;
    return gameData.languages.find(lang => lang.toLowerCase() === needle) || null;
}

function setupEventListeners() {
    const input = document.getElementById('languageSelect');
    document.getElementById('guessBtn').addEventListener('click', makeGuess);
    document.getElementById('giveUpBtn').addEventListener('click', giveUp);
    input.addEventListener('input', function() {
        document.getElementById('guessBtn').disabled = !matchLanguage(this.value);
        openLanguageList();
    });
    input.addEventListener('focus', openLanguageList);
    input.addEventListener('click', openLanguageList);
    // Delay so a tap on an option still registers on browsers that blur first
    input.addEventListener('blur', () => setTimeout(() => {
        if (document.activeElement !== input) closeLanguageList();
    }, 150));
    input.addEventListener('keydown', function(e) {
        const listOpen = !document.getElementById('languageOptions').hidden;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!listOpen) openLanguageList();
            moveActiveOption(e.key === 'ArrowDown' ? 1 : -1);
        } else if (e.key === 'Escape') {
            closeLanguageList();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const active = document.getElementById(`lang-opt-${comboActiveIndex}`);
            if (listOpen && active) {
                chooseLanguage(active.dataset.value);
            } else if (!matchLanguage(this.value) && filteredLanguages(this.value).length === 1) {
                chooseLanguage(filteredLanguages(this.value)[0]); // unambiguous partial match
            } else {
                closeLanguageList();
                makeGuess();
            }
        }
    });
    // preventDefault on mousedown keeps focus in the input; selection happens on click (a tap, not a scroll)
    const list = document.getElementById('languageOptions');
    list.addEventListener('mousedown', e => e.preventDefault());
    list.addEventListener('click', function(e) {
        const li = e.target.closest('li[role="option"]');
        if (li) chooseLanguage(li.dataset.value);
    });
    const toggle = document.getElementById('comboToggle');
    toggle.addEventListener('mousedown', e => e.preventDefault());
    toggle.addEventListener('click', function() {
        if (list.hidden) {
            input.focus();
            openLanguageList();
        } else {
            closeLanguageList();
        }
    });

    document.getElementById('dateSelect').addEventListener('change', function() {
        const selectedDate = this.value;
        if (selectedDate && validateDateSelection(selectedDate)) {
            loadGameForDate(selectedDate);
        } else if (selectedDate) {
            this.value = '';
        }
    });
    document.getElementById('prevDayBtn').addEventListener('click', () => stepDate(-1));
    document.getElementById('nextDayBtn').addEventListener('click', () => stepDate(1));
}

document.addEventListener('click', function(e) {
    const playBtn = e.target.closest('.play-btn');
    if (playBtn) {
        const audioId = playBtn.getAttribute('data-audio-id');
        if (audioId) {
            togglePlay(audioId, playBtn);
        }
    }
});

function showIncorrectMessage(text) {
    const incorrectMessage = document.getElementById('incorrectMessage');
    incorrectMessage.textContent = text;
    incorrectMessage.style.display = 'none';
    void incorrectMessage.offsetWidth; // restart shake animation
    incorrectMessage.style.display = 'block';
    clearTimeout(showIncorrectMessage.timer);
    showIncorrectMessage.timer = setTimeout(() => {
        incorrectMessage.style.display = 'none';
    }, 5000);
}

function makeGuess() {
    if (gameEnded) return;

    const input = document.getElementById('languageSelect');
    const selectedLanguage = matchLanguage(input.value);

    if (!selectedLanguage) {
        if (input.value.trim()) showIncorrectMessage(`"${input.value.trim()}" isn't in the list of languages.`);
        return;
    }

    if (previousGuesses.includes(selectedLanguage)) {
        showIncorrectMessage(`You already guessed "${selectedLanguage}". Try a different language!`);
        return;
    }

    previousGuesses.push(selectedLanguage);
    input.value = '';
    document.getElementById('guessBtn').disabled = true;

    if (selectedLanguage === gameData.todaysLanguage.language) {
        endGame('won', true);
        return;
    }

    if (previousGuesses.length >= MAX_GUESSES) {
        endGame('lost', true);
        return;
    }

    persistCurrentGame('playing');
    updatePreviousGuessesDisplay();
    populateLanguageSelect();
    showIncorrectMessage(`Incorrect! "${selectedLanguage}" is not the right answer.`);
    showNextClue();
    guessCount++;
    document.getElementById('guessCount').textContent = guessCount;
}

function giveUp() {
    if (gameEnded) return;
    document.getElementById('languageSelect').value = '';
    document.getElementById('guessBtn').disabled = true;
    endGame('lost', true);
}

/******* Clues *******/

function getClues() {
    const lang = gameData.todaysLanguage;
    const textClue = (value) => value && value.trim()
        ? `<div class="text-content">${escapeHTML(value)}</div>`
        : `<div class="text-content empty">(not available for this day)</div>`;
    return [
        { header: '🔊 Audio Clue', content: createAudioClue() },
        { header: '👂 Phonetic Transcription', content: textClue(lang.IPA) },
        { header: '🔤 English Translation', content: textClue(lang.translation) },
        { header: '🌳 Language Family', content: createFamilyClue() },
        { header: '📝 Original Text', content: textClue(lang.sentence) }
    ];
}

function renderClue(clue, extraClass = '') {
    const clueDiv = document.createElement('div');
    clueDiv.className = `clue ${extraClass}`.trim();
    clueDiv.innerHTML = `
        <div class="clue-header">${clue.header}${extraClass.includes('bonus') ? '<span class="clue-tag">Unlocked</span>' : ''}</div>
        ${clue.content}
    `;
    document.getElementById('cluesSection').appendChild(clueDiv);
}

function showNextClue() {
    const clues = getClues();
    if (currentClueIndex < clues.length) {
        renderClue(clues[currentClueIndex]);
        currentClueIndex++;
    }
}

// After the game ends, reveal every clue that wasn't shown, plus the answer card
function revealAllClues() {
    const clues = getClues();
    while (currentClueIndex < clues.length) {
        renderClue(clues[currentClueIndex], 'bonus');
        currentClueIndex++;
    }
    renderAnswerCard();
}

function renderAnswerCard() {
    const lang = gameData.todaysLanguage;
    let lineage = [];
    try {
        lineage = JSON.parse(lang.lineage.replace(/'/g, '"'));
    } catch (e) {
        lineage = [lang.family_0, lang.family_1, lang.family_2].filter(Boolean);
    }
    const card = document.createElement('div');
    card.className = 'clue answer-card';
    card.innerHTML = `
        <div class="clue-header">🌍 The Answer: ${escapeHTML(lang.language)}</div>
        <div class="lineage">${lineage.map(l => `<span class="lineage-node">${escapeHTML(l)}</span>`).join('<span class="lineage-arrow">›</span>')}</div>
        <div class="answer-links">
            ISO 639-3: <code>${escapeHTML(lang.iso)}</code> ·
            <a href="https://glottolog.org/glottolog?iso=${encodeURIComponent(lang.iso)}" target="_blank" rel="noopener">Glottolog</a> ·
            <a href="https://en.wikipedia.org/wiki/ISO_639:${encodeURIComponent(lang.iso)}" target="_blank" rel="noopener">Wikipedia</a>
        </div>
    `;
    document.getElementById('cluesSection').appendChild(card);
}

function createAudioClue() {
    const audioId = "audio-clue-" + currentDate;
    const srcPath = `../audio/Langr/${gameData.todaysLanguage.wave}`;

    return `
        <div class="audio-player">
            <audio id="${audioId}" src="${srcPath}" preload="metadata"></audio>

            <button class="play-btn" data-audio-id="${audioId}" aria-label="Play audio clue">
                ▶
            </button>

            <div class="audio-info">
                <div>Audio sample</div>
                <div>Sample rate: ${escapeHTML(gameData.todaysLanguage.sampling_rate)} Hz</div>
            </div>
        </div>
    `;
}

function togglePlay(audioId, btn) {
    const player = document.getElementById(audioId);

    // Prevent multiple rapid clicks
    if (btn.disabled) return;

    // Only one clip at a time (the answer screen may have played several days)
    document.querySelectorAll('audio').forEach(a => {
        if (a !== player && !a.paused) a.pause();
    });

    if (player.paused) {
        btn.disabled = true;
        player.currentTime = 0;

        player.play().then(() => {
            btn.textContent = "⏸";
            btn.disabled = false;
        }).catch(error => {
            console.error('Error playing audio:', error);
            btn.disabled = false;
        });

        player.onended = player.onpause = () => {
            btn.textContent = "▶";
            btn.disabled = false;
        };
    } else {
        player.pause();
    }
}

function createFamilyClue() {
    const families = [
        gameData.todaysLanguage.family_0,
        gameData.todaysLanguage.family_1
    ].filter(f => f && f.trim() !== '');

    return `<div class="text-content">${families.map(escapeHTML).join(' → ')}</div>`;
}

function updatePreviousGuessesDisplay() {
    const guessesDisplay = document.getElementById('previousGuessesDisplay');
    const answer = gameData.todaysLanguage.language;
    const chips = previousGuesses.length === 0
        ? '<span class="no-guesses">None yet</span>'
        : previousGuesses.map(g =>
            `<span class="guess-chip ${g === answer ? 'correct' : 'wrong'}">${escapeHTML(g)}</span>`
          ).join('');
    guessesDisplay.innerHTML = `
        <div class="previous-guesses-label">Previous guesses <span class="guesses-left">${previousGuesses.length}/${MAX_GUESSES}</span></div>
        <div class="previous-guesses-content">${chips}</div>
    `;
}

/******* Dates *******/

function setupDatePickerRestrictions() {
    const dateInput = document.getElementById('dateSelect');
    const availableDates = getAvailableDates();

    if (availableDates.length > 0) {
        dateInput.min = availableDates[0];
        dateInput.max = availableDates[availableDates.length - 1];
    }
    dateInput.value = currentDate;

    document.getElementById('prevDayBtn').disabled = currentDate <= availableDates[0];
    document.getElementById('nextDayBtn').disabled = currentDate >= localISODate();
}

function getAvailableDates() {
    const today = localISODate();
    return gameData.allRows
        .map(row => row.date)
        .filter(date => date <= today)
        .sort();
}

function validateDateSelection(selectedDate) {
    if (!getAvailableDates().includes(selectedDate)) {
        alert('No game data available for this date. Please select a different date.');
        return false;
    }
    return true;
}

function stepDate(delta) {
    const target = shiftISODate(currentDate, delta);
    if (getAvailableDates().includes(target)) loadGameForDate(target);
}

function randomUnplayedDate() {
    const results = loadResults();
    const unplayed = getAvailableDates().filter(d => d !== currentDate && !(results[d] && results[d].status !== 'playing'));
    const pool = unplayed.length ? unplayed : getAvailableDates().filter(d => d !== currentDate);
    return pool[Math.floor(Math.random() * pool.length)];
}

function loadGameForDate(targetDate) {
    document.querySelectorAll('audio').forEach(a => a.pause());
    loadGameData(targetDate).then(() => {
        startGameForCurrentDate();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(error => {
        console.error('Error loading game for date:', error);
        showError('Failed to load game data for selected date.');
    });
}

// Reset the board, then replay any saved progress for currentDate
function startGameForCurrentDate() {
    currentClueIndex = 0;
    gameEnded = false;
    const saved = loadResults()[currentDate];
    const savedIsValid = saved && saved.answer === gameData.todaysLanguage.language;
    previousGuesses = savedIsValid ? saved.guesses.slice() : [];
    guessCount = previousGuesses.length + 1;

    document.getElementById('cluesSection').innerHTML = '';
    document.getElementById('incorrectMessage').style.display = 'none';
    document.getElementById('languageSelect').value = '';
    document.getElementById('guessBtn').disabled = true;
    document.getElementById('resultPanel').innerHTML = '';
    document.getElementById('resultPanel').style.display = 'none';
    document.getElementById('guessSection').style.display = '';
    document.getElementById('guessLabel').textContent = 'Guess:';
    document.getElementById('guessCount').textContent = guessCount;
    clearInterval(countdownTimer);

    populateLanguageSelect();
    updatePreviousGuessesDisplay();

    const cluesToShow = Math.min(previousGuesses.length + 1, getClues().length);
    for (let i = 0; i < cluesToShow; i++) showNextClue();

    if (savedIsValid && saved.status !== 'playing') {
        endGame(saved.status, false);
    }
}

function updateDateDisplay() {
    const dateDisplay = document.getElementById('currentDateDisplay');
    const today = localISODate();

    const dateObj = new Date(currentDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    if (currentDate === today) {
        dateDisplay.textContent = `Today · #${puzzleNumber(currentDate)}`;
        dateDisplay.title = formattedDate;
        dateDisplay.className = 'current-date-display today';
    } else {
        dateDisplay.textContent = `${formattedDate} · #${puzzleNumber(currentDate)}`;
        dateDisplay.title = '';
        dateDisplay.className = 'current-date-display past-date';
    }
}

/******* End of game *******/

function endGame(status, justFinished) {
    gameEnded = true;
    const won = status === 'won';
    if (justFinished) persistCurrentGame(status);

    document.getElementById('guessSection').style.display = 'none';
    document.getElementById('incorrectMessage').style.display = 'none';
    document.getElementById('guessLabel').textContent = 'Score:';
    document.getElementById('guessCount').textContent = won ? `${previousGuesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    updatePreviousGuessesDisplay();
    revealAllClues();
    renderResultPanel(won);

    if (justFinished && won) launchConfetti();
}

function emojiRow() {
    const answer = gameData.todaysLanguage.language;
    const squares = previousGuesses.map(g => g === answer ? '🟩' : '🟥');
    while (squares.length < MAX_GUESSES) squares.push('⬜');
    return squares.join('');
}

function buildShareText(won) {
    const score = won ? `${previousGuesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    return `Langr #${puzzleNumber(currentDate)} 🌍 ${score}\n${emojiRow()}`;
}

function computeStats() {
    const results = loadResults();
    const finished = Object.entries(results).filter(([, r]) => r.status !== 'playing');
    const wins = finished.filter(([, r]) => r.status === 'won');
    const distribution = Array(MAX_GUESSES).fill(0);
    wins.forEach(([, r]) => { distribution[Math.min(r.guesses.length, MAX_GUESSES) - 1]++; });

    // Daily streak: consecutive days won, ending today (or yesterday if today isn't finished yet)
    let streak = 0;
    let day = localISODate();
    if (!(results[day] && results[day].status === 'won')) day = shiftISODate(day, -1);
    while (results[day] && results[day].status === 'won') {
        streak++;
        day = shiftISODate(day, -1);
    }

    return {
        played: finished.length,
        winPct: finished.length ? Math.round(100 * wins.length / finished.length) : 0,
        streak,
        distribution
    };
}

function renderResultPanel(won) {
    const panel = document.getElementById('resultPanel');
    const answer = gameData.todaysLanguage.language;
    const isToday = currentDate === localISODate();
    const stats = computeStats();
    const maxBar = Math.max(1, ...stats.distribution);
    const thisGame = won ? previousGuesses.length - 1 : -1;
    const headline = won
        ? (isToday ? `🎉 Solved today's Langr in ${previousGuesses.length}!` : `🎉 Solved #${puzzleNumber(currentDate)} in ${previousGuesses.length}!`)
        : `😭 Better luck next time`;

    panel.innerHTML = `
        <div class="result-headline ${won ? 'won' : 'lost'}">${headline}</div>
        <div class="result-answer">The language was <strong>${escapeHTML(answer)}</strong></div>
        <div class="result-emoji">${emojiRow()}</div>

        <div class="stats-row">
            <div class="stat"><div class="stat-num">${stats.played}</div><div class="stat-label">Played</div></div>
            <div class="stat"><div class="stat-num">${stats.winPct}</div><div class="stat-label">Win %</div></div>
            <div class="stat"><div class="stat-num">${stats.streak}</div><div class="stat-label">Day streak</div></div>
        </div>
        <div class="distribution">
            ${stats.distribution.map((n, i) => `
                <div class="dist-row">
                    <span class="dist-label">${i + 1}</span>
                    <span class="dist-bar ${i === thisGame ? 'current' : ''}" style="width: ${Math.max(8, 100 * n / maxBar)}%">${n}</span>
                </div>`).join('')}
        </div>

        <div class="next-game">
            Next Langr in <span id="countdown" class="countdown">--:--:--</span>
        </div>

        <div class="result-actions">
            <button class="action-btn" id="randomDayBtn">🎲 Play a random past day</button>
            ${isToday ? '' : '<button class="action-btn secondary" id="todayBtn">📅 Back to today</button>'}
        </div>

        <div class="share-section">
            <div class="share-buttons">
                <button class="share-btn share-twitter" data-share="twitter">𝕏 Post</button>
                <button class="share-btn share-linkedin" data-share="linkedin">💼 LinkedIn</button>
                <button class="share-btn share-copy" data-share="copy">📋 Copy</button>
            </div>
        </div>
    `;
    panel.style.display = 'block';

    const shareText = buildShareText(won);
    panel.querySelectorAll('[data-share]').forEach(button => {
        button.addEventListener('click', function() {
            switch (this.getAttribute('data-share')) {
                case 'twitter':
                    shareToTwitter(encodeURIComponent(shareText), encodeURIComponent(SHARE_URL));
                    break;
                case 'linkedin':
                    shareToLinkedIn(encodeURIComponent(SHARE_URL));
                    break;
                case 'copy':
                    copyToClipboard(shareText + '\n' + SHARE_URL, this);
                    break;
            }
        });
    });

    panel.querySelector('#randomDayBtn').addEventListener('click', () => {
        const date = randomUnplayedDate();
        if (date) loadGameForDate(date);
    });
    const todayBtn = panel.querySelector('#todayBtn');
    if (todayBtn) todayBtn.addEventListener('click', () => loadGameForDate(localISODate()));

    startCountdown();
}

function startCountdown() {
    clearInterval(countdownTimer);
    const tick = () => {
        const el = document.getElementById('countdown');
        if (!el) return clearInterval(countdownTimer);
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const secs = Math.max(0, Math.floor((midnight - now) / 1000));
        const pad = n => String(n).padStart(2, '0');
        el.textContent = `${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}`;
        if (secs === 0) {
            clearInterval(countdownTimer);
            el.outerHTML = `<button class="action-btn" onclick="loadGameForDate(localISODate())">Play the new Langr!</button>`;
        }
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
}

function launchConfetti() {
    const layer = document.createElement('div');
    layer.className = 'confetti-layer';
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#3498db', '#27ae60', '#e74c3c', '#f39c12', '#9b59b6'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        layer.appendChild(confetti);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 4000);
}

// Sharing functions
function shareToTwitter(text, url) {
    const twitterUrl = `https://x.com/intent/post?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

function shareToLinkedIn(url) {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
}

async function copyToClipboard(text, button) {
    const originalText = button.innerHTML;
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // Fallback for older browsers / iframes without clipboard permission
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
    button.innerHTML = '✅ Copied!';
    button.classList.add('copied');
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('copied');
    }, 2000);
}

// Keep the embedding iframe sized to the game so it never needs an inner scrollbar
if (window.parent !== window && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
        const container = document.querySelector('.game-container');
        window.parent.postMessage({ langrHeight: container.offsetHeight + 60 }, '*');
    }).observe(document.querySelector('.game-container'));
}

// Start the game
initGame();

// Instructions modal functions
function showInstructions() {
    document.getElementById('instructionsModal').classList.add('active');
}

function hideInstructions() {
    document.getElementById('instructionsModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('instructionsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideInstructions();
    }
});
