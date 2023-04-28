const Asteroid = ({pos, top, size}) => {
    let asteroidStyle = {
        left: `${pos}px`,
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}px`,
      };

    return(
        <>
        <div style={asteroidStyle} className="asteroid"></div>
        </>
    );
};

export default Asteroid;