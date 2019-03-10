
let cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

const deck = document.querySelector('.deck');

shuffleCards();

let openCards = [];
let playerMoveCount = 0;
let starCount = 0;

// Initialize mutable variables for timer 
let timerSeconds = 0;
let timerMinutes = 0;
let timer;
let timerActive = false;
let matchCount = 0;

// Restart game on click
document.querySelector('.restart').addEventListener('click', resetGame);

const closeIcon = document.querySelector('#close');

const cancelButton = document.querySelector('.cancel-btn');

const replayButton = document.querySelector('.replay-btn');


deck.addEventListener('click', function(i) {
    const card = i.target;
    if (clickCheck(card)) {
        startTimer();
        toggleClass(card);
        openCards.push(card);
        if (openCards.length === 2) {
            checkForMatch();
            countMove();
            checkMovesCount();
        }
    }
});


// Check and limit click event to set of unmatched, unique cards:
function clickCheck(card) {
    return (
        openCards.length < 2 &&
        !openCards.includes(card) &&    
        card.classList.contains('card') &&
        !card.classList.contains('match')
    );
}

function toggleClass(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}


function checkForMatch() {
    if (openCards[0].firstElementChild.className == 
        openCards[1].firstElementChild.className) {
            saveMatch();
            countMatches();
    } else {
            misMatch();
        }
}

function misMatch() {
    setTimeout(function () {
        for (card of openCards) {
            card.classList.toggle('open');
            card.classList.toggle('show');
        }
        openCards = [];
    }, 1000);
}

function saveMatch() {
    openCards[0].classList.toggle('match');
    openCards[1].classList.toggle('match');
    openCards = [];
    matchCount++;
}

function countMatches() {
    const winCount = cards.length;
    if(matchCount === winCount) {
        setTimeout(function() {
            updateModal();
            stopTimer();
            showModal();
            starCount = 0;
            matchCount = 0;
        }, 1000);
    }
}


function countMove() {   
    playerMoveCount++;    
    const playerMoveBoard = document.querySelector('.moves');
    playerMoveBoard.innerHTML = playerMoveCount;
}


function checkMovesCount() {
    
    if (playerMoveCount === 16 || playerMoveCount === 24) {
        hideStar();
    }
}

function hideStar() {
    
    const starsSelect = document.querySelectorAll('.stars li');
    
    for (star of starsSelect) {       
        if (star.style.display !== 'none') {
            star.style.display = 'none';        
            break;
        }
    }
}

// Helper Code  //

function updateTimer() {
    timerSeconds++;

    if (timerSeconds < 10) {
        timerSeconds = `0${timerSeconds}`
    }

    if (timerSeconds >= 60) {
        timerMinutes++;
        timerSeconds = '00';
    }

    const pageTimer = document.querySelector('.timer')
    
    pageTimer.innerHTML = timerMinutes + ':' + timerSeconds;
}

function startTimer() {
    if (timerActive == false) {
        timer = setInterval(updateTimer, 1000);
        timerActive = true;
    }
}

function stopTimer() {
    clearInterval(timer);
    timerSeconds = 0;
    timerMinutes = 0;
    timerActive = false;
}

// End Helper Code  //


function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll(".deck li"));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
        card.classList.value = "card";
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleCards() {  
    const cards = document.querySelectorAll('.card'); 
    const cardsArray = Array.from(cards);  
    const shuffledCards = shuffle(cardsArray);   
    shuffledCards.forEach(function(card) {
       deck.appendChild(card);
   });
}

function resetCards() {
    const cards = document.querySelectorAll('.card');
    for (card of cards) {
        if (card.classList.contains('show') ||
            card.classList.contains('show') ||
            card.classList.contains('match')
        ) {
            card.className = 'card';
        }
    }
}

function resetMoveCount() {
    playerMoveCount = 0;
    const playerMoveBoard = document.querySelector('.moves');
    playerMoveBoard.innerHTML = playerMoveCount;
}

function resetTimer() {
    stopTimer();
    const pageTimer = document.querySelector('.timer');
    pageTimer.innerHTML = timerMinutes + ':' + `0${timerSeconds}`;
}

function resetStars() {
    const starsSelect = document.querySelectorAll('.stars li');
    for (star of starsSelect) {
        if (star.style.display == 'none') {
            star.style.display = 'inline-block';
        }
    }
    starCount = 0;
}

function getStarCount() {
    const starsSelect = document.querySelectorAll('.stars li');
    for (star of starsSelect) {
        if(star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

function updateModal() {
    
    const pageTimeStat = document.querySelector('.time-stat');
    pageTimeStat.innerHTML = 'Time: ' + timerMinutes + ':' + timerSeconds;

    const pageMovesStat = document.querySelector('.moves-stat');
    pageMovesStat.innerHTML = 'Moves: ' + `${playerMoveCount}`
    
    const pageStarStat = document.querySelector('.star-stat');
    getStarCount();
    pageStarStat.innerHTML = 'Stars: ' + `${starCount}`
}

function showModal() {
    const overlay = document.querySelector('.overlay');
    overlay.classList.toggle('hide');
}

closeIcon.addEventListener('click', function() {
    showModal();
});

cancelButton.addEventListener('click', function() {
    showModal();
});

replayButton.addEventListener('click', function() {
    showModal();
    resetGame();
});

function resetGame() {
    resetTimer();
    resetStars();   
    resetMoveCount();
    resetCards();
    shuffleCards();
    matchCount = 0;
    openCards = [];
}

