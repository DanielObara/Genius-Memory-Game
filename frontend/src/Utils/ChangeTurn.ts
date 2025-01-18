import {doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';

export async function ChangeTurn(roomName:string, gameMode:string) {
    console.log('função changeturn');
    
    const roomRef = doc(db, gameMode, roomName);
    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data();
    const nextPlayer = roomData?.currentPlayer === roomData?.player1 ? roomData?.player2 : roomData?.player1;

    await updateDoc(roomRef, {
        currentPlayer: nextPlayer
    });
}