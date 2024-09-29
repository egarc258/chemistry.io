
//---------------------------------Globals--------------------------------//


var player;
var context;
var center;
var mouseX;
var mouseY;
var renderer;
var enemies = [];
var scale = 0.5;
var speed = 10;
var keyStates = {
    w: 0,
    s: 0,
    a: 0,
    d: 0,
}
var socket;




//---------------------------------Constants--------------------------------//



//Ultimately Unused
const AtomTypes = {
    NONMETAL: 1,
    NOBLEGAS: 2,
    ALKALIMETAL: 3,
    ALKALINEEARTHMETAL: 4,
    METALLOID: 5,
    HALOGEN: 6,
    POSTTRANSITIONMETAL: 7
}

const statistics = {
    1: {
        name : "Hydrogen",
        type : AtomTypes.NONMETAL, 
        speed: 30,
        defense : 20, 
        attack : 50, 
        electronegativity : 2.20, 
        color: "#f74949",
    }, 
    2: {
        name : "Helium",
        type : AtomTypes.NOBLEGAS, 
        speed: 30,
        defense : 90, 
        attack : 50, 
        electronegativity : 0.0, 
        color: "#FFD700",
    }, 
    3: {
        name : "Lithium",
        type : AtomTypes.ALKALIMETAL, 
        speed: 30,
        defense : 30, 
        attack : 90, 
        electronegativity : 0.98, 
        color: "#C0C0C0",
    }, 
    4: {
        name : "Beryllium",
        type : AtomTypes.ALKALINEEARTHMETAL, 
        speed: 28,
        defense : 50, 
        attack : 50, 
        electronegativity : 1.57, 
        color: "#D9E4E6",
    }, 
    5: {
        name : "Boron",
        type : AtomTypes.METALLOID, 
        speed: 27,
        defense : 60, 
        attack : 50, 
        electronegativity : 2.04, 
        color: "#FFB300",
    },
    6: {
        name : "Carbon",
        type : AtomTypes.NONMETAL, 
        speed: 28,
        defense : 60, 
        attack : 50, 
        electronegativity : 2.55, 
        color: "#4C4C4C",
    },
    7: {
        name : "Nitrogen",
        type : AtomTypes.NONMETAL, 
        speed: 25,
        defense : 60, 
        attack : 50, 
        electronegativity : 3.04, 
        color: "#4682B4",
    }, 
    8: {
        name : "Oxygen",
        type : AtomTypes.NONMETAL, 
        speed: 20,
        defense : 60, 
        attack : 50, 
        electronegativity : 3.44, 
        color: "#ADD8E6",
    }, 
    9: {
        name : "Fluorine",
        type : AtomTypes.HALOGEN, 
        speed: 18,
        defense : 50, 
        attack : 90, 
        electronegativity : 3.98, 
        color: "#00FFFF",
    }, 
    10 : {
        name : "Neon",
        type : AtomTypes.NOBLEGAS, 
        speed: 25,
        defense : 90, 
        attack : 50, 
        electronegativity : 0.0, 
        color: "#FF4500",
    }, 
    11 : {
        name : "Sodium",
        type : AtomTypes.ALKALIMETAL, 
        speed: 10,
        defense : 30, 
        attack : 90, 
        electronegativity : 3.98, 
        color: "#DAA520",
    },
    12 : {
        name : "Magnesium",
        type : AtomTypes.ALKALINEEARTHMETAL, 
        speed: 20,
        defense : 50, 
        attack : 50, 
        electronegativity : 1.31, 
        color: "#B0E0E6",
    }, 
    13 : {
        name : "Aluminium",
        type : AtomTypes.POSTTRANSITIONMETAL, 
        speed: 18,
        defense : 60, 
        attack : 50, 
        electronegativity : 1.61, 
        color: "#C0C0C0",
    }, 
    14 : {
        name : "Silicon",
        type : AtomTypes.METALLOID, 
        speed: 20,
        defense : 60, 
        attack : 50, 
        electronegativity : 1.90, 
        color: "#F4A460", 
    }, 
    15 : {
        name : "Phosphorus",
        type : AtomTypes.NONMETAL, 
        speed: 15,
        defense : 60, 
        attack : 40, 
        electronegativity : 2.19, 
        color: "#FFFFE0",
    }, 
    16 : {
        name : "Sulfur",
        type : AtomTypes.NONMETAL, 
        speed: 12,
        defense : 40, 
        attack : 70, 
        electronegativity : 2.58, 
        color: "#FFFF00",
    }, 
    17 : {
        name : "Chlorine",
        type : AtomTypes.HALOGEN, 
        speed: 10,
        defense : 45, 
        attack : 80, 
        electronegativity : 3.16, 
        color: "#32CD32",
    }, 
    18 : {
        name : "Argon",
        type : AtomTypes.NOBLEGAS, 
        speed: 30,
        defense : 70, 
        attack : 30, 
        electronegativity : 0.0, 
        color: "#D3D3D3",
    }, 
    19 : {
        name : "Potassium",
        type : AtomTypes.ALKALIMETAL, 
        speed: 30,
        defense : 50, 
        attack : 50, 
        electronegativity : 0.82, 
        color: "#9370DB",
    }, 
    20 : {
        name : "Calcium",
        type : AtomTypes.ALKALINEEARTHMETAL, 
        speed: 50,
        defense : 50, 
        attack : 50, 
        electronegativity : 1.00, 
        color: "#FFFACD",
    }, 
    
}; 


