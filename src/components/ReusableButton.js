const ReusableButton = ({ children, onClick }) => {
  return (
    <div>
      <button className="reusable__button" onClick={onClick}>
        {children}
      </button>
    </div>
  );
};
export default ReusableButton;
