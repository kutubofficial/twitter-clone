import AddBoxIcon from '@mui/icons-material/AddBox';
import '../pages.css'
const More = () => {
  return (
     <div className="notification-page">
      <div className="container">
        <h2>See more</h2>
        <AddBoxIcon />
      </div>
      <hr />
      <div className="no-notifications">
        <h4>No More</h4>
      </div>
    </div>
  )
}

export default More