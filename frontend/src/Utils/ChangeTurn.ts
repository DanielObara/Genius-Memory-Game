import {doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';

export async function ChangeTurn(roomName:string, gameMode:string) {
    
    const roomRef = doc(db, gameMode, roomName);
    //get room document reference
    const roomSnap = await getDoc(roomRef);
    //get the room document data
    const roomData = roomSnap.data();
    //take what's inside the room
    const nextPlayer = roomData?.currentPlayer === roomData?.player1 ? roomData?.player2 : roomData?.player1;
    //if the current player is player1 then the next one is player2
    //if the current player is not player1 then the next one is player1

    await updateDoc(roomRef, {
        currentPlayer: nextPlayer
    });
    //updates the room document with the next player
}