var cvs = document.getElementById("mycanvas")
var ctx = cvs.getContext("2d");
var DEGREE = Math.PI / 180
var frames = 0 ;

var sprite = new Image();
sprite.src = "img/59894.png"

var SCORE= new  Audio();
SCORE.src = "audio/point.mp3";
var FLAP= new  Audio();
FLAP.src = "audio/flap (1).mp3";
var HIT= new  Audio();
HIT.src = "audio/flappy-bird-hit-sound.mp3";
var DIE= new  Audio();
DIE.src = "audio/die.mp3";
var START= new  Audio();
START.src = "audio/swoosh.mp3";

var state = {
    current :0,
    getReady: 0 ,
    game:1 , 
    over: 2 
}
 
function clickHandeler(){
    switch (state.current) {
        case state.getReady:
            START.play();
            state.current = state.game;
            break;
        case state.game:
            FLAP.play() ;
            bird.flap();
            break;
        default:
            bird.rotation = 0;
            bird.speed = 0; 
            pipes.position = []; 
            pipes._timeSinceLastPipe = 0;
            score.value = 0 ;
            state.current = state.getReady;
            break;
    }
}
document.addEventListener("click" , clickHandeler)
document.addEventListener("keydown" , function(e){
    if (e.which==32) {
        clickHandeler();
        e.preventDefault();
    }
})

var bg= {
    sX : 146.5 , sY : 0 , w:143 , h: 255,
    X : 0,
    Y : cvs.clientHeight - 510 ,
    draw:function() {
        ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h )
        ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X + 2*this.w , this.Y ,2*this.w ,2*this.h )
    }
}

var fg= {
    sX : 292.5 , sY : 0 , w:167 , h: 55,
    X : 0,
    dx :2 ,
    Y : cvs.clientHeight - 110 ,
    draw:function() {
        ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h )
        ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X + 2*this.w , this.Y ,2*this.w ,2*this.h )
    }, 
    update : function(delta){
        if(state.current == state.game){
            this.X = (this.X - this.dx * (delta * 60)) % (this.w / 2);
        }
    }
}

var pipes = {
    top  : { sX :56, sY:321 },
    bottom : { sX : 82, sY:321 }, 
    w : 25 ,
    h:  162 ,
    dx :2.5,
    gap: 250,
    position : [],
    maxYPos : -150,
    _timeSinceLastPipe:0,  // زمان سپری شده از آخرین لوله

    draw: function(){
        for(let i=0 ; i< this.position.length;i++){
            let p =this.position[i]
            let topYPos = p.Y ;
            let bottomYPos= p.Y + this.h +this.gap ;
            ctx.drawImage(sprite,this.top.sX , this.top.sY , this.w , this.h, p.X, topYPos ,2*this.w ,2*this.h )
            ctx.drawImage(sprite,this.bottom.sX , this.bottom.sY , this.w , this.h, p.X, bottomYPos ,2*this.w ,2*this.h )
         }
    },
    update: function(delta){
        if(state.current != state.game) return;

        this._timeSinceLastPipe += delta;
        let spawnInterval = 1.5; // ثانیه بین لوله‌ها
        if(this._timeSinceLastPipe > spawnInterval){
            this.position.push({
                X:cvs.clientWidth,
                Y: this.maxYPos + Math.random() * 100,
            });
            this._timeSinceLastPipe = 0;
        }

        for(let i=0 ; i< this.position.length;i++){
            let p =this.position[i]
            p.X -= this.dx * (delta * 60);

            let bottomPipesPos = p.Y +this.h +this.gap ;
    
            // برخورد با لوله بالا
            if(bird.X + bird.radius > p.X && 
               bird.X - bird.radius < p.X + 2*this.w && 
               bird.Y + bird.radius > p.Y && 
               bird.Y - bird.radius < p.Y + 2*this.h){
                HIT.play();
                state.current = state.over;
            }
            
            // برخورد با لوله پایین
            if(bird.X + bird.radius > p.X &&bird.X - bird.radius < p.X + 2*this.w && 
                bird.Y + bird.radius > bottomPipesPos && 
                bird.Y - bird.radius < bottomPipesPos + 2*this.h){
                    HIT.play();
                 state.current = state.over;
             }
             
            // حذف لوله‌های خارج از صفحه
            if(p.X + 2*this.w < 0){
                this.position.shift();
                score.value += 1 ;
                SCORE.play();
                score.best = Math.max(score.value ,score.best  )
                localStorage.setItem("best", score.best)
            }
        }
    }
}

