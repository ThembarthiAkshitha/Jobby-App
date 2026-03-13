import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showErrorMsg: false,
    showErrorMsgText: '',
  }

  onUsername = event => {
    this.setState({
      usernameInput: event.target.value,
    })
  }

  onPassword = event => {
    this.setState({
      passwordInput: event.target.value,
    })
  }

  onSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 7})
    const {history} = this.props
    history.replace('/')
  }

  onFailure = errMsg => {
    this.setState({
      showErrorMsg: true,
      showErrorMsgText: errMsg,
    })
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const newUser = {
      username: usernameInput,
      password: passwordInput,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(newUser),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {
      usernameInput,
      passwordInput,
      showErrorMsg,
      showErrorMsgText,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-main-bg-container">
        <div className="login-form-card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo-image"
          />
          <form onSubmit={this.onFormSubmit}>
            <label htmlFor="username">USERNAME</label>
            <br />
            <input
              type="text"
              id="username"
              onChange={this.onUsername}
              value={usernameInput}
              className="input"
              placeholder="Username"
            />
            <br />
            <label htmlFor="password">PASSWORD</label>
            <br />
            <input
              type="password"
              id="password"
              onChange={this.onPassword}
              value={passwordInput}
              className="input"
              placeholder="Password"
            />
            <br />
            <button type="submit" className="submit-btn">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">*{showErrorMsgText}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
