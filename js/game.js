(() => {
  'use strict';

  let click1 = {},
    click2 = {},
    choosenLevel = "medium",
    choosenBack = "pokeball",
    data = pokemonData,
    gameStarted, pairs, matches, moves, timer;

  class Card {
    constructor(card, num, back) {
      this.id = card.id + '-' + num;
      this.image = card.image;
      this.name = card.name;
      this.html = `<article class="card" id="${this.id}">
        <div class="card-back">
          <img src="images/${this.image}" class="card-image" >
        </div>
        <div class="card-front">
          <img src="images/${choosenBack}.png" class="card-image" >
        </div>
      </article>`;
    }
  }

  const makeCardArray = (data, choosenLevel) => {

    let array = [];

    // Get the correct sized array for level
    let trimmedData = trimArray(data, choosenLevel);

    // Add two of each card to the array
    trimmedData.forEach((card) => {
      array.push(new Card(card, 1, choosenBack));
      array.push(new Card(card, 2, choosenBack));
    });

    return array;
  };

  // Set size of card array based on level
  const trimArray = (array) => {
    let newArray = array.slice();
    // trim array as needed
    while (newArray.length > pairs) {
      let randomIndex = Math.floor(Math.random() * newArray.length);
      newArray.splice(randomIndex, 1);
    }
    return newArray;
  };

  const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      // Choose an element randomly
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Switch current element and random element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const displayCards = (cardArray) => {
    cardArray.forEach((card) => {

      // Add cards to game board
      document.getElementById('game-board').insertAdjacentHTML('afterbegin', card.html);

      document.getElementById(card.id).addEventListener('click', () => {
        // Start timer on first click
        if (!gameStarted) {
          gameTimer();
          gameStarted = true;
        }

        // Check for match when clicked
        checkMatch(card);
      });
    });
  };

  const checkMatch = (card) => {
    if (!click1.name) {
      click1 = card;
      document.getElementById(card.id).classList.add('flipped');
      return;

    // Check if second card different
    } else if (!click2.name && click1.id !== card.id) {
      click2 = card;
      document.getElementById(card.id).classList.add('flipped');
      moves++;
      document.getElementById("moves").innerHTML = moves;
    } else return;

    if (click1.name === click2.name) {
      foundMatch();
    } else {
      flipCards();
    }
  };

  const foundMatch = () => {
    matches++;
    if (matches === pairs) {
      gameOver();
    }

    // Hide cards if they matched and reset click objects
    setTimeout(() => {
      document.getElementById(click1.id).classList.add('hidden');
      document.getElementById(click2.id).classList.add('hidden');
      click1 = {};
      click2 = {};
    }, 1000);
  };

  const flipCards = () => {
    // Flip back cards if they are different and reset click objects
    setTimeout(() => {
      document.getElementById(click1.id).classList.remove('flipped');
      document.getElementById(click2.id).classList.remove('flipped');
      click1 = {};
      click2 = {};
    }, 600);
  };

  const gameOver = () => {
    clearInterval(timer);

    setTimeout(() => {
      document.getElementById('winModal').style.display = 'block';
    }, 500);

  };

  const gameTimer = () => {
    let startTime = new Date().getTime();

    // Update the timer every second
    timer = setInterval(() => {
      var now = new Date().getTime();

      // Find the time elapsed between now and start
      var elapsed = now - startTime;

      // Calculate minutes and seconds
      let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

      // Add starting 0 if seconds < 10
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      let currentTime = minutes + ':' + seconds;

      // Update clock on game screen
      document.getElementsByClassName('clock')[0].innerHTML = currentTime;
    }, 750);

  };

  const startGame = (cards,choosenLevel) => {
    // Set and reset game variables
    gameStarted = false;
    moves = 0;
    matches = 0;
    pairs = gameLevels[choosenLevel].pairs;

    // Close startModal when game starts
    document.getElementById('startModal').style.display = 'none';

    // Reset HTML when restart game
    document.getElementById('game-board').innerHTML = '';
    document.getElementsByClassName('clock')[0].innerHTML = '0:00';
    document.getElementById('moves').innerHTML = '0';
    document.getElementById('winModal').style.display = 'none';

    // Get cards and start the game!
    let cardArray = makeCardArray(data, choosenLevel);

    shuffle(cardArray);
    displayCards(cardArray);
  };

  // Open start modal on load
  window.onload = () => {
    document.getElementById('startModal').style.display = 'block';
  };
  
  // Close modals on click
  let winModalArray = [document.getElementById('winModal'), document.getElementById('close-win')];
  let startModalArray = [document.getElementById('startModal'), document.getElementById('close-start')];

  winModalArray.forEach((elem) => {
    elem.addEventListener('click', () => {
      document.getElementById('winModal').style.display = 'none';
    });
  });
  
  startModalArray.forEach((elem) => {
    elem.addEventListener('click', () => {
      document.getElementById('startModal').style.display = 'none';
    });
  });

  // Start game on click
  document.getElementById('start-game').addEventListener('click', () => {
    startGame(data,choosenLevel);
  })

  // Level and back settings
  Array.from(document.getElementsByClassName('level-button')).forEach((x) => {
    x.addEventListener('click', (e) => {
      // Toggle buttons on click
      Array.from(document.getElementsByClassName('level-button')).forEach((e)=>{
        e.classList.remove("_active");
      })
      e.target.classList.add("_active");

      // Set level on click
      choosenLevel = e.target.id;
    });
  })

  Array.from(document.getElementsByClassName('choose-back')).forEach((x) => {
    x.addEventListener('click', (e) => {
      // Toggle buttons on click
      Array.from(document.getElementsByClassName('back')).forEach((e) => {
        e.classList.remove("_active");
      })
      e.target.classList.add("_active");

      // Set shirt card on click
      choosenBack = e.target.id
      if(e.target.id === 'birds') {
        data = birdsData;
      } else if(e.target.id === 'pokeball') {
        data = pokemonData; 
      };
    });
  })

  // Restart game
  document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('winModal').style.display = 'none';
    document.getElementById('startModal').style.display = 'block';
  })

})();
