import { useEffect, useState } from "react";
import axios from "axios";

const leaderBoardStyle = {
  backgroundColor: "black",
  margin: "40px",
  maxWidth: "350px",
  //   width: "100%",
};

const leaderBoardLine = {
  backgroundColor: "#fff",
  width: "5px",
};

const Leaderboard = ({ gameSize, currentScore, gameOver }) => {
  const [sortedScores, setSortedScores] = useState([])
  const [score, setScore] = useState([]);
  const [shouldPostScore, setShouldPostScore] = useState(false); 

  const fetchLeaderBoard = async () => {
    const response = await fetch("http://localhost:6001/topPlayers");
    const data = await response.json();

    setScore(data);
  }

  const saveHighscore = async() => {
    const player = {name: "Player", score: currentScore};
    //axios.delete("http://localhost:6001/topPlayers", sortedScores[sortedScores.length -1]);
    axios.post("http://localhost:6001/topPlayers", player).then(console.log("Player added to highscores"));
    setShouldPostScore(false);
  }

  useEffect(() => {
    if(shouldPostScore){
      saveHighscore();
    }

    fetchLeaderBoard();
  }, [gameOver]);

  useEffect(() => {
    let scoreList = score;
    setSortedScores(scoreList.sort((s1, s2) => s2.score - s1.score));
  }, [score])

  useEffect(() => {
    if(sortedScores.length > 0){
      if(currentScore > sortedScores[sortedScores.length - 1].score){
        setShouldPostScore(true);
      }
    }
  }, [currentScore])

  return (
    <div
      className="leaderboard__container"
      style={{ width: gameSize.width + "px" }}
    >
      <div className="leaderboard__scroreContainer">
        Current score: {currentScore}
      </div>
      {/* <div className="leaderboard__scroreContainer">Highscores</div> */}
      <div className="leaderboard__subcontainer">
        <div style={leaderBoardStyle}>
          {sortedScores.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
        <div style={leaderBoardLine}></div>
        <div style={leaderBoardStyle}>
          {sortedScores.map((item) => (
            <div key={item.id}>{item.score}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
