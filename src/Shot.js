const Shot = ({ pos, top, size }) => {
  let shotStyle = {
    left: `${pos}px`,
    width: `${size}px`,
    height: `${size}px`,
    top: `${top}px`,
  };

  return (
    <>
      <div style={shotStyle} className="shot"></div>
    </>
  );
};

export default Shot;
