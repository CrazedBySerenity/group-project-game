import ScoreDisplay from "./ScoreDisplay";

const Overlay = (props) => {

    if(props.gameOver){
        return(
            <div className="game-over__container flex-center">
                <p className="game-over__text">Game over!</p>
                <p className="game-over__text">Your score was: {props.score}</p>
            </div>
        );
    }

    return(
        <div>
            <ScoreDisplay score={props.score}/>
        </div>
    );
};

export default Overlay;