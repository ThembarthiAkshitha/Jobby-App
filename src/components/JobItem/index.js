import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = details
  return (
    <li className="job-item-main-bg-container">
      <Link to={`/jobs/${id}`} className="link-style">
        <div className="company-logo-and-position-name-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
