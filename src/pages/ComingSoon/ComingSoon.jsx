import "./ComingSoon.css";

function ComingSoon({ icon: Icon, title, description }) {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-icon">
        <Icon />
      </div>

      <h1>{title}</h1>

      <p>{description}</p>
    </div>
  );
}

export default ComingSoon;
