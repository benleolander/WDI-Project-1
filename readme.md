# General Assembly Project 1: Simple front-end game

### Timeframe
7 days

## Technologies used

* JavaScript (ES6) & jQuery
* HTML5
* CSS, CSS Animation & SASS
* GitHub

## Installation

1. Clone or download the repo
2. Open the `index.html` in browser of choice. Primarily tested against Google Chrome.

## My Game - Space Invaders

![Space Invaders Logo](https://user-images.githubusercontent.com/44977343/51029918-ae486f00-158f-11e9-8076-bfdfc29153ce.png)

### Game Overview
Space Invaders is a classic arcade game from the 80's. The player aims to shoot an invading alien armada, before it reaches the planet's surface using a mobile ship.

The player can only move left or right. The aliens also move from left to right, and also down each time the reach the side of the screen. The aliens also periodically fire at the player.

Once the player has destroyed a wave of aliens, the game starts again. The aim is to achieve the highest score possible before either being destroyed by the aliens, or allowing them to reach the planet's surface.

### Controls
- Player Movement: ← → keys
- Fire : Space Bar
- End Game: Esc

# Game Instructions
1. The game begins with a start screen, with instructions to the player. The Start Game button is highlighted to the user, and can be clicked to begin the game.

2. The game begins, and the player is able to move and fire immediately. A wave of aliens is spawned, and they will begin to advance on the player's position.

![Initial Game State](https://user-images.githubusercontent.com/44977343/51030296-e3a18c80-1590-11e9-880b-d447fb235940.png)

3. Points are awarded by destroying individual aliens. Aliens in the front rows are worth 10 points, the middle rows are worth 20 points, and the final row is worth 30 points. The aliens will begin to fire back at the player at random intervals.

![Destroyed Alien](https://user-images.githubusercontent.com/44977343/51030334-02a01e80-1591-11e9-8720-751c7de07fcb.png)

4. After a certain amount of time has elapsed, the game may spawn an Alien Mothership. A Mothership will quickly fly from left to right along the top row of the game board. Hitting a Mothership awards the player 250 points. Motherships may be generated at intervals throughout the game, but are rare.

![Mothership](https://user-images.githubusercontent.com/44977343/51030347-0f247700-1591-11e9-8cc8-2143b38cc4ad.png)

5. Completely destroying a wave of aliens will cause a new wave of aliens to spawn. This new wave will move faster than the previous wave, and be more aggressive.

6. If the aliens successfully shoot the player, a life is lost. This will remove the player from the gameboard, and respawn them after a delay. The player begins with 3 lives. If all lives are lost, the game is over. The game is also over if an alien reaches the bottom row of the gameboard.

7. On Game Over, the player's score is displayed, along with the number of waves cleared. If the player has achieved a high score, they are prompted to save it. The high score is recorded in the user's local storage as one of ten high scores, which are then displayed. Regardless of wether or not a high score is achieved, the user is offered the chance to restart the game.

![High Score Tables](https://user-images.githubusercontent.com/44977343/51030369-24010a80-1591-11e9-86e6-16dd23510bd7.png)

## Process
The starting point for this game was to create a gameplay grid. This acts as the gameboard on which all pieces exist. This grid is generated using Javascript to place 'div's onto a container. The container has a display property of 'flex', to stack the divs into a grid.

A CSS class of 'player' is applied to the central square of the bottom row of the grid. This generates the player's ship. This ship can be moved only within the confines of the bottom row. Hitting either the left or right edge will stop the player.

A 'for' loop generates 55 aliens, as in the original game. These aliens are created from a Constructor function. This function assigns the initial position of the alien, its points value, along with the CSS class to be applied. This creates three different types of alien. It also includes prototype functions to govern the movement of each alien.

![Alien constructor function from app.js](https://user-images.githubusercontent.com/44977343/51029535-89073100-158e-11e9-9402-d09e1b90bae5.png)

Each alien is then pushed into an 'enemies' array. While the game is running, the array runs the appropriate movement function at a set interval. In the first wave, this interval is 1 second, although this decreases as the player clears waves, making the aliens move faster.

When the player fires, a CSS class of 'laser' is applied, which travels up the gameboard vertically, checking for a collision on each movement. If this laser makes contact with any index contained the 'enemies' array, the target index is 'splice'd out of the array, and an 'explosion' class is temporarily added then removed along with the 'alien' class. This removes the alien object from the 'enemies' array, so that the other aliens will continue to move around the dead alien.

Each time the aliens' movement function is run, a random number is generated. If this number exceeds a given 'alienDifficulty' value, the alien will fire on the player. The 'alienLaser' uses the same movement pattern as the player's laser, but in reverse. The 'alienDifficulty' value is adjusted as the waves go on, making it more likely that later waves of aliens will fire on the player.

Once the game is over, either via loss of the player's lives or the aliens reaching the player, the player's score is compared against the high score table saved in 'localStorage'. If the player's score is higher than the lowest high score, the player is prompted to enter their name in an HTML 'form' element. Their input is combined with the score into an object, which is then spliced into the high score array at the appropriate position. If the high score array's length is now greater than 10, the 11th position is removed via 'pop', maintaining the length as 10.

## Challenges
The biggest challenge for this project was getting the aliens to move as a block, particularly when dealing with multiple alien classes. This was not initially possible with the code I had written, until I refactored to use a Constructor to create the aliens.

Another challenge was that the game requires the redrawing of the gameboard multiple times per second, particularly when it comes to the lasers. I frequently found lasers getting 'stuck' in position, as the class was not being removed correctly. This is still an issue at artificially high wave counts, but should not be encountered during normal play.

## Wins
When planning the project, I anticipated that the collision detection would be the most complex part. I am pleased with my use of arrays and the jQuery '.includes' function to overcome this.

I also put a lot of time into the functions related to the High Score table. The result should need minimal refactoring, and could easily be reused in future projects. It should take up minimal space on a users local device, due to the length limit I've put in place.

## Future Features

Given more time, there are a handful of features & changes I would add to my code, including making the game mobile responsive.

The Alien Mothership is currently a completely independent object, sharing nothing with the standard alien array. I'd ultimately like to refactor the Mothership into the alien Constructor, which would enable me to remove significant chunks of Mothership-specific code.

I initially planned on collectable Power Ups to be available to the player, which would temporarily modify the behaviour of the player's laser. These power ups would enable features such as dual lasers and shots that can hit multiple rows of enemies. I'd love to implement these eventually.
