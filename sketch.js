var trex, trex_correndo, trex_colidiu;
var solo, soloImg, soloInvisivel;
var nuvem, nuvemImg, grupoNuvens;
var cacto, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6, grupoCactos;
var pontos = 0;
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var gameOverImg, reiniciarImg, gameOver, reiniciar;
var somPulo, somMorte, somPontos;
var fonte;
var recorde = 0;

function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_colidiu = loadAnimation("trex_colidiu.png");

  soloImg = loadImage("solo2.png");
  nuvemImg = loadImage("nuvem.png");

  fonte = loadFont("fonte.ttf");

  // carregar imagens dos obstaculos
  cacto1 = loadImage("obstaculo1.png");
  cacto2 = loadImage("obstaculo2.png");
  cacto3 = loadImage("obstaculo3.png");
  cacto4 = loadImage("obstaculo4.png");
  cacto5 = loadImage("obstaculo5.png");
  cacto6 = loadImage("obstaculo6.png");

  gameOverImg = loadImage("fimDoJogo.png");
  reiniciarImg = loadImage("reiniciar.png");

  //carregar sons
  somPulo = loadSound("pulo.mp3");
  somMorte = loadSound("morte.mp3");
  somPontos = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //estava 600 x 200

  //cria trex
  trex = createSprite(60, windowHeight-100, 20, 50);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("colidiu", trex_colidiu);
  trex.scale = 0.8;
  trex.debug = false;
  trex.setCollider("circle", 5, 0, 43);
  //colisor para a IA
  // trex.setCollider("rectangle",100,0);

  solo = createSprite(windowWidth/2, windowHeight-80, 1200, 5);
  solo.addImage(soloImg);

  soloInvisivel = createSprite(300, windowHeight-60, 1200, 5);
  soloInvisivel.visible = false;

  grupoNuvens = new Group();
  grupoCactos = new Group();

  gameOver = createSprite(windowWidth/2, windowHeight/2-windowHeight/8);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  reiniciar = createSprite(windowWidth/2, windowHeight/2);
  reiniciar.addImage(reiniciarImg);
  reiniciar.scale = 0.8;
  reiniciar.visible = false;
}

function draw() {
  background("white");
  textSize(20);
  textFont(fonte);
  text("HI " + recorde, windowWidth/2+50, 30);
  fill(100);
  text("Pontos: " + pontos, 30, 30);

  trex.collide(soloInvisivel);

  drawSprites();

  console.log(trex.y)
  console.log("windowHeight: "+ windowHeight)

  //comportamentos que só ocorrem no estado de jogo JOGAR
  if (estadoJogo === JOGAR) {

    //aumentar pontos
    pontos = Math.round(pontos + frameRate()/60);
    //tocar som a cada 100 pontos
    if(pontos>0 && pontos%100 === 0){
      somPontos.play();
    }

    //pulo
    if (keyDown("space") && trex.y > windowHeight-100) {
      trex.velocityY = -25;
      somPulo.play();
    }

    //gravidade
    trex.velocityY = trex.velocityY + 1.3;

    //mudando a velocidade do solo de acordo com a pontuação
    solo.velocityX = -(5+ pontos*3/100);
    //tornando o solo infinito
    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }

    //gerando nuvens e cactos
    gerarNuvens();
    gerarCactos();

    //momento em que o jogo acaba
    if (grupoCactos.isTouching(trex)) {
      estadoJogo = ENCERRAR;
      somMorte.play();

      //descomentar para trex IA
      // trex.velocityY = -17;
      // somPulo.play();
    }

    //comportamentos que só ocorrem no estado de jogo ENCERRAR
  } else if (estadoJogo === ENCERRAR) {

    //parar o solo
    solo.velocityX = 0;

    //parar as nuvens e obstáculos
    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    //torna as nuvens e os cactos infinitos
    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);

    //muda a animação do trex
    trex.changeAnimation("colidiu", trex_colidiu);

    //impede que o trex voe ao encerrar o jogo
    trex.velocityY = 0;

    //tornar imagens de fim de jogo visíveis
    gameOver.visible = true;
    reiniciar.visible = true;

    if (mousePressedOver(reiniciar)){
      console.log("reiniciar");
      reinicie();
     }
  }
}

//definição da função de gerar nuvens
function gerarNuvens() {

  if (frameCount % 60 === 0) {
    nuvem = createSprite(windowWidth+50, 100, 40, 10);
    nuvem.y = Math.round(random(40, windowHeight/2+windowHeight/10));
    nuvem.addImage(nuvemImg);
    nuvem.scale = 0.9;
    nuvem.velocityX = -3;
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nuvem.lifetime = 220;
    grupoNuvens.add(nuvem);
  }
}

function gerarCactos() {
  //criar sprite de obstáculo a cada 60 quadros
  if (frameCount % 50 === 0) {
    cacto = createSprite(windowWidth+50, windowHeight-100, 10, 40);
    cacto.velocityX = -(6+ pontos*3/100);

    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        cacto.addImage(cacto1);
        break;
      case 2:
        cacto.addImage(cacto2);
        break;
      case 3:
        cacto.addImage(cacto3);
        break;
      case 4:
        cacto.addImage(cacto4);
        break;
      case 5:
        cacto.addImage(cacto5);
        break;
      case 6:
        cacto.addImage(cacto6);
        break;
      default:
        break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    cacto.scale = 0.7;
    cacto.lifetime = 110;

    reiniciar.depth = cacto.depth+1;
    gameOver.depth = cacto.depth+1;
    grupoCactos.add(cacto);
  }
}

function reinicie(){
  estadoJogo = JOGAR;

  reiniciar.visible = false;
  gameOver.visible = false;

  grupoNuvens.destroyEach();
  grupoCactos.destroyEach();

  trex.changeAnimation("correndo", trex_correndo);

  if(pontos>recorde){
    recorde = pontos;
  }
  pontos = 0;
}
