import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogoutClick = () => {
    const {history} = props
    console.log(history)
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="header-main-bg-container">
      <ul className="unordered-list">
        <Link to="/" className="link-style">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-image"
            />
          </li>
        </Link>
        <Link to="/" className="link-style">
          <li>Home</li>
        </Link>
        <Link to="/jobs" className="link-style">
          <li>Jobs</li>
        </Link>
      </ul>
      <button className="log-out-btn" onClick={onLogoutClick} type="button">
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
