const ReusableButton = ({ children, onClick, type }) => {
  return (
    <div>
      <button type={type} className="reusable__button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
};
export default ReusableButton;
