const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const goal = document.getElementById('goal');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

const ROWS = 15; // 미로의 행 수
const COLS = 20; // 미로의 열 수
const WALL_PROBABILITY = 0.3; // 벽이 있는 확률

let maze = [];

let timer;
let timeLeft;
let gameStarted = false;

// 미로를 생성하는 함수
function generateMaze() {
    maze = [];
    for (let i = 0; i < ROWS; i++) {
        maze[i] = [];
        for (let j = 0; j < COLS; j++) {
            maze[i][j] = Math.random() < WALL_PROBABILITY ? 1 : 0;
        }
    }
}

// 미로를 렌더링하는 함수
function renderMaze() {
    gameContainer.innerHTML = ''; // 기존의 미로를 지움
    var p = document.createElement('div'), g = document.createElement('div');
    gameContainer.appendChild(p);
    gameContainer.appendChild(g);
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement('div');
            cell.className = maze[i][j] ? 'wall' : 'path';
            if (maze[i][j]) { // 벽일 경우 회색으로 설정
                cell.style.backgroundColor = 'grey';
            }
            cell.style.gridColumn = j + 1;
            cell.style.gridRow = i + 1;
            gameContainer.appendChild(cell);
        }
    }
}

// 게임 시작 시 미로 생성 및 렌더링
function startGame() {
    gameStarted = true;
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';

    generateMaze();
    renderMaze();

    // Randomly position player and goal
    const playerPosition = getRandomPosition();
    const goalPosition = getRandomPosition();

    player.style.left = playerPosition.x + 'px';
    player.style.top = playerPosition.y + 'px';

    goal.style.left = goalPosition.x + 'px';
    goal.style.top = goalPosition.y + 'px';

    // Start timer
    timeLeft = 99999;
    updateTimerDisplay();
    timer = setInterval(updateTimer, 1000);

    // Event listener for player movement
    document.addEventListener('keydown', movePlayer);
}

// 게임 재시작 함수
function restartGame() {
    clearInterval(timer);
    gameStarted = false;
    startGame();
}

// 타이머 업데이트 함수
function updateTimer() {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft === 0) {
        endGame(false); // Time's up
    }
}

// 타이머 표시 업데이트 함수
function updateTimerDisplay() {
    timerDisplay.textContent = timeLeft;
}

// 플레이어 이동 함수 (벽을 고려함)
function movePlayer(event) {
    const key = event.key.toLowerCase();
    const playerRect = player.getBoundingClientRect();
    const gameRect = gameContainer.getBoundingClientRect();

    let newBCR_X = playerRect.left;
    let newBCR_Y = playerRect.top;
    let newX = parseInt(player.style.left);
    let newY = parseInt(player.style.top);

    if (key === 'arrowup' || key === 'w' || key === 'W') {
        newBCR_Y = Math.max(playerRect.top - 10, gameRect.top);
        newY -= 10;
    } else if (key === 'arrowdown' || key === 's' || key === 'S') {
        newBCR_Y = Math.min(playerRect.top + 10, gameRect.bottom - playerRect.height);
        newY += 10;
    } else if (key === 'arrowleft' || key === 'a' || key === 'A') {
        newBCR_X = Math.max(playerRect.left - 10, gameRect.left);
        newX -= 10;
    } else if (key === 'arrowright' || key === 'd' || key === 'D') {
        newBCR_X = Math.min(playerRect.left + 10, gameRect.right - playerRect.width);
        newX += 10;
    }

    // 새 위치가 게임 영역 내에 있고 벽이 아닌 경우에만 플레이어 이동
    if (newX >= gameRect.left && newX + playerRect.width <= gameRect.right &&
        newY >= gameRect.top && newY + playerRect.height <= gameRect.bottom &&
        canMoveTo(Math.floor(newX / 20), Math.floor(newY / 20))) {
        player.style.left = newX + 'px';
        player.style.top = newY + 'px';
        checkGoal();
    }
}

// 게임 종료 함수
function endGame(win) {
    clearInterval(timer);
    document.removeEventListener('keydown', movePlayer);

    if (win) {
        alert("탈출 성공! 소요 시간: " + (60 - timeLeft) + " 초");
    } else {
        alert("시간 초과! 다시 시도하세요.");
    }

    startButton.style.display = 'inline-block';
    restartButton.style.display = 'none';
}

// 게임 시작 버튼 클릭 이벤트
startButton.addEventListener('click', startGame);
// 게임 재시작 버튼 클릭 이벤트
restartButton.addEventListener('click', restartGame);

// 랜덤한 위치 반환 함수
function getRandomPosition() {
    const gameRect = gameContainer.getBoundingClientRect();
    const x = Math.floor(Math.random() * (gameRect.width - player.offsetWidth));
    const y = Math.floor(Math.random() * (gameRect.height - player.offsetHeight));
    return { x: x, y: y };
}