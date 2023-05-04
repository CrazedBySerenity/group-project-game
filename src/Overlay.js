import ScoreDisplay from "./ScoreDisplay";

const Overlay = (props) => {

    if(props.gameOver){
        return(
            <div className="wh-100 flex-center">
                <div className="game-over__container flex-center">
                    <p className="game-over__text">Game over!</p>
                    <div>
                        <p className="game-over__text">Score:</p>
                        <p className="game-over__text">{props.score}</p>
                    </div>

                </div>
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