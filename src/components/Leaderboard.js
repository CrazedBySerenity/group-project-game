import { useEffect, useState } from "react";
import scoresData from "../data/scores";

const leaderBoardStyle = {
  backgroundColor: "black",
  margin: "20px",
  maxWidth: "250px",
  width: "100%",
};

const leaderBoardLine = {
  backgroundColor: "#fff",
  width: "5px",
};

const Leaderboard = () => {
  const [score, setScore] = useState(scoresData);

  useEffect(() => {
    let sortedScores = score.sort((s1, s2) =>
      s1.score < s2.score ? 1 : s1.score > s2.score ? -1 : 0
    );

    setScore(sortedScores);
    console.log(sortedScores);
  }, []);

  return (
    <div className="leaderboard__container">
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
  );
};

export default Leaderboard;