const ParticleStates = {
    ALIVE: 1,
    DEAD: 2
}

const ParticleTypes = {
    ELECTRON: 1,
    PROTON: 2,
    NEUTRON: 3
}





//---------------------------------Classes--------------------------------//





class Player {
    constructor (x,y,renderer){
        this.particles = [ParticleTypes.PROTON];
        this.valenceelectrons = []
        //Damage to particles should permeate by assigning a damage value to the hit particle. When the particle is hit again that particle transfers its damage value to all neighboring particles and updates its damage value higher. this continues until the damage permeates to the center where the player is at risk of instability
        //Create a second smaller electron ring which's main purpose is bonding [maximum of 8 electrons]
        this.x = x;
        this.y = y;
        this.electronRotation = 0;
        this.renderer = renderer
        this.ammunition = 0
        this.size = 0
        this.numParticles = 1
        this.maxAmmunition = 1
        this.atomicNmbr = 1
        this.color = "#f74949"
        this.maxHealth = 100
        this.health = 100
        this.damage = 10
        this.name = "Unknown"
        this.alive = true
        this.TOB = Date.now()
    }

    fireToward(x,y){
        if (player.alive == false) return
        if (this.ammunition < 1) return
        var X, Y, velX, velY
        var e = new Electron( 
            X = -Math.sign(this.x-x) * this.size * Math.abs(Math.cos(this.angleTo(x,y))) + this.x,
            Y = -Math.sign(this.y-y) * this.size * Math.abs(Math.sin(this.angleTo(x,y))) + this.y,
            velX = -Math.sign(this.x-x) * 20 * Math.abs(Math.cos(this.angleTo(x,y))),
            velY = -Math.sign(this.y-y) * 20 * Math.abs(Math.sin(this.angleTo(x,y))),
            ParticleStates.ALIVE
        )
        this.renderer.electrons.push(e)
        this.ammunition -= 1
        socket.emit("fire",X, Y, velX, velY,this.damage)
    }

    angleTo(x,y){
        var diffx = this.x - x
        var diffy = this.y - y
        return Math.atan(diffy/diffx)
    }

