const path = require('path');
const htmlparser2 = require("htmlparser2");
var fs = require('fs');
const cheerio = require('cheerio');

var size = 0;
var bombs = 0;

exports.new_game = function(req, res, next) {
    size = req.body.size;
    bombs = req.body.bombs;

    //app.locals({ size: req.size, bombs: req.bombs });
    //drawTable();
    res.render(path.join('../views/table.html'));
};

drawTable = function(){
    // Selectores
    const $ = cheerio.load(fs.readFileSync('./views/table.html'));
    const juego = $('#juego');
    const resultado = $('#resultado-juego');
    const contadorBanderas = $('#num-banderas');
    const contadorBanderasRestantes = $('#banderas-restantes');
    const botonGenerar = $.html('.btn-generar');

    width = 10;

    //validaciones pasar a la primera pantalla
        // Comprobamos que los parámetros son correctos
        /*if (width<6 || width>20) {
            alert(`El tamaño no puede ser menor de 6 ni mayor de 20`);
            return;
        }
        if (bombs<1) {
            alert(`El número de bombas tiene que ser como mínimo 1`);
            return;
        }
        if (bombs > width*width) {
            alert(`El número de bombas no puede ser superior al producto de \"Tamaño\" x \"Tamaño\" (${width*width})`);
            return;
        }*/

        
            juego.innerHTML = "";
            resultado.innerHTML = "";
            resultado.className = "resultado-juego";
            squares = [];
            finPartida = false;
            flags = 0;
        

        // Damos dimensiones al juego, según en número de squares
        juego[0].attribs.style  = 'width='+(width * 4) + 'rem;';
        resultado[0].attribs.style = 'width='+(width * 4) + 'rem;';

        // Creamos un matriz con bombas aleatorias
        const arrayBombas = Array(bombs).fill('bomba');
        const arrayVacios = Array(width*width - bombs).fill('vacio');
        const arrayCompleto = arrayVacios.concat(arrayBombas);
        arrayCompleto.sort(() =>  Math.random() - 0.5 );    // => Mezclamos vacíos con bombas
        
        for(let i=0; i < width*width; i++) {
            
            juego.append("<div id='"+i+"'></div>");
            const square = $('#'+i)
            //square.setAttribute('id', i);
            square.addClass(arrayCompleto[i]);
            squares.push(square);
            
            // Añadimos función al hacer click
            square.addEventListener('click', () => {
                click(event.target);
            });

            // Añadimos función al hacer click derecho
            square.oncontextmenu = function(event) {
                event.preventDefault();
                addFlag(square);
            }

            // Añadimos función al hacer doble-click
            square.addEventListener('dblclick', () => {
                dobleClick(event.target);
            });
        }

        //añadeNumeros();
        //actualizaNumBanderas();
}

function addFlag(square) {
    if (finPartida) return;

    if (!square.classList.contains('marcada') && flags < bombs) {
        if (!square.classList.contains('bandera')) {
            square.classList.add('bandera');
            square.innerHTML = '🚩';
            flags++;
            actualizaNumBanderas();
            compruebaPartida();
        } else {
            square.classList.remove('bandera');
            square.innerHTML = '';
            flags--;
        }
    }
}