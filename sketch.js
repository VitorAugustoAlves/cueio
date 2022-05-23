const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;

var corda;
var fruta, frutaimg;
var ligacao;
var fundo;
var coelho, coelhoimg;
var botao;
var piscando, comendo, triste, comendos, tristes;
var mute, balao, balaos;
var musica;

function preload() {
  frutaimg = loadImage("midias/melon.png");
  fundo = loadImage("midias/background.png");
  coelhoimg = loadImage("midias/Rabbit-01.png");
  piscando = loadAnimation(
    "midias/blink_1.png",
    "midias/blink_2.png",
    "midias/blink_3.png"
  );
  comendo = loadAnimation(
    "midias/eat_0.png",
    "midias/eat_1.png",
    "midias/eat_2.png",
    "midias/eat_3.png",
    "midias/eat_4.png"
  );
  triste = loadAnimation(
    "midias/sad_1.png",
    "midias/sad_2.png",
    "midias/sad_3.png"
  );

  piscando.playing = true;
  comendo.playing = true;
  triste.playing = true;

  comendo.looping = false;
  triste.looping = false;

  musica = loadSound("midias/sound1.mp3");
  balaos = loadSound("midias/air.wav");
  comendos = loadSound("midias/eating_sound.mp3");
  tristes = loadSound("midias/sad.wav")
}
function setup() {
  createCanvas(500, 700);
  frameRate(80);
  musica.play();
  musica.setVolume(1);
  engine = Engine.create();
  world = engine.world;
  ground = new Ground(200, 680, 600, 20);
  fruta = Bodies.circle(250, 100, 25);
  corda = new Rope(7, { x: 250, y: 25 });
  Composite.add(corda.body, fruta);
  ligacao = new Link(corda, fruta);
  piscando.frameDelay = 20;
  comendo.frameDelay = 20;
  coelho = createSprite(450, 625);
  coelho.addAnimation("piscando", piscando);
  coelho.addAnimation("comendo", comendo);
  coelho.addAnimation("triste", triste);

  coelho.scale = 0.2;
  botao = createImg("midias/cut_btn.png");
  botao.position(220, 12.5);
  botao.size(50, 50);
  botao.mouseClicked(deletar);
  mute = createImg("midias/mute.png");
  mute.position(450, 20);
  mute.size(50, 50);
  mute.mouseClicked(mutar);
  balao = createImg("midias/balloon.png");
  balao.position(10, 275);
  balao.size(150, 100);
  balao.mouseClicked(assoprar);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() {
  background(51);
  image(fundo, 0, 0, displayWidth, displayHeight);
  ground.show();
  push();
  imageMode(CENTER);
  if (fruta !== null) {
    image(frutaimg, fruta.position.x, fruta.position.y, 70, 70);
  }
  pop();
  Engine.update(engine);

  //ellipse(fruta.position.x, fruta.position.y, 25);
  corda.show();
  drawSprites();
  if (collide(fruta, coelho) == true) {
    coelho.changeAnimation("comendo");
    comendos.play();
    
  }
  if (fruta !== null && fruta.position.y >= 650) {
    coelho.changeAnimation("triste");
    fruta = null;
    musica.stop();
    tristes.play();
  }
}
function deletar() {
  corda.break();
  ligacao.dettach();
  ligacao = null;
}
function collide(body, sprite) {
  if (body !== null) {
    var colisao = dist(
      body.position.x,
      body.position.y,
      sprite.position.x,
      sprite.position.y
    );
    if (colisao <= 80) {
      World.remove(world, fruta);
      fruta = null;
      return true;
    } else {
      return false;
    }
  }
}

function mutar() {
  if (musica.isPlaying()) {
    musica.stop();
  } else {
    musica.play();
    musica.setVolume(1);
  }
}
function assoprar() {
Body.applyForce(fruta, {x:0, y:0},{x:0.05, y:0});
}
