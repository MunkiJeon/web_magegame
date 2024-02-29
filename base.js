  const gameContainer = document.getElementById('game-container');
  const player = document.getElementById('player');
  const goal = document.getElementById('goal');
  const timerDisplay = document.getElementById('timer');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');

  let timer;
  let timeLeft;
  let gameStarted = false;

  function startGame() {
      gameStarted = true;
      startButton.style.display = 'none';
      restartButton.style.display = 'inline-block';

      // Randomly position player and goal
      player.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - player.offsetWidth)) + 'px';
      player.style.top = Math.floor(Math.random() * (gameContainer.offsetHeight - player.offsetHeight)) + 'px';
      goal.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - goal.offsetWidth)) + 'px';
      goal.style.top = Math.floor(Math.random() * (gameContainer.offsetHeight - goal.offsetHeight)) + 'px';

      // Start timer
      timeLeft = 99999;
      updateTimerDisplay();
      timer = setInterval(updateTimer, 1000);

      // Event listener for player movement
      document.addEventListener('keydown', movePlayer);
  }

  function restartGame() {
      clearInterval(timer);
      gameStarted = false;
      startGame();
  }

  function updateTimer() {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft === 0) {
          endGame(false); // Time's up
      }
  }

  function updateTimerDisplay() {
      timerDisplay.textContent = timeLeft;
  }

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

      // Check for collision with walls
      if (!checkCollision(newBCR_X, newBCR_Y)) {
          player.style.left = newX + 'px';
          player.style.top = newY + 'px';
          checkGoal();
      }
  }

  function checkCollision(x, y) {
      const playerRect = player.getBoundingClientRect();
      const gameRect = gameContainer.getBoundingClientRect();

      return x <= gameRect.left || x + playerRect.width >= gameRect.right ||
          y <= gameRect.top || y + playerRect.height >= gameRect.bottom;
  }

  function checkGoal() {
      const playerRect = player.getBoundingClientRect();
      const goalRect = goal.getBoundingClientRect();

      if (playerRect.left < goalRect.right &&
          playerRect.right > goalRect.left &&
          playerRect.top < goalRect.bottom &&
          playerRect.bottom > goalRect.top) {
          endGame(true); // Reached the goal
      }
  }

  function endGame(win) {
      clearInterval(timer);
      document.removeEventListener('keydown', movePlayer);

      if (win) {
          alert("You escaped! Time taken: " + (60 - timeLeft) + " seconds");
      } else {
          alert("Time's up! Try again.");
      }

      startButton.style.display = 'inline-block';
      restartButton.style.display = 'none';
  }

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);