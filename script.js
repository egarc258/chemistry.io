document.addEventListener("DOMContentLoaded", () => {
    const gameMenu = document.getElementById("game-menu");
    const startGameBtn = document.getElementById("start-game-btn");
    const canvas = document.getElementById("view");

    // Start the game when the "Start Game" button is clicked
    startGameBtn.addEventListener("click", () => {
        gameMenu.style.display = "none";   // Hide the game menu
        canvas.style.display = "block";    // Show the game canvas
        setup();  // Initialize the game
    });
});

const ElectronStates = {
    ALIVE: 1,
    DEAD: 2
}

class Player {
    constructor (x,y,renderer){
        this.particles = [];
        this.attackelectrons = [];//The electrons shjould be stored in order such that the next electron is clockwise from the previous one in the list. This will be beneficial to determining the nearest electron when trying to attack.
        this.valenceelectrons = []
        this.attElecStates = []
        //Damage to particles should permeate by assigning a damage value to the hit particle. When the particle is hit again that particle transfers its damage value to all neighboring particles and updates its damage value higher. this continues until the damage permeates to the center where the player is at risk of instability
        //Create a second smaller electron ring which's main purpose is bonding [maximum of 8 electrons]
        this.x = x;
        this.y = y;
        this.electronRotation = 0;
        this.renderer = renderer
        this.ammunition = 0
        this.size = 0
        this.numParticles = 2
        this.maxAmmunition = this.numParticles
    }

    fireToward(x,y){
        if (this.ammunition < 1) return
        var e = new Electron( 
            -Math.sign(this.x-x) * this.size * Math.abs(Math.cos(this.angleTo(x,y))) + this.x,
            -Math.sign(this.y-y) * this.size * Math.abs(Math.sin(this.angleTo(x,y))) + this.y,
            -Math.sign(this.x-x) * 20 * Math.abs(Math.cos(this.angleTo(x,y))),
            -Math.sign(this.y-y) * 20 * Math.abs(Math.sin(this.angleTo(x,y))),
            ParticleStates.ALIVE
        )
        this.renderer.electrons.push(e)
        this.ammunition -= 1
    }

    angleTo(x,y){
        var diffx = this.x - x
        var diffy = this.y - y
        return Math.atan(diffy/diffx)
    }

    move(dx,dy){
        this.x += dx
        this.y += dy

        //Check For Collisions
        for (var i = 0; i < this.renderer.deadProtons.length; i++){
            var p = this.renderer.deadProtons[i]
            if ( this.distTo(p.relx,p.rely) < this.size ){
                this.renderer.deadProtons.splice(i,1)
                this.numParticles++
                this.maxAmmunition = this.numParticles
                break;
            }
        } 
        if (this.ammunition >= this.maxAmmunition) return
        for (var i = 0; i < this.renderer.deadElectrons.length; i++){
            var e = this.renderer.deadElectrons[i]
            if ( this.distTo(e.x,e.y) < this.size ){
                this.renderer.deadElectrons.splice(i,1)
                this.ammunition++
                break;
            }
        } 

    }

    distTo(x,y){
        var dx = this.x - x
        var dy = this.y - y
        return Math.sqrt(dx * dx + dy * dy)
    }

