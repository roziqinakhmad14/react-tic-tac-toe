import { useState } from 'react'
import PropTypes from 'prop-types'

import Board from './Game'
import playIcon from './assets/play.svg'
import audio0 from './assets/bgm.mp3'
import audio1 from './assets/X turn.mp3'
import audio2 from './assets/O turn.mp3'
import audio3 from './assets/X win.mp3'
import audio4 from './assets/O win.mp3'
import audio5 from './assets/Draw.mp3'

function playAudio(i) {
  document.querySelector(`.audio-${i}`).play()
}

function Audio() {
  return (
    <>
      <audio className='audio-0' src={audio0}></audio>
      <audio className='audio-1' src={audio1}></audio>
      <audio className='audio-2' src={audio2}></audio>
      <audio className='audio-3' src={audio3}></audio>
      <audio className='audio-4' src={audio4}></audio>
      <audio className='audio-5' src={audio5}></audio>
    </>
  )
}

function Score({xScore, oScore, setXScore, setOScore}) {
  function reset() {
    setXScore(0)
    setOScore(0)
  }

  return (
    <div className="score d-none">
      <table>
        <thead>
          <tr>
            <th>X</th>
            <th>O</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{xScore}</td>
            <td>{oScore}</td>
          </tr>
        </tbody>
      </table>
      <button className='reset-score' onClick={reset}>Reset</button>
    </div>
  )
}

Score.propTypes = {
  xScore: PropTypes.number,
  oScore: PropTypes.number,
  setXScore: PropTypes.func,
  setOScore: PropTypes.func
}

function PlayButton({startGame}) {
  function displayGame() {
    document.querySelector('.game').classList.remove('d-none')
    document.querySelector('.score').classList.remove('d-none')
    document.querySelector('.history').classList.remove('d-none')
    document.querySelector('.status').classList.remove('d-none')
    document.querySelector('.play-container').classList.add('d-none')
    
    startGame()
    playAudio(0)

    document.querySelector('.audio-0').addEventListener('ended', () => {
      playAudio(0)
    })
  }

  return (
    <div className='play-container'>
      <button className='play-button' onClick={displayGame}>
        <img src={playIcon} alt="" />
        Play
      </button>
    </div>
  )
}

PlayButton.propTypes = {
  startGame: PropTypes.func
}

function Track({data, index, viewHistory}) {
  return <button className='square' onClick={() => viewHistory(data, index)}>Move #{index}</button>
}

Track.propTypes = {
  data: PropTypes.array,
  index: PropTypes.number,
  viewHistory: PropTypes.func
}

function History({history, viewHistory}) {
  return (
    <div className="history d-none">
      {history.map((h, i) => {
        return <Track key={i} data={h} index={i} viewHistory={viewHistory} />
      })}
    </div>
  )
}

History.propTypes = {
  history: PropTypes.array,
  viewHistory: PropTypes.func
}

function App() {
  const [xScore, setXScore] = useState(0)
  const [oScore, setOScore] = useState(0)
  const [turn, setTurn] = useState('X')
  const [status, setStatus] = useState('Turn')
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [square, setSquare] = useState(Array(9).fill(null))
  const currentSquare = history[history.length - 1]

  function startGame() {
    document.querySelector('.play-again').classList.add('d-none')
    setSquare(Array(9).fill(null))

    if (turn == null) {
      setTurn(Date.now() % 2 == 0 ? 'X' : 'O')
    }

    setHistory([Array(9).fill(null)])
    turn == 'X' ? playAudio(1) : playAudio(2)
    setStatus('Turn')
  }

  function viewHistory(data, index) {
    if (data != currentSquare) {
      setStatus(`View History #${index}`)
      setSquare(data)
    } else {
      const [isPlay, winner] = checkWinner(data)
      if (isPlay == 1) {
        setStatus('Turn')
      } else {
        if (winner != null) {
          setTurn(winner)
          setStatus('Win')
        } else {
          setTurn(null)
          setStatus('Draw')
        }
      }
      setSquare(currentSquare)
    }
  }

  function handlePlay(data, isPlay=1, winner=null) {
    if (isPlay == 0) {
      if (winner != null) {
        setStatus('Win')
        winner == 'X' ? playAudio(3) : playAudio(4)
        winner == 'X' ? setXScore(xScore + 1) : setOScore(oScore + 1)
        setTurn(winner)
      } else {
        playAudio(5)
        setTurn(null)
        setStatus('Draw')
      }
      document.querySelector('.play-again').classList.remove('d-none')
    } else {
      setStatus('Turn')
      if (turn == 'X') {
        playAudio(2)
        setTurn('O')
      } else {
        playAudio(1)
        setTurn('X')
      }
    }
    const updatedHistory = [...history, data]
    setHistory(updatedHistory)
  }

  function checkWinner(data) {
    if (
      data.slice(0, 3).every(d => d == 'X') || 
      data.slice(3, 6).every(d => d == 'X') ||
      data.slice(6, 9).every(d => d == 'X') ||
      [data[0], data[3], data[6]].every(d => d == 'X') ||
      [data[1], data[4], data[7]].every(d => d == 'X') ||
      [data[3], data[5], data[8]].every(d => d == 'X') ||
      [data[0], data[4], data[8]].every(d => d == 'X') ||
      [data[2 ], data[4], data[6]].every(d => d == 'X')
    ) {
      return [0, 'X']
    } else if (
      data.slice(0, 3).every(d => d == 'O') || 
      data.slice(3, 6).every(d => d == 'O') ||
      data.slice(6, 9).every(d => d == 'O') ||
      [data[0], data[3], data[6]].every(d => d == 'O') ||
      [data[1], data[4], data[7]].every(d => d == 'O') ||
      [data[3], data[5], data[8]].every(d => d == 'O') ||
      [data[0], data[4], data[8]].every(d => d == 'O') ||
      [data[2], data[4], data[6]].every(d => d == 'O')
    ) {
      return [0, 'O']
    } else if (data.includes(null)) {
      return [1, null]
    } else {
      return [0, null]
    }
  }

  return (
    <div className='container'>
      <Audio />
      <h1 className='title'>Tic Tac Toe</h1>
      <PlayButton startGame={startGame} />
      <Score xScore={xScore} oScore={oScore} setXScore={setXScore} setOScore={setOScore} />
      <div className="game d-none">
        <Board turn={turn} handlePlay={handlePlay} status={status} square={square} setSquare={setSquare} checkWinner={checkWinner} />
      </div>
      <History history={history} viewHistory={viewHistory} />
      <h2 className='status d-none'>{turn ? `${turn}'s ` : ''}{status}</h2>
      <button className='play-button play-again d-none' onClick={() => startGame()}>
        <img src={playIcon} alt="" />
        Play Again
      </button>
    </div>
  )
}

export default App
