import PropTypes from 'prop-types'

function Square({value, onSquareClick}) {
  return <button className='square' value={value} onClick={onSquareClick}>{value}</button>
}

Square.propTypes = {
  value: PropTypes.number,
  onSquareClick: PropTypes.func
}

function Board({turn, handlePlay, square, setSquare, status, checkWinner}) {
  function handleClick(i) {
    if (square[i] == null && status == 'Turn') {
      const nextSquare = square.slice()
      nextSquare[i] = turn
      setSquare(nextSquare)
      const [isPlay, winner] = checkWinner(nextSquare)
      handlePlay(nextSquare, isPlay, winner)
    }
  }

  return (
    <div className='board'>
      <Square value={square[0]} onSquareClick={() => handleClick(0)} />
      <Square value={square[1]} onSquareClick={() => handleClick(1)} />
      <Square value={square[2]} onSquareClick={() => handleClick(2)} />
      <Square value={square[3]} onSquareClick={() => handleClick(3)} />
      <Square value={square[4]} onSquareClick={() => handleClick(4)} />
      <Square value={square[5]} onSquareClick={() => handleClick(5)} />
      <Square value={square[6]} onSquareClick={() => handleClick(6)} />
      <Square value={square[7]} onSquareClick={() => handleClick(7)} />
      <Square value={square[8]} onSquareClick={() => handleClick(8)} />
    </div>
  )
}

Board.propTypes = {
  turn: PropTypes.any,
  handlePlay: PropTypes.func,
  square: PropTypes.array,
  setSquare: PropTypes.func,
  status: PropTypes.any,
  checkWinner: PropTypes.func
}

export default Board