    draw( ctx ){

        //Particles
        var p = this.numParticles
        ctx.translate(this.x,this.y)
        ctx.rotate(this.angleTo(mouseX,mouseY))

        var n = 0;
        var s = 6;
        var l = 0;
        var d = 0;
        
        while (n < p){
            n++;
            if (n == 1){
                ctx.fillStyle = "pink"
                Drawing.drawCircle(ctx,0,0,25)
                ctx.fillStyle = "darkred";
                Drawing.drawCircle(ctx,0,0,16)
                //ctx.stroke()
                d = 0;
                continue;
            }
            else if (n <= 7){
                ctx.rotate(2 * Math.PI / 6);
                ctx.fillStyle = "pink"
                Drawing.drawCircle(ctx,45,0,25)
                ctx.fillStyle = Math.floor( 2 * Math.random()) ? "#f36c5a" : "#ef947e";
                Drawing.drawCircle(ctx,45,0,16)
                //ctx.stroke()
                d = 50;
            }
            else{
                if (l <= 0 ){ 
                    s += 5; 
                    l = s; 
                    d = (100) / (4*Math.cos(Math.PI/2 - Math.PI/s))
                    ctx.rotate(50 * Math.PI / 180);
                    //d = 0.9 * d
                }
                ctx.rotate(2 * Math.PI / s);
                ctx.fillStyle = "pink"
                Drawing.drawCircle(ctx,d,0,25)
                ctx.fillStyle = Math.floor( 2 * Math.random()) ? "#f36c5a" : "#ef947e";
                Drawing.drawCircle(ctx,d,0,16)
                //ctx.stroke()
                l--;
            }
        }
        this.size = d + 150

        ctx.translate(-this.x,-this.y)
        ctx.setTransform()


        
        //Valence
        ctx.translate(this.x,this.y)
        ctx.rotate(-0.5 * this.electronRotation * Math.PI / 180);
        ctx.strokeStyle = "lightblue";
        ctx.lineWidth = 3;
        ctx.setLineDash([25,25])
        ctx.beginPath();
        ctx.arc(0, 0, d + 60, 0, 2 * Math.PI);
        ctx.stroke()
        ctx.rotate(0.5 * this.electronRotation * Math.PI / 180);
        ctx.translate(-this.x,-this.y)

        
        ctx.translate(this.x,this.y)
        ctx.rotate(this.electronRotation * Math.PI / 180);
        var e = p;
        var rot = this.electronRotation * Math.PI / 180;
        for (var i = 0; i < e; i++){
            ctx.fillStyle = i >= this.ammunition ? "gray" : "mediumaquamarine";
            ctx.rotate(2 * Math.PI / e);
            rot += 2 * Math.PI / e;
            Drawing.drawCircle(ctx,d + 100 + 10 * Math.cos(30 * rot),0,5)
        }
        ctx.rotate(-this.electronRotation * Math.PI / 180);
        ctx.translate(-this.x,-this.y)
        this.electronRotation += 20/e
    }

    get electronCount(){
        return this.electrons.length
    }
}
class Proton {
    //Null parent indicates world space parent
    constructor(relx,rely,parent,state){
        this.relx = relx 
        this.rely = rely
        this.parent = parent
        this.state = state
    }

    draw(ctx){
        if (this.state == ParticleStates.ALIVE){

        }
        else{
            ctx.setTransform()
            ctx.fillStyle = "#f74949";
            Drawing.drawCircle(ctx,this.relx,this.rely,30)
            
            ctx.fillStyle = "white";

            ctx.beginPath()
            ctx.rect(this.relx-8,this.rely-2,16,4)
            ctx.fill()

            ctx.beginPath()
            ctx.rect(this.relx-2,this.rely-8,4,16)
            ctx.fill()

        }
    }
}
class Neutron {
    constructor(relx,rely,parent,state){
        this.relx = relx 
        this.rely = rely
        this.parent = parent
        this.state = state
    }

