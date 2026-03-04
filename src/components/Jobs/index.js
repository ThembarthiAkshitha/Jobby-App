import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import './index.css'
import JobItem from '../JobItem'

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
  const {details, onEmploymentTypeChange} = props
  const {employmentTypeId, label} = details
  return (
    <li>
      <input
        type="checkbox"
        id={employmentTypeId}
        onChange={onEmploymentTypeChange}
        value={employmentTypeId}
      />
      <label htmlFor={employmentTypeId}>{label}</label>
    </li>
  )
}
const SalaryTypesListItem = props => {
  const {details, onSalaryChange} = props
  const {salaryRangeId, label} = details
  const onSalary = event => {
    onSalaryChange(event.target.value)
  }
  return (
    <li>
      <input
        type="radio"
        id={salaryRangeId}
        name="salary"
        onChange={onSalary}
        value={salaryRangeId}
      />
      <label htmlFor={salaryRangeId}>{label}</label>
    </li>
  )
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    profileDetails: {},
    jobsDetails: [],
    searchInput: '',
    allJobs: [],
    search: '',
    minimumPackage: 0,
    employmentTypes: [],
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onSearchInputChange = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  onEmploymentTypeChange = event => {
    const {employmentTypes} = this.state
    const {value, checked} = event.target

    let updatedEmploymentTypes

    if (checked) {
      updatedEmploymentTypes = [...employmentTypes, value]
    } else {
      updatedEmploymentTypes = employmentTypes.filter(each => each !== value)
    }
    this.setState(
      {
        employmentTypes: updatedEmploymentTypes,
        apiStatus: apiStatusConstants.inProgress,
      },
      this.getProfileDetails,
    )
  }

  onSalaryChange = value => {
    this.setState(
      {
        minimumPackage: value,
        apiStatus: apiStatusConstants.inProgress,
      },
      this.getProfileDetails,
    )
  }

  onSearchImageClick = () => {
    const {searchInput} = this.state
    this.setState(
      {
        search: searchInput,
        apiStatus: apiStatusConstants.inProgress,
      },
      this.getProfileDetails,
    )
  }

  onSuccess = async (profileDetails, updatedJobDetails) => {
    this.setState({
      apiStatus: apiStatusConstants.success,
      profileDetails,
      jobsDetails: updatedJobDetails,
      allJobs: updatedJobDetails,
    })
  }

  onFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {search, minimumPackage, employmentTypes} = this.state
    const employmentType = employmentTypes.join(',')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const jobsApiUrl = `https://apis.ccbp.in/jobs?search=${search}&minimum_package=${minimumPackage}&employment_type=${employmentType}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileApiUrl, options)
    const response1 = await fetch(jobsApiUrl, options)
    const data1 = await response1.json()
    if (response.ok && response1.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      const updatedJobDetails = data1.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      console.log(`job details: `, updatedJobDetails)
      console.log('user profile:', updatedData)
      this.onSuccess(updatedData, updatedJobDetails)
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

  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderNoJobs = () => (
    <div className="no-jobs-failed-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobs = () => {
    const {jobsDetails} = this.state
    return (
      <>
        {jobsDetails.map(each => (
          <JobItem details={each} key={each.id} />
        ))}
      </>
    )
  }

  renderSuccessJobs = () => {
    const {jobsDetails} = this.state
    const {length} = jobsDetails
    return <>{length === 0 ? this.renderNoJobs() : this.renderJobs()}</>
  }

  renderProfileFailure = () => (
    <div className="render-failure-container">
      <button className="retry-btn">Retry</button>
    </div>
  )

  renderJobsFailure = () => (
    <div className="jobs-failed-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="retry-btn">Retry</button>
    </div>
  )

  render() {
    const {apiStatus, searchInput} = this.state
    return (
      <div className="jobs-main-bg-container">
        <Header />
        <div className="jobs-bottom-container">
          <div className="first-container">
            <div>
              {apiStatus === apiStatusConstants.success &&
                this.renderSuccessProfile()}
              {apiStatus === apiStatusConstants.inProgress &&
                this.renderLoading()}
              {apiStatus === apiStatusConstants.failure &&
                this.renderProfileFailure()}
            </div>
            <hr />
            <div className="unordered-list-container">
              <h1>Types of Employment</h1>
              <ul className="unorderd-list">
                {employmentTypesList.map(each => (
                  <EmploymentTypesListItem
                    details={each}
                    key={each.employmentTypeId}
                    onEmploymentTypeChange={this.onEmploymentTypeChange}
                  />
                ))}
              </ul>
            </div>
            <hr />
            <div className="unordered-list-container">
              <h1>Salary Range</h1>
              <ul className="unorderd-list">
                {salaryRangesList.map(each => (
                  <SalaryTypesListItem
                    details={each}
                    key={each.salaryRangeId}
                    onSalaryChange={this.onSalaryChange}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="second-container">
            <div className="search-input-icon-container">
              <input
                type="search"
                placeholder="Search"
                value={searchInput}
                className="search-input"
                onChange={this.onSearchInputChange}
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSearchImageClick}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <ul>
              {apiStatus === apiStatusConstants.inProgress &&
                this.renderLoading()}
              {apiStatus === apiStatusConstants.success &&
                this.renderSuccessJobs()}
              {apiStatus === apiStatusConstants.failure &&
                this.renderJobsFailure()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
