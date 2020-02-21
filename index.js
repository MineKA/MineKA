const mineflayer = require('mineflayer');
const Vec3 = require('vec3');
var attack = false;

let opts = {
    host: process.argv[2],
    username: "bot",
    version: false
};

let bot = mineflayer.createBot(opts);
function nearestEntity(type) {
    try {
        var id, entity, dist;
        var best = null;
        var bestDistance = null;
        for(id in bot.entities) {
            entity = bot.entities[id];
            if(entity.type === 'player') {
                if(entity.username === process.argv[3])
                if(entity === bot.entity) continue;
                //if(Math.abs(entity.position.y - bot.entity.position.y) > 5) continue; uncomment if you want the bot to limit to players within 5 blocks above/below.
                dist = distXz(bot.entity.position, entity.position);
                if(!best || dist < bestDistance) {
                    best = entity;
                    bestDistance = dist;
                }
            }
        }
        return best;
    } catch (e) {
        console.log('error: ' + e);
    }
}

bot.on('spawn', function() {
    let interval = setInterval(function(){
        if(attack) {
            var entity = nearestEntity();
            if(entity) {
                bot.lookAt(entity.position, true);
                if(entity.position.distanceTo(bot.entity.position) > 5.5) {
                    bot.setControlState('forward', true);
                    bot.setControlState('jump', true);
                    bot.setControlState('sprint', true);
                    bot.setControlState('back', false);
                } else {
                    bot.clearControlStates();
                    bot.setControlState('forward', false);
                    bot.setControlState('back', true);
                    bot.attack(entity, true);
                    //console.log('attacking ' + entity.mobType); uncomment if you want the bot to print what it's attacking. THIS WILL SPAM YOUR TERMINAL! USE WITH CAUTION
                }
            }
        }
    }, 10);
});
bot.on('kicked', function(reason) {
    console.log('kicked for ' + reason);
});
bot.on('chat', function(username, message) {
    if(message === 'attack') {
        attack = !attack;
        bot.clearControlStates();
    }
});
bot.on('health', function() {
    console.log('health: ' + bot.health);
    console.log('hunger: ' + bot.food);
});
function distXz(coord1, coord2) {
  var dx = coord1.x - coord2.x;
  var dz = coord1.z - coord2.z;
  return Math.sqrt(dx * dx + dz * dz);
};