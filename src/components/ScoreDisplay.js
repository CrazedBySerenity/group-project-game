const ScoreDisplay = ({score}) => {
    return(
        <div className="score__container flex-center">
            <p className="score__text">{score}</p>
        </div>
    )
};

export default ScoreDisplay;