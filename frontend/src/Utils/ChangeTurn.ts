import {doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';

export async function ChangeTurn(roomName:string, gameMode:string) {
    console.log('função changeturn');
    
    const roomRef = doc(db, gameMode, roomName);
    //pega a referencia do documento da sala
    const roomSnap = await getDoc(roomRef);
    //pega os dados do documento da sala
    const roomData = roomSnap.data();
    //pega o que tem dentro da sala
    const nextPlayer = roomData?.currentPlayer === roomData?.player1 ? roomData?.player2 : roomData?.player1;
    //se o jogador atual for o player1 então o proximo é o player2
    //e se o jogador atual não for o player1 então o proximo é o player1

    await updateDoc(roomRef, {
        currentPlayer: nextPlayer
    });
    //atualiza o documento da sala com o proximo jogador
}