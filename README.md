# Castledice-frontend
Try it out: https://near.org/ostolex.near/widget/CastleDice
![Menu and loading screen background](https://github.com/OSTOLEX-Technologies/Castledice-frontend/assets/63261287/0911730f-4a9d-4f21-a970-4a7155f9de99)

- [Project structure and links](#project-structure-and-links)
  - [Project structure](#project-structure)
  - [Our codebase](#our-codebase)
- [Smart contracts documentation](#smart-contracts-documentation)
- [Gamedesign](#gamedesign)
  - [Video review](#video-review)
  - [Game Design Document](#game-design-document)
  - [Current game rules](#current-game-rules)

## Project structure and links
#### Project structure:
1. This repo with game's front-end written with Phaser3
2. Front-end deployed to S3 bucket
3. Solidity contract deployed on Aurora mainnet. Contract address: 0xAb926c04Fa3E0CbE23f51BE4Ea2B0777cbB675CC
4. BOS components

#### Our codebase:
- [Castledice frontend repo](https://github.com/OSTOLEX-Technologies/Castledice-frontend)
- [Castledice smart-contract repo](https://github.com/OSTOLEX-Technologies/Castledice-smart-contract)
- [Cadtledice frontend on BOS repo](https://github.com/OSTOLEX-Technologies/Castledice-BOS-frontend)
- [CastlediceOnline widget](https://near.org/near/widget/ComponentDetailsPage?src=ostolex.near/widget/CastlediceOnline&tab=source)
- [CastleDice widget](https://near.org/near/widget/ComponentDetailsPage?src=ostolex.near/widget/CastleDice&tab=source)
- [CastlediceWaitingRoom](https://near.org/near/widget/ComponentDetailsPage?src=ostolex.near/widget/CastlediceWaitingRoom&tab=source)

## Smart contracts documentation
- **createRoom(address[] players)** -> int, creates a room and returns the room ID.

- **makeMove(int roomId, int row, int col)** -> int, validates and makes a move if it is valid, returns the remaining number of action points for the player (when the player changes, it returns the number of action points for the new player, not 0).

- **getBoardArray(int roomId)** -> int[], returns an array representing the current state of the game board, where 0 represents an empty cell, 1 represents the first (blue) player (top-left corner, first element of the array), 2 represents the red player (last element of the array), and 3 represents a tree.

- **getCurrentPlayerIndex(int roomId)** -> int, returns the index of the current player in the players array provided during room creation.

- **getCurrentPlayerMovesLeft(int roomId)** -> int, returns the number of moves (action points) remaining for the current player.

- **isGameFinished(int roomId)** -> checks if the game has ended.

- **getGameWinner(int roomId)** -> returns the address of the winner if the game has ended (if not, it reverts, so it's better to check first).

- **getRoomIdByAddress(address player)** -> (uint256) obtains the ID of the room in which a user is located based on their address.

- **getMyIndex(int roomId)** -> int, returns player index (first player or second) of a method caller for the specific room. 

## Gamedesign
#### Video review: 
#### Game Design Document 
[GDD(future ideas included)](https://docs.google.com/document/d/11eUU29k8fY7RZMhJjf4DnZyn3PVrBj_iQnW219KFsPc/edit?usp=sharing)
#### Current game rules:


![Rules](https://github.com/OSTOLEX-Technologies/Castledice-frontend/assets/63261287/0fdfa4f4-0a9f-4233-89b5-2afc9850b444)

# Hustle, to roll it to the castle! 
