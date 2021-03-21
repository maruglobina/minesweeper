document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const game = document.querySelector('.game');
    const result = document.querySelector('.result');
    const flagsCounter = document.getElementById('flags');
    const missingFlagsCounter = document.getElementById('missing-flags'); 

    let width = parseInt(document.getElementById("width").value);         
    let bombs = parseInt(document.getElementById("bombs").value);       
    let flags = 0;        
    let cells = [];          
    let isGameOver = false;     

    startGame();

    document.getElementById("playAgain").addEventListener("click", startGame);
    document.getElementById("startAgain").addEventListener("click", function(){document.location.href="/";});
    document.getElementById("saveGame").addEventListener("click", saveGame);

    function drawNumbers() {
        for (let i=0; i < cells.length; i++) {
            let total = 0;                                     
            const isLeftSide = (i % width === 0);             
            const isRightSide = (i % width === width - 1);   

            if (cells[i].classList.contains('nothing')) {
                if (i > 0 && !isLeftSide && cells[i-1].classList.contains('bomb')) total++;
                if (i < (width*width-1) && !isRightSide && cells[i+1].classList.contains('bomb')) total++;
                if (i > width && cells[i-width].classList.contains('bomb')) total++;
                if (i > (width-1) && !isRightSide && cells[i+1-width].classList.contains('bomb')) total++;
                if (i > width && !isLeftSide && cells[i-1-width].classList.contains('bomb')) total++;
                if (i < (width*(width-1)) && cells[i+width].classList.contains('bomb')) total++;
                if (i < (width*(width-1)) && !isRightSide && cells[i+1+width].classList.contains('bomb')) total++;
                if (i < (width*(width-1)) && !isLeftSide && cells[i-1+width].classList.contains('bomb')) total++;

                cells[i].setAttribute('data', total);
                colorNumbers(cells[i]);
            }
        }
    }

    function showCellContent(cell) {
        const cellId = parseInt(cell.id);
        const isLeftSide = (cellId % width === 0);          
        const isRightSide = (cellId % width === width - 1);    

        setTimeout(() => {
            if (cellId > 0 && !isLeftSide) click(cells[cellId-1]);
            if (cellId < (width*width-2) && !isRightSide) click(cells[cellId+1]);
            if (cellId >= width) click(cells[cellId-width]);
            if (cellId > (width-1) && !isRightSide) click(cells[cellId+1-width]);
            if (cellId > (width+1) && !isLeftSide) click(cells[cellId-1-width]);
            if (cellId < (width*(width-1))) click(cells[cellId+width]);
            if (cellId < (width*width-width-2) && !isRightSide) click(cells[cellId+1+width]);
            if (cellId < (width*width-width) && !isLeftSide) click(cells[cellId-1+width]);
        }, 10);
    }

    function showBomb(clickedCell) {
        isGameOver = true;
        clickedCell.classList.add('back-red');

        cells.forEach((cell, index, array) => {
            if (cell.classList.contains('bomb')) {
                cell.innerHTML = '💣';
                cell.classList.remove('bomb');
                cell.classList.add('marked');
            }
        });

        result.textContent = "You're a loser";
    }

    function putFlag(cell) {
        if (isGameOver) return;

        if (!cell.classList.contains('marked') && flags < bombs) {
            if (!cell.classList.contains('flag')) {
                cell.classList.add('flag');
                cell.innerHTML = '🚩';
                flags++;
                updateFlags();
                checkGame();
            } else {
                cell.classList.remove('flag');
                cell.innerHTML = '';
                flags--;
            }
        }
    }

    function checkGame() {
        let wins = 0;

        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('flag') && cells[i].classList.contains('bomb'))
                wins++;
        }

        if (wins === bombs) {
            isGameOver = true;
            result.textContent = 'You win!';
        }
    }

    function updateFlags() {
        flagsCounter.textContent = flags;
        missingFlagsCounter.textContent = (bombs - flags);
    }

    function click(cell) {
        if (cell.classList.contains('marked') || cell.classList.contains('flag') || isGameOver) return;

        if (cell.classList.contains('bomb')) {
            showBomb(cell);
        } else {
            let total = cell.getAttribute('data');
            if (total != 0) {
                cell.classList.add('marked');
                cell.innerHTML = total;
                return;
            }
            cell.classList.add('marked'); 
            showCellContent(cell);
        }
    }

    function colorNumbers(cell){
        var cellValue = parseInt(cell.getAttribute('data'));

        switch (cellValue) {
            case 1:
              cell.classList.add('number-blue');
              break;
            case 2:
                cell.classList.add('number-green');
              break;
            case 3:
                cell.classList.add('number-red');
              break;
            case 4:
                cell.classList.add('number-darkblue');
              break;
            case 5:
                cell.classList.add('number-darkred');
              break;
            default:
                cell.classList.add('number-black');
          }
    }

    function doubleClick(cell) {
         if (!cell.classList.contains('marked') || isGameOver) return;
         showCellContent(cell);
    }

    function startGame() {
        // Comprobamos que los parámetros son correctos
        /*if (width<6 || width>20) {
            alert(`El tamaño no puede ser menor de 6 ni mayor de 20`);
            return;
        }
        if (bombs<1) {
            alert(`El número de bombs tiene que ser como mínimo 1`);
            return;
        }
        if (bombs > width*width) {
            alert(`El número de bombs no puede ser superior al producto de \"Tamaño\" x \"Tamaño\" (${width*width})`);
            return;
        }*/

            
        resetGame();
        
        game.style.width = (width * 4) + 'rem';
        result.style.width = (width * 4) + 'rem';

        const bombsArray = Array(bombs).fill('bomb');
        const emptyArray = Array(width*width - bombs).fill('nothing');
        const completedArray = emptyArray.concat(bombsArray);
        completedArray.sort(() =>  Math.random() - 0.5 );    // => Mezclamos vacíos con bombs
        
        for(let i=0; i < width*width; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add(completedArray[i]);
            game.appendChild(cell);
            cells.push(cell);
            
            cell.addEventListener('click', () => {
                click(event.target);
            });

            cell.oncontextmenu = function(event) {
                event.preventDefault();
                putFlag(cell);
            }

            cell.addEventListener('dblclick', () => {
                doubleClick(event.target);
            });
        }

        drawNumbers();
        updateFlags();
    }

    function retrieveCellEvents(){
        let w = parseInt(document.getElementById("width").value);

        for(let i=0; i < w*w; i++) {
            const cell = document.getElementById(i);
            
            cell.addEventListener('click', () => {
                click(event.target);
            });

            cell.oncontextmenu = function(event) {
                event.preventDefault();
                putFlag(cell);
            }

            cell.addEventListener('dblclick', () => {
                doubleClick(event.target);
            });
        }
    }

    function resetGame(){
        game.innerHTML = "";
        result.innerHTML = "";
        result.className = "result";
        cells = [];
        isGameOver = false;
        flags = 0;
    }

    function saveGame(){
        var data = gameContainer.innerHTML;
        var saveGame = document.getElementById("saveGame");
        saveGame.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
        saveGame.download = 'minesweeper - '+ Date.now() +'txt';
        alert("Your game was saved successfully!");
    }

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
    
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
    
          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              gameContainer.innerHTML = "";
              gameContainer.innerHTML = e.target.result;
              alert("You can continue your game!");
            };
          })(f);
    
          reader.readAsText(f);
          retrieveCellEvents();
        }
      }
    
      document.getElementById('files').addEventListener('change', handleFileSelect, false);
});