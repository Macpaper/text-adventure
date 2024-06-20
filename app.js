const userText = document.querySelector("#user-text");
const storyText = document.querySelector("#story-text");

function e() { return emptyRoom(); }

function emptyRoom() {
  return {
    roomName: "empty",
    items: [],
    enemies: [],
    traps: [],
    story: [],
  }
}

const map = [[e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
             [e(), e(), e(), e(), e(), e(), e(), e()],
            ];


map[0][3].items.push({type: "weapon", name: "Hammer", damage: 2});
map[0][3].story.push("You are in your own smithing shop. Your trusty hammer is usually around here somewhere...");
map[0][3].story.push("You are a blacksmith living in the kingdom of Nivia. You are working on a sword in your shop when"+
                      " you hear people screaming outside and look out to see a group of trolls attacking the city."+
                    " Your shop exits to the South.");
map[0][3].roomName = "Blacksmith";

map[1][3].roomName = "Courtyard";
map[1][3].story.push("This is the Courtyard. Various merchants have set up shops here in Nivia's busiest spot. " + 
                     "There is an Armorer, a potion seller, a weaponsmith, and your own Blacksmith shop here. A bridge connects" +
                     " the far end of the yard to the main entrance of the kingdom.");
map[1][3].story.push("You walk out into the open Courtyard to see a commotion. Trolls are setting fires to nearby buildings " +
                     "and attacking people. ")
map[1][3].enemies.push({name: "Small Troll", health: 3, attack: 3})

map[2][3].roomName = "Armorer";
map[2][3].story.push("There are only scraps of armor here now.");
map[2][3].story.push("This is the Armorer's place. You see a few pieces of armor scattered around the area.");
map[2][3].items.push({type: "armor", name: "Iron Armor", protection: 2, durability: 5});

map[1][4].roomName = "Potion Shop";
map[1][4].story.push("My potions are too strong for you, traveller.");
map[1][4].story.push("You enter the shop of the Potion Seller. You hear rumors that his potions are strong enough to kill a dragon, let alone a man...")
map[1][4].items.push({type: "consumable", name: "The Strongest Potion", used: false})

let x = 3;
let y = 0;
let playerItems = {
  consumable: {type: "consumable", name: "Water", used: false},
  weapon: {type: "weapon", name: "Stick", damage: 1, durability: 3},
  armor: {type: "armor", name: "Cloth", protection: 1, durability: 3}
};
let playerHealth = 10;
storyText.innerHTML += '<div id="story-text">' + map[0][3].story.pop() + '</div><br>';

userText.onkeypress = (e) => {
  if (e.key == "Enter" && playerHealth > 0) {
    let v = e.target.value.toLowerCase();
    let validEx = /[wensiualr]{1}/i;
    if (v == "w") { move(-1, 0); }
    if (v == "e") { move(1, 0); }
    if (v == "n") { move(0, -1); }
    if (v == "s") { move(0, 1); }
    if (v == "i") { pickUpItem(); } 
    if (v == "u") { useItem(); }
    if (v == "a") { attack(); } 
    if (v == "l") { look(); } 
    if (v == "r") { story(); } 

    e.target.value = "";
    // addText(map[y][x].enemies.length)
    if (!v.match(validEx)) {
      alert("Invalid command!")
    } else { 
      if (map[y][x].enemies.length > 0 && v != "r") {
        let e = map[y][x].enemies[0]
        if (diceRoll(1, 2) == 2) {
          if (e.attack - playerItems.armor.protection < 1) {
            playerHealth -= 1;
          } else {
            playerHealth -= (e.attack - playerItems.armor.protection);
          }
          addText("You are attacked by the " + map[y][x].enemies[0].name + "!");
          addText("HEALTH: " + playerHealth);
          playerItems.armor.durability -= 1;
          if (playerItems.armor.durability == 0) {
            playerItems.armor.protection = 0;
            addText("Your armor has been destroyed!");
          }
        }
      }
    }
    if (playerHealth <= 0) {
      addText("YOU DIED!");
    } 
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function diceRoll(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickUpItem() {
  let item = map[y][x].items.pop();
  if (item) {
    if (item.type == "weapon") {
      map[y][x].items.push(playerItems.weapon)
      addText("Dropped " + playerItems.weapon.name);
      playerItems.weapon = item; 
    }
    if (item.type == "consumable") { 
      map[y][x].items.push(playerItems.consumable)
      addText("Dropped " + playerItems.consumable.name);
      playerItems.consumable = item; 
    }
    if (item.type == "armor") { 
      map[y][x].items.push(playerItems.armor)
      addText("Dropped " + playerItems.armor.name);
      playerItems.armor = item; 
    }
    addText("You picked up " + item.name);
  } else {
    addText("No items found.");
  }
}

function useItem() {
  let c = playerItems.consumable;
  if (c.used == false) {
    c.used = true;
    if (c.name == "Water") {
      addText("You drank your water. You feel refreshed.")
      if (playerHealth < 10) {
        playerHealth += 1;
      }
      addText("HEALTH: " + playerHealth)
    }
    if (c.name == "Health Potion") {
      addText("You drank a Health potion. Your strength returns.")
      if (playerHealth > 7) {
        playerHealth = 10;
      } else {
        playerHealth += 3;
      }
      addText("HEALTH: " + playerHealth);
    }
    if (c.name == "The Strongest Potion") {
      addText("You drank the Potion Seller's Strongest Potion. You feel-")
      playerHealth = 0;
    }
  } else {
    addText("Your consumables are empty.");
  }
}

function addText(text) {
  let textDiv = document.createElement("div");
  textDiv.id = "story-text";
  textDiv.innerHTML += text + "<br><br>";
  storyText.appendChild(textDiv);
}

function attack() {
  if (map[y][x].enemies.length > 0) {
    let e = map[y][x].enemies[0];
    e.health -= playerItems.weapon.damage;
    addText("You attack the " + e.name + " with your " + playerItems.weapon.name + " for " + playerItems.weapon.damage + "!");
    if (e.health <= 0) {
      addText("You have killed the " + e.name + "!");
      map[y][x].enemies.pop();
    }
  } else {
    addText("There seem to be no enemies in this area.");
  }
}

function look() {
  if (map[y][x].enemies.length > 0) {
    let t = "There is a " + map[y][x].enemies[0].name + " here!";
    addText(t);
  }
  else if (map[y][x].items.length > 0) {
    let t = "There is a " + map[y][x].items[0].name + " on the ground.";
    addText(t);
  } else {
    addText("There doesn't seem to be anything interesting in this area.")
  }
}

function story() {
  if (map[y][x].story.length > 1) {
    let text = map[y][x].story.pop();
    addText(text);
  } else {
    addText(map[y][x].story[0]);
  }
}


function move(dx, dy) {
  if (dx + x >= 0 && dx + x <= 8 && dy + y >= 0 && dy + dy <= 8) {
    if (map[y + dy][x + dx].roomName == "empty") {
      addText("You cannot move in that direction.")
    } else {
      x += dx;
      y += dy;
      enterRoom(x, y);
    }
  } else {
    addText("You cannot move in that direction.")
  }
}

function enterRoom(x, y) {
  addText("Entering: " + map[y][x].roomName);
  if (map[y][x].story.length > 1) {
    addText(map[y][x].story.pop());
  }
}


window.addEventListener("load", e => { userText.focus(); })
userText.addEventListener("submit", e => {
  alert("haha")
})