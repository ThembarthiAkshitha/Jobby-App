import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="home-main-bg-container">
    <Header />
    <div className="home-description-card-container">
      <h1>Find The Job That Fits Your Life</h1>
      <p>
        Millions of people are searching for jobs, salary inforamation, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs" className="link-style">
        <button className="find-jobs-btn" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
