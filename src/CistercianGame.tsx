import React, { useState, useEffect, useRef, useCallback } from 'react';
import { drawCistercianNumeral } from './drawingModule';
import backgroundImage from './assets/parchment_background.jpg'; // Adjust path if needed
import './CistercianGame.css';

const CANVAS_SIZE = 300; // Ensure this matches your existing CANVAS_SIZE
const MAX_HISTOGRAM_SECONDS = 10; // Add this line or adjust the value as needed

const CistercianGame: React.FC = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [currentNumber, setCurrentNumber] = useState(0);
    const [userGuess, setUserGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [runningTime, setRunningTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [histogram, setHistogram] = useState<number[]>(new Array(MAX_HISTOGRAM_SECONDS).fill(0));
    const [lastWrongGuess, setLastWrongGuess] = useState<string | null>(null);
    const [background, setBackground] = useState<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const generateNewNumber = () => {
        return Math.floor(Math.random() * 10000);
    };

    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setCorrectGuesses(0);
        setTotalTime(0);
        setRunningTime(0);
        setStartTime(Date.now());
        setCurrentNumber(generateNewNumber());
        setHistogram(new Array(MAX_HISTOGRAM_SECONDS).fill(0));
        setLastWrongGuess(null);
        setUserGuess('');  // Clear the user's guess
        startTimer();
    };

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setRunningTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserGuess(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        checkGuess();
    };

    const checkGuess = () => {
        if (gameStarted && !gameOver) {
            const guess = parseInt(userGuess);
            if (isNaN(guess)) {
                // Handle invalid input
                return;
            }
            if (guess === currentNumber) {
                const guessTime = (Date.now() - startTime) / 1000;
                setCorrectGuesses(prev => prev + 1);
                setTotalTime(prev => prev + guessTime);
                updateHistogram(guessTime);
                setStartTime(Date.now());
                setCurrentNumber(generateNewNumber());
                setUserGuess('');
                setLastWrongGuess(null);
            } else {
                setGameOver(true);
                stopTimer();
                setLastWrongGuess(userGuess);
            }
        }
    };

    const updateHistogram = (time: number) => {
        const index = Math.min(Math.floor(time), MAX_HISTOGRAM_SECONDS - 1);
        setHistogram(prev => {
            const newHistogram = [...prev];
            newHistogram[index]++;
            return newHistogram;
        });
    };

    const drawGameState = useCallback(() => {
        if (canvasRef.current && background) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                // Only draw the background if it has changed or canvas was cleared
                if (ctx.getImageData(0, 0, 1, 1).data[3] === 0) {
                    ctx.drawImage(background, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
                }
                drawCistercianNumeral(canvasRef.current, currentNumber);
            }
        }
    }, [background, currentNumber]);

    useEffect(() => {
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => {
            setBackground(img);
        };
    }, []);

    useEffect(() => {
        if (background) {
            drawGameState();
        }
    }, [background, currentNumber, drawGameState]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const renderHistogram = () => {
        const maxHeight = Math.max(...histogram);
        return (
            <div className="histogram">
                {histogram.map((count, index) => (
                    <div key={index} className="histogram-column">
                        <div className="histogram-bars">
                            {Array(maxHeight).fill(0).map((_, i) => (
                                <div key={i} className={`histogram-square ${i < count ? 'filled' : ''}`}>
                                    {i < count ? '□' : ''}
                                </div>
                            ))}
                        </div>
                        <div className="histogram-label">{index + 1}"</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="cistercian-game-container">
            {!gameStarted && !gameOver && (
                <button onClick={startGame} className="start-button">START GAME</button>
            )}
            {(gameStarted || gameOver) && (
                <>
                    <div className="timer">Time: {runningTime} seconds</div>
                    <canvas 
                        ref={canvasRef} 
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
                    />
                    {gameStarted && !gameOver && (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="number"
                                value={userGuess}
                                onChange={handleInputChange}
                                placeholder="Enter your guess"
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                    {gameOver && (
                        <>
                            <div className="game-over">GAME OVER</div>
                            {lastWrongGuess && (
                                <div className="wrong-guess">
                                    Wrong, it was {currentNumber} not {lastWrongGuess}
                                </div>
                            )}
                        </>
                    )}
                    <div className="stats">
                        <p>Correct Guesses: {correctGuesses}</p>
                        <p>Avg. Time per Guess: {correctGuesses > 0 ? (totalTime / correctGuesses).toFixed(2) : '0'} seconds</p>
                    </div>
                    {gameOver && (
                        <div className="play-again-container">
                            <button onClick={startGame} className="play-again-button">Play Again</button>
                        </div>
                    )}
                    {gameOver && renderHistogram()}
                </>
            )}
        </div>
    );
};

export default CistercianGame;