    draw(ctx){
        if (this.state == ParticleStates.ALIVE){

        }
        else{
            ctx.setTransform()
            ctx.fillStyle = "darkslategrey";
            Drawing.drawCircle(ctx,this.relx,this.rely,22)

            ctx.strokeStyle = "white";
            ctx.lineWidth = 3
            ctx.setLineDash([])

            ctx.beginPath();
            ctx.arc(this.relx, this.rely, 6, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
}
class Electron {
    constructor (x,y,velx,vely,state){
        this.x = x
        this.y = y
        this.velx = velx
        this.vely = vely
        this.state = state
    }

    draw(ctx){

        if (this.state == ParticleStates.ALIVE){
            var magnitude = 10

            ctx.setTransform()
            ctx.fillStyle = "mediumaquamarine";

            ctx.translate(this.x,this.y)
            ctx.rotate(2 * Math.PI * Math.random())
            Drawing.drawCircle(ctx,magnitude * Math.random(),0,5)
            ctx.setTransform()
        }
        else{
            ctx.setTransform()
            ctx.fillStyle = "black";
            Drawing.drawCircle(ctx,this.x,this.y,8)
            
            ctx.fillStyle = "white";
            ctx.beginPath()
            ctx.rect(this.x-4,this.y-2,8,4)
            ctx.fill()

        }
    }

    get velocity(){return Math.sqrt(this.velx * this.velx + this.vely * this.vely)}
    
}
class Particle {}


class Point2D {
    constructor (x = 0,y = 0){
        this.x = x;
        this.y = y;
    }
}

class View {
 
}



class Drawing {
    
    static drawCircle(ctx,x,y,radius){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }



}


var player;
var context;
var center;
var mouseX;
var mouseY;
var cameraPos;
var renderer;

class ParticleRenderer{
    constructor(){
        this.electrons = []
        this.deadElectrons = [] 
        this.deadProtons = []
        this.deadNeutrons = []
    }

    drawElectrons(ctx){
        for (var i = 0; i < this.electrons.length; i++){
            this.electrons[i].draw(ctx)
        }
    }

    updateElectrons(){
        for (var i = 0; i < this.electrons.length; i++){
            if (this.electrons[i].velx) { this.electrons[i].x += this.electrons[i].velx }
            if (this.electrons[i].vely) { this.electrons[i].y += this.electrons[i].vely }
        }
    }

    drawDeadElectrons(ctx){
        for (var i = 0; i < this.deadElectrons.length; i++){
            this.deadElectrons[i].draw(ctx)
        }
    }

    drawDeadProtons(ctx){
        for (var i = 0; i < this.deadProtons.length; i++){
            this.deadProtons[i].draw(ctx)
        }
    }

    drawDeadNeutrons(ctx){
        for (var i = 0; i < this.deadNeutrons.length; i++){
            this.deadNeutrons[i].draw(ctx)
        }
    }
}

function setup() {
    // Set up game canvas and initialize player
    var canvas = document.getElementById("view");
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;

    renderer = new ParticleRenderer();
    context = canvas.getContext("2d");
    center = new Point2D(canvas.width / 2, canvas.height / 2);
    cameraPos = new Point2D(center.x, center.y);
    player = new Player(center.x, center.y, renderer);

    setInterval(loop, 10)
    setInterval(() => summonFood(renderer), 1000)
}

function summonFood(ren){
    

    var x = center.x * 2 * Math.random()
    var y = center.y * 2 * Math.random()

    if (player.distTo(x,y) < 400) return

    var type = Math.random()
    //Electron
    if (type < 0.8){
        if (ren.deadElectrons.length > 30) return
        ren.deadElectrons.push( new Electron(
            x,//TODO: Change Later
            y,
            0, 0,
            ParticleStates.DEAD
        ))
    }
    //Proton
    else if (type < 0.9){
        console.log("Proton")
        if (ren.deadProtons.length > 10) return
        ren.deadProtons.push( new Proton(
            x,//TODO: Change Later
            y,
            null,
            ParticleStates.DEAD
        ))
    }
    //Neutron
    else{
        if (ren.deadNeutrons.length > 10) return
        ren.deadNeutrons.push( new Neutron(
            x,//TODO: Change Later
            y,
            null,
            ParticleStates.DEAD
        ))
    }

}

function loop(){
    context.fillStyle = "whitesmoke"
    context.beginPath()
    context.rect(0,0,center.x * 2,center.y * 2)
    context.fill()

    renderer.drawDeadElectrons(context)
    renderer.drawDeadProtons(context)
    renderer.drawDeadNeutrons(context)

    player.draw(context);
    renderer.drawElectrons(context)
    renderer.updateElectrons()

}




addEventListener("mousemove", (event) => {
    mouseX = event.mouseX
    mouseY = event.mouseY
});

info = {
    1: {
        defense: 1,
        attack: 2,
        speed : 3,
        elecronegativity: 4,
        color: "#dwkan"
    }
}

document.getElementById("view").addEventListener("mousedown", (event) => {
    player.fireToward(event.clientX, event.clientY)
});

addEventListener("keydown", (event) => {
    speed = 20
    switch ( event.key ){
        case "w": player.move(0, -speed); break;
        case "s": player.move(0, speed); break;
        case "a": player.move(-speed, 0); break;
        case "d": player.move(speed, 0); break;
    }
});

window.onload = setup



class Server{
    constructor(){

    }
}