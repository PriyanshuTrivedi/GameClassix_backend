const usedRoomIds=new Set();
const roomPlayers = {
    "bingo":{},
    "dotAndBoxes":{},
    "ticTacToe":{}
};
const isGameStartedForRoom={
    "bingo":{},
    "dotAndBoxes":{},
    "ticTacToe":{}
};
const maxPlayersInGame={
    "bingo":4,
    "dotAndBoxes":4,
    "ticTacToe":2
}

module.exports={
    usedRoomIds,
    roomPlayers,
    isGameStartedForRoom,
    maxPlayersInGame
}