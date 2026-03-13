import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const employmentLocationList = [
  {
    label: 'Hyderabad',
    employmentLocationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    employmentLocationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    employmentLocationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    employmentLocationId: 'DELHI',
  },
  {
    label: 'Mubai',
    employmentLocationId: 'MUMBAI',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const EmploymentTypesListItem = props => {
  const {details, onEmploymentType} = props
  const {employmentTypeId, label} = details
  return (
    <li>
      <input
        type="checkbox"
        id={employmentTypeId}
        onChange={onEmploymentType}
        value={employmentTypeId}
      />
      <label htmlFor={employmentTypeId}>{label}</label>
    </li>
  )
}
const LocationTypesListItem = props => {
  const {details, onLocationType} = props
  const {employmentLocationId, label} = details
  return (
    <li>
      <input
        type="checkbox"
        id={employmentLocationId}
        onChange={onLocationType}
        value={employmentLocationId}
      />
      <label htmlFor={employmentLocationId}>{label}</label>
    </li>
  )
}
const SalaryTypesListItem = props => {
  const {details, onSalary} = props
  const {salaryRangeId, label} = details
  const onSalaryItem = event => {
    onSalary(event.target.value)
  }
  return (
    <li>
      <input
        type="radio"
        id={salaryRangeId}
        name="salary"
        onChange={onSalaryItem}
        value={salaryRangeId}
      />
      <label htmlFor={salaryRangeId}>{label}</label>
    </li>
  )
}

class Sidebar extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    profileDetails: {},
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onSuccess = async profileDetails => {
    this.setState({
      apiStatus: apiStatusConstants.success,
      profileDetails,
    })
  }

  onFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const response = await fetch(profileApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      console.log('user profile:', updatedData)
      this.onSuccess(updatedData)
    } else {
      this.onFailure()
    }
  }

  renderSuccessProfile = () => {
    const {profileDetails} = this.state
    const {name, shortBio, profileImageUrl} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} className="profile-image" alt="profile" />
        <h1 className="profile-name-heading">{name}</h1>
        <p className="bio-description">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="render-failure-container">
      <button
        className="retry-btn"
        onClick={this.getProfileDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  // eslint-disable-next-line class-methods-use-this
  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onEmploymentType = value => {
    const {onEmploymentTypeChange} = this.props
    onEmploymentTypeChange(value)
  }

  onSalary = value => {
    const {onSalaryChange} = this.props
    onSalaryChange(value)
  }

  onLocationType = value => {
    const {onLocationChange} = this.props
    onLocationChange(value)
  }

  render() {
    const {apiStatus} = this.state
    return (
      <div className="side-bar-main-bg-container">
        <div>
          {apiStatus === apiStatusConstants.success &&
            this.renderSuccessProfile()}
          {apiStatus === apiStatusConstants.inProgress && this.renderLoading()}
          {apiStatus === apiStatusConstants.failure &&
            this.renderProfileFailure()}
        </div>
        <hr />
        <div className="unordered-list-container">
          <h1 className="unordered-list-heading">Type of Employment</h1>
          <ul className="unorderd-list">
            {employmentTypesList.map(each => (
              <EmploymentTypesListItem
                details={each}
                key={each.employmentTypeId}
                onEmploymentType={this.onEmploymentType}
              />
            ))}
          </ul>
        </div>
        <hr />
        <div className="unordered-list-container">
          <h1 className="unordered-list-heading">Salary Range</h1>
          <ul className="unorderd-list">
            {salaryRangesList.map(each => (
              <SalaryTypesListItem
                details={each}
                key={each.salaryRangeId}
                onSalary={this.onSalary}
              />
            ))}
          </ul>
        </div>
        <hr />
        <div className="unordered-list-container">
          <h1 className="unordered-list-heading">Locations</h1>
          <ul className="unorderd-list">
            {employmentLocationList.map(each => (
              <LocationTypesListItem
                details={each}
                key={each.employmentLocationId}
                onLocationType={this.onLocationType}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Sidebar
