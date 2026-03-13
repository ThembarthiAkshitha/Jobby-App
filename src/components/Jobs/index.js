import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import './index.css'
import JobItem from '../JobItem'
import Sidebar from '../Sidebar'

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    jobsDetails: [],
    searchInput: '',
    // allJobs: [],
    search: '',
    minimumPackage: 0,
    employmentTypes: [],
    locationTypes: [],
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

  onLocationChange = event => {
    const {locationTypes} = this.state
    const {value, checked} = event.target

    let updatedLocationTypes

    if (checked) {
      updatedLocationTypes = [...locationTypes, value]
    } else {
      updatedLocationTypes = locationTypes.filter(each => each !== value)
    }
    this.setState(
      {
        locationTypes: updatedLocationTypes,
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

  onSuccess = updatedJobDetails => {
    const {locationTypes} = this.state
    let filteredList = updatedJobDetails
    if (locationTypes.length > 0) {
      filteredList = updatedJobDetails.filter(job =>
        locationTypes.includes(job.location.toUpperCase()),
      )
    }
    this.setState({
      apiStatus: apiStatusConstants.success,
      jobsDetails: filteredList,
      // allJobs: updatedJobDetails,
    })
  }

  onFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {search = '', minimumPackage = '', employmentTypes = ''} = this.state
    const employmentType = employmentTypes.join(',')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?search=${search}&minimum_package=${minimumPackage}&employment_type=${employmentType}&`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response1 = await fetch(jobsApiUrl, options)
    if (response1.ok) {
      const data1 = await response1.json()
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
      this.onSuccess(updatedJobDetails)
    } else {
      this.onFailure()
    }
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
      <ul className="unorderd-list-container">
        {jobsDetails.map(each => (
          <JobItem details={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderSuccessJobs = () => {
    const {jobsDetails} = this.state
    const {length} = jobsDetails
    return <>{length === 0 ? this.renderNoJobs() : this.renderJobs()}</>
  }

  renderJobsFailure = () => (
    <div className="jobs-failed-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        className="retry-btn"
        onClick={this.getProfileDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {apiStatus, searchInput} = this.state
    return (
      <div className="jobs-main-bg-container">
        <Header />
        <div className="jobs-bottom-container">
          <Sidebar
            onEmploymentTypeChange={this.onEmploymentTypeChange}
            onSalaryChange={this.onSalaryChange}
            onLocationChange={this.onLocationChange}
          />
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
            <div className="job-items-container">
              {apiStatus === apiStatusConstants.inProgress &&
                this.renderLoading()}
              {apiStatus === apiStatusConstants.success &&
                this.renderSuccessJobs()}
              {apiStatus === apiStatusConstants.failure &&
                this.renderJobsFailure()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
