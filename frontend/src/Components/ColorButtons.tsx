interface Props {
    Sequencia: (color: string) => void
}
const ColorButtons = ({Sequencia}: Props) => {
  return (
    <div>
        <div className='Buttons'>
            <button className="Red" onClick={() => { Sequencia('Red') }}>Red</button>
            <button className="Yellow" onClick={() => { Sequencia('Yellow') }}>Yellow</button>
        </div>
        <div className='Buttons'>
            <button className="Green" onClick={() => { Sequencia('Green') }}>Green</button>
            <button className="Blue" onClick={() => { Sequencia('Blue') }}>Blue</button>
        </div>
    </div>
  )
}

export default ColorButtons