var getready= { sX : 294, sY : 57 , w:94 , h: 27, X : cvs.clientWidth/2-83, Y : cvs.clientHeight/2-170,
    draw:function() { if (state.current == state.getReady) ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h ) }
}
var gameover= { sX : 394, sY : 58 , w:97 , h: 22, X : cvs.clientWidth/2-83, Y : cvs.clientHeight/2-170,
    draw:function() { if (state.current == state.over) ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h ) }
}
var getready1= { sX : 291, sY : 90 , w:59 , h: 50, X : cvs.clientWidth/2-59, Y : cvs.clientHeight/2-96,
    draw:function() { if (state.current == state.getReady) ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h ) }
}
var gameover1= { sX : 2, sY : 258 , w:115 , h: 58, X : cvs.clientWidth/2-105, Y : cvs.clientHeight/2-96,
    draw:function() { if (state.current == state.over) ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h ) }
}
var gameover2= { sX : 352, sY : 117 , w:55 , h: 30, X : cvs.clientWidth/2-50, Y : cvs.clientHeight/2 +35,
    draw:function() { if (state.current == state.over) ctx.drawImage(sprite,this.sX , this.sY , this.w , this.h, this.X , this.Y ,2*this.w ,2*this.h ) }
}

var bird= {
    animation : [
     {sX :3  , sY :491  } ,
     {sX : 30 , sY :491  } , 
     {sX : 58 , sY :491  } , 
     {sX : 30 , sY :491  } 
    ] , 
     w:18 , h: 12, X : 50, Y : 150 ,
     speed: 0, gravity: 0.19,
     animationIndex: 0, rotation: 0 , jump : 3.8, radius: 12,
     draw:function() {
        let bird = this.animation[this.animationIndex]
        ctx.save()
        ctx.translate(this.X , this.Y);
        ctx.rotate(this.rotation); 
         ctx.drawImage(sprite,bird.sX , bird.sY , this.w , this.h,  - this.w / 2 ,  - this.h /2 ,2*this.w ,2*this.h )
         ctx.restore();
     }, 
     update : function(delta){
        // انیمیشن بال‌زدن
        this._time = (this._time || 0) + delta;
        let period = state.current == state.getReady ? 0.33 : 0.16; 
        if(this._time > period){
            this.animationIndex = (this.animationIndex + 1) % this.animation.length;
            this._time = 0;
        }

        if(state.current == state.getReady){
            this.Y =150;
        }
        else {
            this.speed += this.gravity * (delta * 60); 
            this.Y += this.speed * (delta * 60);

            if (this.speed < this.jump){ 
                this.rotation = -25 * DEGREE
            }else{
                this.rotation = 90 * DEGREE;
            }

            // برخورد با سقف
            if(this.Y - this.h/2 <= 0){
                this.Y = this.h/2;
                this.speed = 0;
                DIE.play();
                state.current = state.over;
            }
        }

        // برخورد با زمین
        if(this.Y + this.h /2>= cvs.clientHeight - fg.h *2 ){
            this.Y = cvs.clientHeight - fg.h *2 - this.h/2 
            this.animationIndex = 1;
            if (state.current == state.game){
                DIE.play();
                state.current = state.over
            }
        }
     },
     flap : function(){ this.speed = -this.jump }
}
var score = {
    best : parseInt(localStorage.getItem("best")) || 0,
    value:0 , 
    draw : function(){
        ctx.fillStyle ="#fff"
        ctx.strokeStyle = "#000"
       if(state.current==state.game){
        ctx.lineWidth = 2;
        ctx.font = "35px IMPACT";
        ctx.fillText(this.value , cvs.width/2 , 50)
        ctx.strokeText(this.value , cvs.width/2 , 50)
       }else if(state.current==state.over){
        ctx.lineWidth = 2;
        ctx.font = "28px IMPACT";
        ctx.fillText(this.value ,230, 200)
        ctx.strokeText(this.value , 230 , 200)
        ctx.fillText(this.best , 230,248)
        ctx.strokeText(this.best ,230  , 248)
       }  
    }
}

function update(delta){
    bird.update(delta);
    fg.update(delta);
    pipes.update(delta);
}

function draw(){
    ctx.fillStyle = "#70c5ce"
    ctx.fillRect(0,0,cvs.clientWidth,cvs.clientHeight)
    bg.draw()
    pipes.draw()  
    fg.draw()
    bird.draw()
    getready.draw()
    getready1.draw()
    gameover.draw()
    gameover1.draw()
    gameover2.draw()
    score.draw()
}

let lastTime = performance.now();
function animate(currentTime){
    const delta = (currentTime - lastTime) / 1000; 
    lastTime = currentTime;

    update(delta);
    draw();

    frames++;
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);