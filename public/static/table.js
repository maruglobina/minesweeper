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

    //esta es la funcion que se dedica a poner los numeros en las celdas. hasta ahora solo sabemos que son celdas
    //sin bombas
    function drawNumbers() {
        for (let i=0; i < cells.length; i++) {
            let total = 0;
            //las siguientes constantes es para saber si es una casilla que está al borde del tablero                                     
            const isLeftSide = (i % width === 0);             
            const isRightSide = (i % width === width - 1);   

            //solo dibujamos numeros si tienen la clase nothing, caso contrario es una bomba
            if (cells[i].classList.contains('nothing')) {
                //los siguientes ifs corresponden a ver la cercanía de las bombas. Para eso hay que revisar casilla x casilla
                //en cercanía de la celda que estemos tratando. por eso la necesidad de las constantes anteriores. En base a eso
                //calculamos el numero que tiene que saber la casilla
                if (i > 0 && !isLeftSide && cells[i-1].classList.contains('bomb')) total++;
                if (i < (width*width-1) && !isRightSide && cells[i+1].classList.contains('bomb')) total++;
                if (i > width && cells[i-width].classList.contains('bomb')) total++;
                if (i > (width-1) && !isRightSide && cells[i+1-width].classList.contains('bomb')) total++;
                if (i > width && !isLeftSide && cells[i-1-width].classList.contains('bomb')) total++;
                if (i < (width*(width-1)) && cells[i+width].classList.contains('bomb')) total++;
                if (i < (width*(width-1)) && !isRightSide && cells[i+1+width].classList.contains('bomb')) total++;
                if (i < (width*(width-1)) && !isLeftSide && cells[i-1+width].classList.contains('bomb')) total++;

                //data va a almacenar el numero que va a a tener esa celda
                cells[i].setAttribute('data', total);
                //parodiando el viejo buscaminas, le damos color en base al numero que le corresponde a la celda
                colorNumbers(cells[i]);
            }
        }
    }

    //esta funcion muestra el contenido de la celda, si no tiene bombas cerca
    //es cuando se muestran varias casillas a la vez. para simular ese comportamiento hay que hacer de cuenta que se clickea
    //por eso copiamos el comportamiento de la funcion anterior de saber si estamos en una celda al borde del tablero y demas
    function showCellContent(cell) {
        const cellId = parseInt(cell.id);
        const isLeftSide = (cellId % width === 0);          
        const isRightSide = (cellId % width === width - 1);    

        //este comportamiento lo va a hacer despues de 10 milisegundos, osea va a ser super rapido
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

    //esta funcion muestra la bomba que te va a hacer perder. de esa manera terminamos el juego con el booleano
    //y pintamos el fondo de rojo, como mostrando 'por esta bomba perdiste chabon'
    function showBomb(clickedCell) {
        isGameOver = true;
        clickedCell.classList.add('back-red');

        //pero tambien tenemos que mostrar donde estan todas las otras bombas, para eso buscamos las que tienen la clase bomb
        cells.forEach((cell, index, array) => {
            if (cell.classList.contains('bomb')) {
                cell.innerHTML = '💣';
                cell.classList.remove('bomb');
                cell.classList.add('marked');
            }
        });

        //le mostramos al jugador que es un perdedor jajaj
        result.textContent = "You're a loser";
    }

    //esta funcion pone las banderas. obviamente no se puede insertar banderas si el juego termino
    function putFlag(cell) {
        if (isGameOver) return;

        //sigue la logica de otros metodos, se guia por la clase, una vez que pusimos una bandera la clase que la identifica es marked
        //y tenemos que dar visibilidad de que siempre ponermos banderas sin sobrepasar la cantidad de bombas
        if (!cell.classList.contains('marked') && flags < bombs) {
            if (!cell.classList.contains('flag')) {
                cell.classList.add('flag');
                cell.innerHTML = '🚩';
                flags++;
                //esto es importante porque avisamos de la cantidad de banderas que ponemos y verificamos si ya el jugador acerto
                updateFlags();
                checkGame();
            } else {
                //en caso que se haya arrepentido hacemos lo contrario
                cell.classList.remove('flag');
                cell.innerHTML = '';
                flags--;
            }
        }
    }

    // funcion que verifica que si gano el juego
    function checkGame() {
        let wins = 0;

        //cuando gano? cuando coincide las banderas con las bombas en posicion y en cantidad
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('flag') && cells[i].classList.contains('bomb'))
                wins++;
        }

        if (wins === bombs) {
            isGameOver = true;
            result.textContent = 'You win!';
        }
    }

    //esta funcion es para avisarle al jugador cuantas banderas tiene disponible
    function updateFlags() {
        flagsCounter.textContent = flags;
        missingFlagsCounter.textContent = (bombs - flags);
    }

    //la funcion del click en la celda, 
    //solo vamos a proseguir si no esta marcada, si no tiene bandera y si el juego no termino
    function click(cell) {
        if (cell.classList.contains('marked') || cell.classList.contains('flag') || isGameOver) return;

        //si hay bomba, mostramos que perdio
        if (cell.classList.contains('bomb')) {
            showBomb(cell);
        } else {
            //pero si no la hay, la marcamos y mostramos el numero
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

    //esta funcion le da color al numero, en base a su valor. el color esta inspirado en el juego original
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

    function startGame() {
        //limpieza del tablero 
        resetGame();
        
        //armamos la dimension del tablero en base a lo que el usuario paso por parametro
        game.style.width = (width * 4) + 'rem';
        result.style.width = (width * 4) + 'rem';

        //armamos un array de bombas y un array de 'vacios' para combinar despues.
        //la cantidad de bombas tambien sale del parametro que eligio el usuario en la segunda pantalla
        const bombsArray = Array(bombs).fill('bomb');
        const emptyArray = Array(width*width - bombs).fill('nothing');
        //mezclamos ambos arrays
        const completedArray = emptyArray.concat(bombsArray);
        // de manera aleatoria ordenamos el array, de esa manera se distribuyen las bombas
        completedArray.sort(() =>  Math.random() - 0.5 ); 
        
        //ahora hacemos una matriz, que es el tablero en si. la forma de crearlo es:
        //se crea celda por celda, con un div, se le pone un id y se le agrega una clase que tiene que ver con si
        // es vacio, es decir, va a tener un numero o si es bomba. todo esto es necesario para el momento en que se clickee
        // y la aplicacion sepa que es lo que tiene que mostrar.
        for(let i=0; i < width*width; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add(completedArray[i]);
            game.appendChild(cell);
            cells.push(cell);

            //una vez que se preparo la celda se la agrega a la matriz y se le ponen listener para gestionar los clicks
            
            cell.addEventListener('click', () => {
                click(event.target);
            });

            cell.oncontextmenu = function(event) {
                event.preventDefault();
                putFlag(cell);
            }
        }

        drawNumbers();
        updateFlags();
    }

    //esta funcion es necesaria para la logica de recuperar la partida.
    //sucede que como guardamos el html en un txt, luego necesitamos agregarle los listeners
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
        }
    }

    //reseteo del juego. sirve para volver a jugar
    function resetGame(){
        game.innerHTML = "";
        result.innerHTML = "";
        result.className = "result";
        cells = [];
        isGameOver = false;
        flags = 0;
    }

    //se guarda el juego en un txt, es decir se guarda el html del tablero para luego recuperarlo.
    function saveGame(){
        var data = gameContainer.innerHTML;
        var saveGame = document.getElementById("saveGame");
        saveGame.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
        saveGame.download = 'minesweeper - '+ Date.now() +'.txt';
        alert("Your game was saved successfully!");
    }

    //recupero de la partida, se carga el html y se insertan los eventos de las celdas.
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