import { Link } from "react-router-dom";

function HomePage() {

  return (
    <div>
      <h1>Root Digital</h1>

      <Link to="/create">
        Create Game
      </Link>
    </div>
  );
}

export default HomePage;