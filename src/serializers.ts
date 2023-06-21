import {TileState} from "./game.config.ts";
import {invertBoardSetup, rotateBoardSetup, transpose} from "./utils.ts";



abstract class Serializer {
  constructor(protected playerColor: 'red' | 'blue') {}

  abstract deserialize(data: any): Array<Array<TileState>>;
}


export class ArraySerializer extends Serializer {
  deserialize(data: Array<number>): Array<Array<TileState>> {
    let counter = 0;
    let result = [];
    for (let el of data) {
        if (counter % 10 === 0) {
            result.push([]);
        }
        if (counter == 0) {
            result[result.length - 1].push(TileState.PlayerBase);
            counter++;
            continue;
        } else if (counter == 99) {
            result[result.length - 1].push(TileState.OpponentBase);
            counter++;
            continue;
        }
        result[result.length - 1].push(el);
        counter++;
    }
    result = transpose(result);
    if (this.playerColor === 'blue') {
        result = rotateBoardSetup(result);
    } else {
        result = invertBoardSetup(result);
    }
    return result;
  }
}