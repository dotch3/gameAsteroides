window.addEventListener('load', () => {
    console.log("initial loading");
    doStartGame();
    //Button para restart game
    var objBotaoRestart = document.getElementById("restart-game");
    objBotaoRestart.onclick = function() {
        console.log("restart game");
        doStartGame();

    }
});

function doStartGame() {
    //Canvas
    var canvas = document.getElementById("my-canvas");
    var context = canvas.getContext('2d');
    var max_x = 800;
    var min_x = 0;
    var max_y = 400;
    var min_y = 0;

    //Drawing:
    context.shadowColor = "#232222";
    context.shadowOffsetX = 4;
    context.shadowOffsetY = 4;
    context.shadowBlur = 5;

    //Timer
    var milliSeconds = 0;
    var seconds = 0;
    var objTimer = document.getElementById("timer");

    //Level e pontos
    var limitLevels = 10;
    var limitTimeForLevel = 3;
    var currentLevel = 1;
    var objLevel = document.getElementById("level");
    objLevel.value = currentLevel;

    var pontos = 0;
    var objPontos = document.getElementById("pontos");
    objPontos.value = pontos;

    var objEndGame = document.getElementById("status-game")
    var collisionDetected = false;

    //Nave
    var largura_nave = 50;
    var altura_nave = 50;
    var x_nave = 0;
    var y_nave = max_y - altura_nave;
    var paso_nave = 15;
    var imagemNave = new Image();
    imagemNave.src = "imagens/cima.png";
    // imagemNave.src = "imagens/air-force.png";

    //Asterorides
    var largura_ast = 60;
    var altura_ast = 60;
    var contAst = 0;
    var array_x_ast = new Array();
    var array_y_ast = new Array();
    array_x_ast[contAst] = Math.floor((Math.random() * (max_x - min_x)) + min_x);
    array_y_ast[contAst] = 0; //Asteroide vai começar no borde superior do canvas
    paso_asteroide = 2;
    var imagemAsteroide = new Image();
    // imagemAsteroide.src = "https://www.spriters-resource.com/resources/sheet_icons/47/49877.png";
    imagemAsteroide.src = "imagens/meteor_2.png";

    //Colisão
    var imageCollision = new Image();
    imageCollision.src = "imagens/boom.gif";
    requestAnimationFrame(gameLoop);

    // Evento do teclado
    window.onkeydown = pressionaTecla;
    window.onkeyup = soltaTecla;

    //Evento Mouse
    window.onmousedown = pressionaMouse;



    //Functions:

    //a nave volta a posição apontarCima quando a tecla e liberada gerando um efeito de estar pronto para os asteroide ☄️ 
    function soltaTecla(e) {
        console.log("soltaTecla", e.key);
        imagemNave.src = "imagens/cima.png";
    }

    function pressionaTecla(teclaEvent) {
        // function recebe un evento de teclado teclaEvent
        console.log(`pressionaTecla: ${teclaEvent.key} - code: ${teclaEvent.keyCode} `);

        switch (teclaEvent.keyCode) {
            case 38:
            case 87:
                if (y_nave > min_y + paso_nave) {
                    y_nave = y_nave - paso_nave;
                    imagemNave.src = "imagens/cima.png";
                    console.log('Navegar pra cima');
                }
                break;
            case 40:
            case 83:
                if (y_nave < max_y - altura_nave) {
                    y_nave = y_nave + paso_nave;
                    imagemNave.src = "imagens/baixo.png";
                    console.log('Navegar pra baixo');
                }
                break;
            case 39:
            case 68:
                if (x_nave < max_x - largura_nave) {
                    x_nave = x_nave + paso_nave;
                    imagemNave.src = "imagens/direita.png";
                    console.log('Navegar pra direita');
                }
                break;
            case 37:
            case 65:
                if (x_nave > min_x) {
                    x_nave = x_nave - paso_nave;
                    imagemNave.src = "imagens/esquerda.png";
                    console.log('Navegar pra esquerda');
                }
                break;
            default:
                console.log('tecla no reconhecida para navegação');
                break;
        }
    }

    function pressionaMouse(clickEvent) {
        //Recebe un evento de mouse
        console.log(`pressionaMouse: X: ${clickEvent.screenX} - Y: ${clickEvent.screenY}`);
    }

    function gameLoop() {
        context.clearRect(0, 0, max_x, max_y);
        console.log(`Debug Nave: X ${x_nave} Y ${y_nave}`)
        console.log(`Debug Asteroide: X ${array_x_ast[contAst]} Y ${array_y_ast[contAst]}`)
        console.log(`Debug: currentLevel ${currentLevel} quantAsteroides ${contAst}`)
        desenharAsteroide(contAst, array_x_ast, array_y_ast, largura_ast = largura_ast, altura_ast = altura_ast);

        // Vamos aniadir complexidade aniadendo mais asteroides dependendo o level e o tempo do jogo.
        if (seconds == 2) {
            console.log(`precisa de um novo asteroide ${contAst}`)
            paso_asteroide++;
            newAsteroide();
            paso_asteroide--;
        } else if ((currentLevel % 2 == 0) && (milliSeconds % 200 == 0)) {
            console.log("Dificuldade ++")
                // newAsteroide(2);
            let max = 5;
            let min = 2;
            var randomQtd = Math.floor((Math.random() * (max - min)) + min);
            newAsteroide(randomQtd);
        } else if ((currentLevel % 5 == 0) && (milliSeconds % 200 == 0)) {
            console.log("Dificuldade +++")
            let max = 8;
            let min = 2;
            var randomQtd = Math.floor((Math.random() * (max - min)) + min);
            newAsteroide(randomQtd);
        }

        // Texto no canvas
        context.textAlign = "middle";
        canvas.textBaseline = "top";
        context.font = "20px Arial";
        context.fillStyle = "steelblue";
        textCurrentLevel = "Level " + currentLevel + " - Pontuação: " + pontos + " ( Timer: " + seconds + " )";
        textGameStatus = "";
        textPontosObtidos = "Pontos obtidos: " + pontos;
        context.fillText(textCurrentLevel, (max_x - 250) / 2, 20)

        setPontos();
        desenharNave(x_nave, y_nave);
        detectarColisao();
        //GameOver
        if (collisionDetected == true) {
            objEndGame.value = "END GAME";
            context.textAlign = "middle";
            canvas.textBaseline = "bottom";
            context.font = "36px Arial";
            context.fillStyle = "red";
            textCurrentLevel = "GAME OVER"
            context.fillText(textCurrentLevel, (max_x - 180) / 2, (max_y - 100) / 2)
            context.fillStyle = "orange";
            textGameStatus = "You Lose!"
            context.fillText(textGameStatus, (max_x - 120) / 2, (max_y / 2));
            context.fillStyle = "#31afb4";
            context.fillText(textPontosObtidos, (max_x - 240) / 2, (max_y / 2) + 50);
            clearTimeout();
        } else if (currentLevel >= limitLevels) { //Ganador alcanzo o nivel maximo do game
            objEndGame.value = "WINNER!!";
            context.textAlign = "middle";
            canvas.textBaseline = "bottom";
            context.font = "36px Arial";
            context.fillStyle = "green";
            textCurrentLevel = "GAME OVER!!"
            context.fillText(textCurrentLevel, (max_x - 180) / 2, (max_y - 100) / 2)
            context.fillStyle = "orange";
            textGameStatus = "You Win!"
            context.fillText(textGameStatus, (max_x - 120) / 2, (max_y / 2));
            context.fillStyle = "#31afb4";
            context.fillText(textPontosObtidos, (max_x - 240) / 2, (max_y / 2) + 50);
            clearTimeout();
        } else {
            objEndGame.value = "PLAYING";
            requestAnimationFrame(gameLoop);
            setTimer();
        }

    }

    function desenharNave(pX, pY) {
        console.log(`desenharNave ${pX} - ${pY}`);
        // context.clearRect(0, 0, 800, 400);
        // context.fillStyle = 'cyan';
        // context.fillRect(pX, pY, 100, 100);
        context.drawImage(imagemNave, pX, pY, altura_nave, largura_nave);
    }


    function desenharAsteroide(contAst, arr_x_ast, arr_y_ast, largura_ast, altura_ast) {

        //Tem que disenhar todos os asteroides
        for (var i = 0; i <= contAst; i++) {
            if (arr_y_ast[i] <= max_y) {
                console.log(`desenharAsteroide: X: ${arr_x_ast[i]} Y: ${arr_y_ast[i]}`)
                context.drawImage(imagemAsteroide, arr_x_ast[i], arr_y_ast[i], largura_ast, altura_ast);
                arr_y_ast[i] = arr_y_ast[i] + paso_asteroide;
            }

        }


    }

    function newAsteroide(q = 1) {
        // numero de novos asteroides
        console.log(`mais ${q} asteroides`)
        for (var i = 0; i <= q; i++) {
            console.log(`Criando o asteroide # ${contAst}`)
            array_x_ast[contAst] = Math.floor((Math.random() * (max_x - min_x)) + min_x);
            array_y_ast[contAst] = 0;
            contAst++;

        }

    }

    //Precisa verificar colisao da nave com todos os asteroides
    function detectarColisao() {
        console.log("detectarColisao");
        for (j = 0; j <= contAst; j++) {
            if ((distancia(x_nave, array_x_ast[j]) < largura_nave) && (distancia(y_nave, array_y_ast[j]) < altura_nave)) {
                console.log("colisão");

                context.drawImage(imageCollision, x_nave, y_nave, altura_nave, largura_nave);
                collisionDetected = true;

            } else {
                console.log("nave still alive!!");
            }
        }

    }

    //Calcula la distancia etre 2 pontos
    function distancia(pA, pB) {
        console.log("distancia")
        pontoA = Math.abs(pA);
        pontoB = Math.abs(pB);
        return Math.abs(pontoA - pontoB)

    }

    function setTimer() {
        console.log("setTimer")
        milliSeconds++;
        if (milliSeconds % 50 == 0) {
            console.log(`Milliseconds`)
        }

        seconds = (milliSeconds / 100).toFixed(2);
        if (seconds >= limitTimeForLevel) {
            setNextLevel();
            milliSeconds = 0;
            seconds = 0;
        }
        objTimer.value = Math.round(seconds, 10);
    }

    function setNextLevel() {
        console.log("setNextLevel")
        currentLevel++;
        objLevel.value = currentLevel;
        //if nivel multiplo de 5, aumenta a velocidade dos asteroides
        if (currentLevel % 5 == 0) {

            paso_asteroide++;
        }

    }
    //Cada asteroide esquivado equivale a 1 ponto
    function setPontos() {
        pontos = contAst + 1;
        objPontos.value = pontos;
    }
}