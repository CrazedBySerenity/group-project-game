import { useEffect, useState } from "react";
import scoresData from "../data/scores";

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
  const [score, setScore] = useState([]);

  const fetchLeaderBoard = async () => {
    const response = await fetch("http://localhost:6001/topPlayers");
    const data = await response.json();

    setScore(data);
  }

  useEffect(() => {
    fetchLeaderBoard();

    let sortedScores = score.sort((s1, s2) =>
      s1.score < s2.score ? 1 : s1.score > s2.score ? -1 : 0
    );

    setScore(sortedScores);
    console.log(sortedScores);
  }, [gameOver]);

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
          {score.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
        <div style={leaderBoardLine}></div>
        <div style={leaderBoardStyle}>
          {score.map((item) => (
            <div key={item.id}>{item.score}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
