import './index.css'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'

const SkillItem = props => {
  const {details} = props
  const {imageUrl, name} = details
  return (
    <li className="skill-item-container">
      <img src={imageUrl} className="skill-image" alt={name} />
      <p>{name}</p>
    </li>
  )
}

const apiStatusConstants = {
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const SimilarJobCard = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    // id,
    jobDescription,
    location,
    rating,
    title,
  } = details
  return (
    <li className="similar-job-item-main-bg-container">
      <div className="company-logo-and-position-name-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo-image"
        />
        <div className="role-rating-container">
          <h1 className="job-item-heading">{title}</h1>
          <p>
            <FaStar className="star-color icon-image" /> {rating}
          </p>
        </div>
      </div>
      <div className="description-container">
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
      <div className="similar-job-location-employement-container">
        <p>
          <MdLocationOn className="icon-image" /> {location}
        </p>
        <p>
          <BsBriefcaseFill className="icon-image" />
          {employmentType}
        </p>
      </div>
    </li>
  )
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.inProgress,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  onSuccess = updatedDetails => {
    console.log(updatedDetails)
    const {jobDetails, similarJobs} = updatedDetails
    this.setState({
      apiStatus: apiStatusConstants.success,
      jobDetails,
      similarJobs,
    })
  }

  onFailure = () => {
    this.setState({
      apiStatus: apiStatusConstants.failure,
    })
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const jobDetailsApi = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(jobDetailsApi, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log('specific job item details: ', data)
      const updatedDetails = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: data.job_details.skills.map(each => ({
            imageUrl: each.image_url,
            name: each.name,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }
      this.onSuccess(updatedDetails)
    } else {
      this.onFailure()
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderLoading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  // onRetry = () => {
  //   this.getJobItemDetails()
  // }

  renderJobDetailsFailure = () => (
    <div className="jobs-failed-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        className="retry-btn"
        onClick={this.getJobItemDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      title,
      // id,
      jobDescription,
      location,
      rating,
      packagePerAnnum,
      skills,
      lifeAtCompany,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-details-main-bg-container">
        <Header />
        <div className="job-details-card-bg-container">
          <div className="job-item-main-bg-container">
            <div className="company-logo-and-position-name-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo-image"
              />
              <div className="role-rating-container">
                <h1 className="job-item-heading">{title}</h1>
                <p>
                  <FaStar className="star-color icon-image" /> {rating}
                </p>
              </div>
            </div>
            <div className="location-employement-package-container">
              <div className="location-employement-container">
                <p>
                  <MdLocationOn className="icon-image" /> {location}
                </p>
                <p>
                  <BsBriefcaseFill className="icon-image" />
                  {employmentType}
                </p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="description-container">
              <div className="heading-visit-site-container">
                <h1>Description</h1>
                <a href={companyWebsiteUrl}>Visit</a>
              </div>
              <p>{jobDescription}</p>
            </div>
            <div className="skills-container">
              <h1>Skills</h1>
              <ul className="skills-whole-items-container">
                {skills.map(each => (
                  <SkillItem details={each} key={each.name} />
                ))}
              </ul>
            </div>
            <div className="life-at-company-container">
              <h1>Life at Company</h1>
              <div className="description-image-container">
                <p>{description}</p>
                <img
                  src={imageUrl}
                  className="life-at-image"
                  alt="life at company"
                />
              </div>
            </div>
          </div>
          <div className="similar-jobs-container">
            <h1>Similar Jobs</h1>
            <ul className="similar-cards-unordered-list">
              {similarJobs.map(each => (
                <SimilarJobCard details={each} key={each.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.success:
        return this.renderDetails()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailure()
      default:
        return null
    }
  }
}

export default JobItemDetails