    move(dx,dy){
        if (player.alive == false) return
        this.x += dx
        this.y += dy
        socket.emit('moveto',this.x,this.y);

        //Check For Collisions
        for (var i = 0; i < this.renderer.deadProtons.length; i++){
            var p = this.renderer.deadProtons[i]
            if ( this.distTo(p.relx,p.rely) < this.size ){
                this.renderer.deadProtons.splice(i,1)
                this.particles.push(ParticleTypes.PROTON)
                this.atomicNmbr = ++this.maxAmmunition
                this.recalculateStats()
                
                socket.emit("eat",p.relx,p.rely,ParticleTypes.PROTON,this.getInfo())
                break;
            }
        } 
        for (var i = 0; i < this.renderer.deadNeutrons.length; i++){
            var n = this.renderer.deadNeutrons[i]
            if ( this.distTo(n.relx,n.rely) < this.size ){
                this.renderer.deadNeutrons.splice(i,1)
                this.particles.push(ParticleTypes.NEUTRON)
                this.recalculateStats()
                socket.emit("eat",n.relx,n.rely,ParticleTypes.NEUTRON,this.getInfo())
                break;
            }
        } 
        if (this.ammunition >= this.maxAmmunition) return
        for (var i = 0; i < this.renderer.deadElectrons.length; i++){
            var e = this.renderer.deadElectrons[i]
            if ( this.distTo(e.x,e.y) < this.size ){
                this.renderer.deadElectrons.splice(i,1)
                this.ammunition++
                socket.emit("eat",e.x,e.y,ParticleTypes.ELECTRON,this.getInfo())
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
        if (player.alive == false) return
        //Particles
        var p = this.particles.length
        ctx.setTransform()
        ctx.scale(scale,scale)
        ctx.translate(center.x * 1/scale,center.y * 1/scale)

        ctx.rotate(this.angleTo(mouseX,mouseY))

        var n = 0;
        var s = 6;
        var l = 0;
        var d = 0;
        var r = 0;
        
        while (n < p){
            n++;
            if (n == 1){
                ctx.fillStyle = "pink"
                //Drawing.drawCircle(ctx,0,0,25)
                ctx.fillStyle = "darkred";
                //Drawing.drawCircle(ctx,0,0,16)
                Drawing.drawProton(ctx, 10 * Math.random() * ( this.maxHealth/this.health - 1),10 * Math.random() * ( this.maxHealth/this.health - 1),this.color)
                //ctx.stroke()
                d = 0;
                continue;
            }
            else if (n <= 7){
                ctx.rotate(2 * Math.PI / 6);
                r += 2 * Math.PI / 6
                D = 40 + 10 * Math.random() * ( this.maxHealth/this.health - 1)
                if (this.particles[n-1] == ParticleTypes.NEUTRON){ Drawing.drawNeutron(ctx,D,0,"grey") }
                else { Drawing.drawProton(ctx,D,0,this.color) }
                //ctx.stroke()
                d = 50;
            }
            else{
                if (l <= 0 ){ 
                    s += 5; 
                    l = s; 
                    d = (100) / (4*Math.cos(Math.PI/2 - Math.PI/s))
                    ctx.rotate(50 * Math.PI / 180);
                    r += 50 * Math.PI / 180
                    d = 0.8 * d
                }
                ctx.rotate(2 * Math.PI / s);
                var D = d + 10 * Math.random() * ( this.maxHealth/this.health - 1)
                if (this.particles[n-1] == ParticleTypes.NEUTRON){ Drawing.drawNeutron(ctx,D,0,"grey") }
                else { Drawing.drawProton(ctx,D,0,this.color) }
                l--;
            }
        }
        this.size = d + 150

        //ctx.translate(-center.x,-center.y)
        ctx.setTransform()


        
        //Valence
        ctx.scale(scale,scale)
        ctx.translate(center.x* 1/scale,center.y* 1/scale)
        ctx.rotate(-0.5 * this.electronRotation * Math.PI / 180);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 3;
        ctx.setLineDash([25,25])
        ctx.beginPath();
        ctx.arc(0, 0, d + 60, 0, 2 * Math.PI);
        ctx.stroke()
        ctx.rotate(0.5 * this.electronRotation * Math.PI / 180);

        
        ctx.rotate(this.electronRotation * Math.PI / 180);
        var e = this.maxAmmunition;
        var rot = this.electronRotation * Math.PI / 180;
        for (var i = 0; i < e; i++){
            ctx.fillStyle = i >= this.ammunition ? "gray" : "mediumaquamarine";
            ctx.rotate(2 * Math.PI / e);
            rot += 2 * Math.PI / e;
            Drawing.drawCircle(ctx,d + 100 + 10 * Math.cos(30 * rot),0,5)
        }
        ctx.rotate(-this.electronRotation * Math.PI / 180);
        ctx.translate(-center.x* 1/scale,-center.y* 1/scale)
        this.electronRotation += 20/e
    }

    getInfo(){
        return {
            particles: this.particles,
            ammunition: this.ammunition
        }
    }

    countProtons(){
        return ( this.particles.filter((p) => p == ParticleTypes.PROTON) ).length
    }

    countNeutrons(){
        return ( this.particles.filter((p) => p == ParticleTypes.NEUTRON) ).length
    }

    recalculateStats(){

        if (player.alive == false) return
        var info = statistics[this.atomicNmbr]
        var numNeutrons = this.countNeutrons()
        var numProtons = this.atomicNmbr
        this.color = info.color
        speed = info.speed/Math.sqrt(numNeutrons * 2 + numProtons)
        this.maxHealth = info.defense * (numNeutrons * 2 + numProtons)
        this.health = this.maxHealth
        this.damage = info.attack

        document.getElementById("currentAtomHeader").innerText = `${this.atomicNmbr} - ${info.name}`
        document.getElementById("speedStat").innerText = `Mobility → ${info.speed}`
        document.getElementById("defenseStat").innerText = `Stability → ${info.defense}`
        document.getElementById("attackStat").innerText = `Entropy → ${info.attack}`
        document.getElementById("bodyDamageStat").innerText = `Electronegativity → ${info.electronegativity}`
        
        document.getElementById("atomType").innerText = `${statistics[this.maxAmmunition].name} ${this.countNeutrons()}`
        document.getElementById("namePlate").innerText = `~ ${this.name} ~`
    }

    pop(){
        var collection = []
        this.alive = false
        this.particles.forEach((particle) => {

            //Randomize position around where the player was killed
            var r = 2 * Math.PI * Math.random()
            var d = this.size * Math.random()
            var x = this.x + d * Math.cos(r)
            var y = this.y + d * Math.sin(r)

            if (particle == ParticleTypes.PROTON){
                var p = new Proton(x,y,null,ParticleStates.DEAD)
                this.renderer.deadProtons.push(p)
                collection.push(p)
            }
            else{
                var n = new Neutron(x,y,null,ParticleStates.DEAD)
                this.renderer.deadNeutrons.push(n)
                collection.push(n)
            }

        })
        for(var i = 0; i < this.maxAmmunition; i++){
            var r = 2 * Math.PI * Math.random()
            var d = this.size + 50 * Math.random()
            var x = this.x + d * Math.cos(r)
            var y = this.y + d * Math.sin(r)

            var e = new Electron(x,y,0,0,ParticleStates.DEAD)
            this.renderer.deadNeutrons.push(e)
            collection.push(e)
        }
        socket.emit("death",collection)

        //Revive after a few seconds
        setTimeout(() => {
            this.particles = [ParticleTypes.PROTON];
            this.x = 0;
            this.y = 0;
            this.electronRotation = 0;
            this.ammunition = 0
            this.size = 0
            this.numParticles = 1
            this.maxAmmunition = 1
            this.atomicNmbr = 1
            this.color = "#f74949"
            this.maxHealth = 100
            this.health = 100
            this.damage = 10
            this.alive = true
            this.TOB = Date.now()
            socket.emit("revive")
        }, 1000)
    }

    get electronCount(){
        return this.electrons.length
    }


}








class Enemy extends Player {
    constructor(ID,renderer){
        super (0,0,renderer)
        this.ID = ID

    }

    draw( ctx ){

        if (this.alive == false) return
        //Particles
        var p = this.particles.length
        ctx.setTransform()
        ctx.scale(scale,scale)
        ctx.translate(-player.x + this.x + center.x* 1/scale,-player.y + this.y+ center.y* 1/scale)
            
        ctx.rotate(this.angleTo(mouseX,mouseY))

        var n = 0;
        var s = 6;
        var l = 0;
        var d = 0;
        var r = 0;
        
        while (n < p){
            n++;
            if (n == 1){
                Drawing.drawProton(ctx,10 * Math.random() * ( this.maxHealth/this.health - 1),10 * Math.random() * ( this.maxHealth/this.health - 1),"#131313")
                d = 0;
                continue;
            }
            else if (n <= 7){
                ctx.rotate(2 * Math.PI / 6);
                var D = 40 + 10 * Math.random() * ( this.maxHealth/this.health - 1)
                if (this.particles[n-1] == ParticleTypes.NEUTRON){ Drawing.drawNeutron(ctx,D,0,"grey") }
                else { Drawing.drawProton(ctx,D,0,"#131313") }
                //ctx.stroke()
                d = 50;
            }
            else{
                if (l <= 0 ){ 
                    s += 5; 
                    l = s; 
                    d = (100) / (4*Math.cos(Math.PI/2 - Math.PI/s))
                    ctx.rotate(50 * Math.PI / 180);
                    r += 50 * Math.PI / 180
                    d = 0.8 * d
                }
                ctx.rotate(2 * Math.PI / s);
                var D = d + 10 * Math.random() * ( this.maxHealth/this.health - 1)
                if (this.particles[n-1] == ParticleTypes.NEUTRON){ Drawing.drawNeutron(ctx,D,0,"grey") }
                else { Drawing.drawProton(ctx,D,0,"#131313") }
                l--;
            }
        }
        this.size = d + 150

        //ctx.translate(-center.x,-center.y)
        ctx.setTransform()


        
        //Valence
        ctx.scale(scale,scale)
        ctx.translate(-player.x + this.x + center.x* 1/scale,-player.y + this.y+ center.y* 1/scale)
        ctx.rotate(-0.5 * this.electronRotation * Math.PI / 180);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 3;
        ctx.setLineDash([25,25])
        ctx.beginPath();
        ctx.arc(0, 0, d + 60, 0, 2 * Math.PI);
        ctx.stroke()
        ctx.rotate(0.5 * this.electronRotation * Math.PI / 180);

        
        ctx.rotate(this.electronRotation * Math.PI / 180);
        var e = this.maxAmmunition;
        var rot = this.electronRotation * Math.PI / 180;
        for (var i = 0; i < e; i++){
            ctx.fillStyle = i >= this.ammunition ? "gray" : "mediumaquamarine";
            ctx.rotate(2 * Math.PI / e);
            rot += 2 * Math.PI / e;
            Drawing.drawCircle(ctx,d + 100 + 10 * Math.cos(30 * rot),0,5)
        }
        ctx.rotate(-this.electronRotation * Math.PI / 180);
        ctx.translate(player.x - this.x - center.x* 1/scale,player.y - this.y - center.y* 1/scale)
        this.electronRotation += 20/e
    }

    static byID(ID){
        return enemies.find((element) => element.ID == ID);
    }

}








class Proton {
    //Null parent indicates world space parent
    constructor(relx,rely,parent,state){
        this.relx = relx 
        this.rely = rely
        this.parent = parent
        this.state = state
        this.type = ParticleTypes.PROTON
    }

    draw(ctx){
        if (this.state == ParticleStates.ALIVE){

        }
        else{
            ctx.setTransform()
            ctx.scale(scale,scale)
            ctx.translate(-player.x + center.x* 1/scale,-player.y + center.y* 1/scale)
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
        this.type = ParticleTypes.NEUTRON
    }

    draw(ctx){
        if (this.state == ParticleStates.ALIVE){

        }
        else{
            ctx.setTransform()
            ctx.scale(scale,scale)
            ctx.translate(-player.x + center.x* 1/scale,-player.y + center.y* 1/scale)
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
    constructor (x,y,velx,vely,state,dmg){
        this.x = x
        this.y = y
        this.velx = velx
        this.vely = vely
        this.state = state
        this.type = ParticleTypes.ELECTRON
        this.damage = dmg
    }

    draw(ctx){

        if (this.state == ParticleStates.ALIVE){
            var magnitude = 10
            ctx.setTransform()
            ctx.translate(-player.x*scale + center.x,-player.y*scale + center.y)
            ctx.scale(scale,scale)
            ctx.fillStyle = "mediumaquamarine";

            ctx.translate(this.x,this.y)
            ctx.rotate(2 * Math.PI * Math.random())
            Drawing.drawCircle(ctx,magnitude * Math.random(),0,5)
            
        }
        else{
            ctx.setTransform()
            ctx.scale(scale,scale)
            ctx.translate(-player.x + center.x* 1/scale,-player.y + center.y* 1/scale)
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


class Point2D {
    constructor (x = 0,y = 0){
        this.x = x;
        this.y = y;
    }
}



class Drawing {
    
    static drawCircle(ctx,x,y,radius){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }


    static drawProton(ctx,x,y,color){
        ctx.fillStyle = color
        Drawing.drawCircle(ctx,x,y,22)
        ctx.fillStyle = "white"

        ctx.beginPath()
        ctx.rect(x-8,y-2,16,4)
        ctx.fill()

        ctx.beginPath()
        ctx.rect(x-2,y-8,4,16)
        ctx.fill()
    }

    static drawNeutron(ctx,x,y,color){
        ctx.fillStyle = "#121212"
        Drawing.drawCircle(ctx,x,y,25)

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3
        ctx.setLineDash([])

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.stroke();
    }

}



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
            if (player.distTo(this.electrons[i].x,this.electrons[i].y) < player.size && player.alive == true){
                player.health -= this.electrons[i].damage
                if (player.health <= 0) {player.pop()}
                this.electrons.splice(i,1)
                socket.emit("damaged",player.health, player.maxHealth)
                break
            }
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


//---------------------------------Functions--------------------------------//



function updateLeaderboard(){
    var players = enemies.map((x) => x);
    var now = Date.now()
    players.push(player)
    players.sort((a,b) => { 
        return now - a.TOB < now - b.TOB
    })
    
    var board = document.getElementById("leaderboard-list")
    while ( board.children.length != 0 ){
        board.removeChild(board.children[board.children.length - 1])
    }

    for (var i = 0; i < 5 && i < players.length ; i++){
        if (!(now - players[i].TOB > 0)) continue;
        var li = document.createElement("li")
        li.className = "leaderboardli"
        li.innerText = `${players[i].name} | ${ now - players[i].TOB } ms`
        board.appendChild(li)
    }
}



//---------------------------------Flow-Control--------------------------------//



function setup(){

    //Connect to socket server
    socket = io("ws://chemio.glitch.me")
    socket.emit('message', "Connected")

    //Adjust Resolution
    var canvas = document.getElementById("view");
    canvas.height = canvas.offsetHeight
    canvas.width = canvas.offsetWidth

    //Hide Main menu And DIsplay In Game HUD
    document.getElementById("main").style.display = "none"
    document.getElementById("leaderboard").style.display = "block"
    document.getElementById("identifiers").removeAttribute("hidden")
    document.getElementById("stats").removeAttribute("hidden")
    

    //Prepare For GameLoop
    renderer = new ParticleRenderer()
    context = canvas.getContext("2d")
    center = new Point2D(canvas.width/2,canvas.height/2);
    player = new Player(center.x,center.y, renderer);
    player.name = document.getElementById("nameInput").value
    player.recalculateStats()


    

    socket.emit("join", player.name,player.TOB)

    socket.on('initialize', (playerList, particleList) => { 

        playerList.forEach((enemy) => {
            var e = new Enemy(enemy.ID,renderer)
            e.name = enemy.name
            e.TOB = enemy.TOB
            enemies.push(e)
            e.draw(context)
        })

        particleList.forEach((particle) => {
            switch (particle.type){
                case ParticleTypes.PROTON: renderer.deadProtons.push(new Proton( particle.x, particle.y, null, ParticleStates.DEAD)); break;
                case ParticleTypes.NEUTRON: renderer.deadNeutrons.push(new Neutron( particle.x, particle.y, null, ParticleStates.DEAD)); break;
                case ParticleTypes.ELECTRON: renderer.deadElectrons.push(new Electron( particle.x, particle.y, 0,0, ParticleStates.DEAD)); break;
            }
        })

        updateLeaderboard()
    })

    socket.on('death', (ID,collection) => { 

        Enemy.byID(ID).alive = false

        collection.forEach((particle) => {
            switch (particle.type){
                case ParticleTypes.PROTON: renderer.deadProtons.push(new Proton( particle.relx, particle.rely, null, ParticleStates.DEAD)); break;
                case ParticleTypes.NEUTRON: renderer.deadNeutrons.push(new Neutron( particle.relx, particle.rely, null, ParticleStates.DEAD)); break;
                case ParticleTypes.ELECTRON: renderer.deadElectrons.push(new Electron( particle.x, particle.y, 0,0, ParticleStates.DEAD)); break;
            }
        })
    })

    socket.on('newEnemy', (ID,name) => { 
        var e = new Enemy(ID,renderer)
        e.name = name
        enemies.push(e)
        e.draw(context)
    })

    socket.on('playerLeave', (ID) => { 
        var e = enemies.find((element) => element.ID == ID);
        var i = enemies.indexOf(i)
        enemies.splice(i,1)
    })

    socket.on('enemyMove', (x,y,ID) => { 
        var e = enemies.find((element) => element.ID == ID);
        e.x = x
        e.y = y
    })

    socket.on('revive', (ID) => { 
        var e = Enemy.byID(ID)
        e.particles = [ParticleTypes.PROTON];
        e.x = 0;
        e.y = 0;
        e.electronRotation = 0;
        e.ammunition = 0
        e.size = 0
        e.numParticles = 1
        e.maxAmmunition = 1
        e.atomicNmbr = 1
        e.color = "#f74949"
        e.maxHealth = 100
        e.health = 100
        e.damage = 10
        e.alive = true
        e.TOB = Date.now()
    })

    socket.on('spawnProjectile', (x, y, velx, vely, dmg) => { 
        var e = new Electron( 
            x,
            y,
            velx,
            vely,
            ParticleStates.ALIVE,
            dmg
        )
        renderer.electrons.push(e)
    })

    socket.on('updateEnemyHealth', (ID,health,max) => { 
        var e = Enemy.byID(ID)
        e.health = health
        e.maxHealth = max
    })

    socket.on('deleteParticle', (x,y,type) => { 
        switch (type){
            case ParticleTypes.PROTON: {
                var p = renderer.deadProtons.find((particle)=> particle.relx == x && particle.rely == y)
                if (p == undefined) return
                var i = renderer.deadProtons.indexOf(p)
                renderer.deadProtons.splice(i,1)
                break
            }
            case ParticleTypes.NEUTRON: {
                var n = renderer.deadNeutrons.find((particle)=> particle.relx == x && particle.rely == y)
                if (n == undefined) return
                var i = renderer.deadNeutrons.indexOf(n)
                renderer.deadNeutrons.splice(i,1)
                break
            }
            case ParticleTypes.ELECTRON: {
                var p = renderer.deadElectrons.find((particle)=> particle.x == x && particle.y == y)
                if (p == undefined) return
                var i = renderer.deadElectrons.indexOf(p)
                renderer.deadElectrons.splice(i,1)
            }
        }
    })

    socket.on('updateEnemyParticles', (ID,info) => { 
        var e = Enemy.byID(ID)
        e.particles = info.particles
        e.ammunition = info.ammunition
        e.maxAmmunition = ( info.particles.filter((p) => p == ParticleTypes.PROTON) ).length
    })

    socket.on('spawnFood', (x,y,type) => { 

        switch (type){
            case ParticleTypes.ELECTRON: {
                renderer.deadElectrons.push( new Electron(x,y,0, 0,ParticleStates.DEAD))
                break
            }
            case ParticleTypes.PROTON: {
                renderer.deadProtons.push( new Proton(x,y,null,ParticleStates.DEAD))
                break
            }
            case ParticleTypes.NEUTRON: {
                renderer.deadNeutrons.push( new Neutron(x,y,null,ParticleStates.DEAD))
                break
            }
        }
    })

    setInterval(loop, 20)
    setInterval(updateLeaderboard, 5000)
}


function loop(){

    //Movement based on currently down keys
    player.move(
        speed * (keyStates.d - keyStates.a),
        speed * (keyStates.s - keyStates.w)
    )


    context.setTransform()
    context.fillStyle = "whitesmoke"
    context.beginPath()
    context.rect(0,0,center.x * 2,center.y * 2)
    context.fill()

    renderer.drawDeadElectrons(context)
    renderer.drawDeadProtons(context)
    renderer.drawDeadNeutrons(context)

    player.draw(context);
    for (var i = 0; i < enemies.length; i++){
        enemies[i].draw(context)
    }
    renderer.drawElectrons(context)
    renderer.updateElectrons()

}




//---------------------------------Events--------------------------------//





addEventListener("mousemove", (event) => {
    mouseX = event.mouseX
    mouseY = event.mouseY
});



document.getElementById("view").addEventListener("mousedown", (event) => {
    player.fireToward(event.clientX + player.x - center.x, event.clientY+player.y - center.y)
});



addEventListener("keydown", (event) => {
    keyStates[event.key.toLowerCase()] = 1
});

addEventListener("keyup", (event) => {
    keyStates[event.key.toLowerCase()] = 0
});


addEventListener("wheel", (event) => {
    if (scale + event.deltaY/100 > 200/player.size) {
        scale = 200/player.size
        return
    }
    if (scale + event.deltaY/100 < 100/player.size) {
        scale = 100/player.size
        return
    }

    scale += event.deltaY/100

});

window.onload = () => { 
    document.getElementById("StartButton").addEventListener("click",setup)
}

