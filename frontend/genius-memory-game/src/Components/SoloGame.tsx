import { useEffect, useState } from 'react'

function SoloGame() {
  const coresDisponiveis = ['Vermelho', 'Amarelo', 'Verde', 'Azul'];
    const [cores, setCores] = useState<string[]>([])
    const [escolhasDoPlayer, setEscolhasDoPlayer] = useState<string[]>([]);
    var [rodada, setRodada] = useState(1)
    
    var numeroAleatorio = Math.floor(4* Math.random())
    const corSelecionada = coresDisponiveis[numeroAleatorio];

    useEffect(() => { 
        console.log(numeroAleatorio);
        setCores(cores.concat(corSelecionada));

    },[rodada] )
    console.log(cores);
  
  
    function Sequencia(corEscolhidaPeloPlayer:string) {

        setEscolhasDoPlayer(escolhasDoPlayer.concat(corEscolhidaPeloPlayer));
        
        const acerto = corEscolhidaPeloPlayer === cores[escolhasDoPlayer.length];
        console.log(escolhasDoPlayer);
            if (acerto) {
                console.log('acertou mizeravi');
                if (escolhasDoPlayer.length + 1 === cores.length) {
                    setRodada(rodada + 1);
                    setEscolhasDoPlayer([]);
                    
                  }
            }else{
                console.log('errou :(');
                
                if (rodada !== 1) {
                    setRodada(1)
                    setCores([])
                    setEscolhasDoPlayer([])
                }else{
                    setRodada(1)
                    setCores([cores[0]])
                    setEscolhasDoPlayer([])
                }
            }
    }

    return (
      <>
        <h1>Rodada {rodada}</h1>
        <h1>cor: {cores}</h1>
        <div className="card">
        <button onClick={()=>{Sequencia('Vermelho')}}>Vermelho</button>
        <button onClick={()=>{Sequencia('Amarelo')}}>Amarelo</button>
        <button onClick={()=>{Sequencia('Verde')}}>Verde</button>
        <button onClick={()=>{Sequencia('Azul')}}>Azul</button>
          
        </div>
        
      </>
    )
}

export default SoloGame