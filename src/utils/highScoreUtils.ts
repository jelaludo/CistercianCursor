export interface HighScore {
    score: number;
    name: string;
}

export const readHighScore = (): HighScore => {
    const storedScore = localStorage.getItem('highScore');
    const storedName = localStorage.getItem('highScoreName');
    return {
        score: storedScore ? parseInt(storedScore, 10) : 0,
        name: storedName || 'AAAA'
    };
};

export const writeHighScore = (score: number, name: string): void => {
    localStorage.setItem('highScore', score.toString());
    localStorage.setItem('highScoreName', name);
};

export const getTopScores = (): HighScore[] => {
    const topScores = localStorage.getItem('topScores');
    return topScores ? JSON.parse(topScores) : [];
};

export const updateTopScores = (newScore: HighScore): void => {
    const topScores = getTopScores();
    topScores.push(newScore);
    topScores.sort((a, b) => b.score - a.score);
    const updatedTopScores = topScores.slice(0, 20); // Keep only top 20 scores
    localStorage.setItem('topScores', JSON.stringify(updatedTopScores));
};