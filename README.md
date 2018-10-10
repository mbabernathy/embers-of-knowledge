# embers-of-knowledge
Game project used to learn Ember.js

Play here: [https://mbabernathy.github.io/embers-of-knowledge/](https://mbabernathy.github.io/embers-of-knowledge/)

## How to Play

The game has two parts; a magic duel against an AI opponent, and a store to buy upgrades for the duel game.

### Duel

The duel is split up into turns.  At the beginning of each turn, after a stats so far recap, you and your opponent will (automatically) roll dice.  The dice roll will cause you to gain mana, or in some cases, perform a critical effect that varies depending on the type of dice it was.

After the dice roll, you and your opponent will cast spells based on the mana you each gained, until you run out of mana or pass (Note that it is to your advantage to spend all your mana, as most unspent mana will be lost at the end of the turn).

Once you are done casting spells, the creature combat phase will proceed, where the creatures previously summoned by spells will face each other.  Each creature will fight exactly one (1) of its counterparts on the opposing side, with any creatures without counterparts will deal damage directly to the opposing player (ex. if you have more summoned creatures than your opponent, the extra creatures will harm your opponent).

After the creatures fight, the turn will end and a new one will begin, repeating this cycle until either player has their health pool reach zero (0). Once either player hits zero health, the duel will end and an payout is rewarded based on the combined performance of both participants.  You will then be taken to the store.

### Store
The store is where you can buy new spells, more dice, and upgrade your existing dice to customize and specialize your spellcasting.

By purchasing additional sides for your dice, you can play with the probabilities of the outcomes.  For example, if you were to purchase additional sides for school specific mana to your Life dice to make it 1 neutral side, 3 life sides, and 1 crit side (1/3/1), the probability of gaining Life mana from the dice would change from 1/3 (33%) to 3/5 (60%), while the probability of gaining neutral mana or the crit effect would lower from 1/3 (33%) to 1/5 (20%).

Upgrading the mana gaining sides of dices also can help you gain more mana per roll as well.  You can purchase new spells to unlock more powerful effects that take advantage of the larger mana gains.  In addition to more spells of the neutral school and primary 4 schools (Life, Death, Physical, & Illusionary) you can also cast spells of hybrid schools, which take mana of both the adjacent schools (like Druidic spells using both Life and Physical mana).

Once you are done upgrading and customizing, you can enter into a new duel.

## Coding and Development stuff

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

### Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

### Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

#### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

#### Running Tests

* `ember test`
* `ember test --server`

#### Building

* `ember build` (development)
* `ember build --environment production` (production)

#### Deploying

Specify what it takes to deploy your app.

### Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
