export type RoomParams = {
    roomname: string;
};
  
export type RoomData = {
    playersChoices: string[];
    createdBy: string;
    currentPlayer: string;
    gameChoice: string[];
    player1: string;
    player1Img: string;
    player2: string;
    player2Img: string;
    round: number;
};
  
export type PlayersInfos = {
    player1Name: string;
    player1Img: string;
    player2Name: string;
    player2Img: string;
};