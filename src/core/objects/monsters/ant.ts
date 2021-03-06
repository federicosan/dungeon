import Mob from '../mob';
import { TILE_SIZE } from '../../consts';
import Fist from '../../items/weapons/fist';
import Env from '../../env';
import {PendingTurnAction, TurnDirector} from '../pending_actions/pending_turn_actions';
import GameObject from '../game_object';
import MinorHealthPotion from '../../items/potions/minor_health_potion';
import Item from '../../items/item';
import Gold from '../../items/gold';
const ANT_SPRITE_NAME = 'black_ant';

export default class Ant extends Mob {
  protected fistWeapon : Fist;
  constructor(env : Env) {
    super(env, ANT_SPRITE_NAME);
  }

  protected setupStatsAndEquipment() {
    this.experience        = 2;
    this.fistWeapon        = new Fist(this.game, this);
    this.baseStats.health  = 10;
    this.baseStats.attack  = 3;
    this.baseStats.defense = 1;
    this.baseStats.accuracy = 4;
    this.baseStats.evasion  = 3;
  }

  public static preload(load : Phaser.Loader) {
    load.spritesheet(ANT_SPRITE_NAME, require('black_ant.png'), TILE_SIZE, TILE_SIZE);
  }

  public takeTurn(turnDirector : TurnDirector) : boolean {
    if (this.fistWeapon.canAttack(this.env.player, this.env)) {
      this.fistWeapon.performAttack(this.env.player, this.env, turnDirector);
      return true;
    } else {
      this.wander(turnDirector);
      return false;
    }
  }

  public get name() {
    return "Giant ant";
  }

  public get description() {
    return "A giant ant that lives underground";
  }

  protected getItemsToDrop() : Item[] {
    return [
      new MinorHealthPotion(this.game),
      new Gold(this.game, this.game.rnd.between(10, 20))
    ];
  }
}
