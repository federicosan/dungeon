import BaseDungeonScreenState from './base_dungeon_screen_state';
import TurnStates from './turn_states';
/**
* In this state player can select its action like attack, defense, sleep or interaction with any object on map
*/
export default class PlayerChooseActionState extends BaseDungeonScreenState {

  public onEnter() : void {
    this.input.onTap.add(this.onPlayerTap, this);
  }

  public onUpdate(delta: number) {
    //console.log(" on update ", delta);
  }

  public onExit() : void {
    this.input.onTap.remove(this.onPlayerTap, this);
  }

  /**
  * In here we check where player did tap on map
  **/
  private onPlayerTap(pointer : Phaser.Pointer, doubleTap : boolean) : void {
    var tapTile : Phaser.Point = this.level.getTilePositionFor(pointer);
    this.fsm.enter(TurnStates.PLAYER_MOVE, { point: tapTile });

    //TODO check if tap on enemy
    //TODO check if tap on item
    //TODO check if tap on ground
  }
}