//Glitch Hosted Server-Side
const ParticleStates = {
    ALIVE: 1,
    DEAD: 2
}

const ParticleTypes = {
    ELECTRON: 1,
    PROTON: 2,
    NEUTRON: 3
}

class Client{
  constructor( name, ID, TOB ){
    this.name = name
    this.ID = ID
    this.atomSize = 1;
    this.ammunition = 0;
    this.x = 0;
    this.y = 0;
    this.TOB = TOB
  }
}



class Particle{
  constructor(x,y,type){
    this.x = x
    this.y = y
    this.type = type
  }
}


class Game{
  
  static summonFood(){
    
    var size = 2000 
    var x = size * 2 * Math.random() - size
    var y = size * 2 * Math.random() - size

    if (particles.length > 200) return

    var type = Math.random()
    if (type < 0.8){
      io.emit("spawnFood", x,y,ParticleTypes.ELECTRON)
      particles.push( new Particle(x,y,ParticleTypes.ELECTRON))
    }
    else if (type < 0.9){ 
      io.emit("spawnFood", x,y,ParticleTypes.PROTON) 
      particles.push( new Particle(x,y,ParticleTypes.PROTON))
    }
    else { 
      io.emit("spawnFood", x,y,ParticleTypes.NEUTRON) 
      particles.push( new Particle(x,y,ParticleTypes.NEUTRON))
    }
    numparticles++

  
  }
}



//--------------------------------------------------------------------------------------------//



const express = require('express');
const socketIO = require('socket.io')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = socketIO(server, { cors: {origin:"*"} } )

var players = []
var particles = []
var numparticles = 0;

const cors = require('cors')
app.use(cors())


io.on('connection', (socket) => {
  console.log('Connection Made')
  var ID = Math.floor(9999 * Math.random())
  
  socket.on("join", (name, TOB) => {
    player.name = name
    player.TOB = TOB//Time Of Birth
    socket.broadcast.emit("newEnemy",ID,name)
  })
  
  
  //Send list of initial players
  socket.emit("initialize",players, particles)

  var player = new Client("",ID)
  players.push( player )
  
  socket.on('moveto', (x,y) => { 
    socket.broadcast.emit('enemyMove',x,y,ID)
    player.x = x
    player.y = y
    player
  })
  
  socket.on("disconnect", () => { 
    socket.broadcast.emit('playerLeave',ID)
    var p = players.find((player)=>player.ID == ID)
    var i = players.indexOf(p)
    players.splice(i,1)
  })
  
  socket.on("fire", (x,y,velx,vely,dmg,ID) => { 
    socket.broadcast.emit('spawnProjectile',x,y,velx,vely,dmg,ID)
  })
  
  socket.on("damaged", (health,max) => { 
    socket.broadcast.emit("updateEnemyHealth", ID, health,max)
  })
  
  socket.on("death", (ps) => { 
    ps.forEach((particle) => {
      switch (particle.type){
                case ParticleTypes.PROTON: 
                case ParticleTypes.NEUTRON: particles.push(new Particle(particle.relx,particle.rely,particle.type)); break;
                case ParticleTypes.ELECTRON: particles.push(new Particle(particle.x,particle.y,particle.type)); break;
            }
    })
    socket.broadcast.emit("death", ID, ps)
  })
  
  socket.on("revive", () => { 
    socket.broadcast.emit("revive", ID)
  })
  
  socket.on("eat", (x,y,type,info) => { 
    
    console.log("Eaten")
    socket.broadcast.emit("updateEnemyParticles", ID, info)
    var p = particles.find((particle)=> particle.x == x && particle.y == y && particle.type == type)
    if (p == undefined) return
    var i = particles.indexOf(p)
    particles.splice(i,1)
    socket.broadcast.emit("deleteParticle", x,y,type)
    
    
  })

})

//Food Summoning Loop
setInterval(Game.summonFood,100)


app.use(express.json())


app.get('/',  async ( request, response ) => {
  
  response.sendFile(__dirname + '/index.html');

})

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/" + "style.css");
});

app.get('/script.js', function(req, res) {
  res.sendFile(__dirname + "/" + "script.js");
});

const listener = server.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
})








