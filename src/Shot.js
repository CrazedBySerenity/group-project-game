const Shot = ({ pos, top, height, width }) => {
  let shotStyle = {
    left: `${pos}px`,
    width: `${width}px`,
    height: `${height}px`,
    top: `${top}px`,
  };

  return (
    <>
      <div style={shotStyle} className="shot"></div>
    </>
  );
};

export default Shot;
