import React from 'react'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
function UserProfile() {
  return (
<div>
  <ul className='d-flex justify-content-around list-unstyled fs-1'>
    <li className='nav-item'>
      <Link to='articles' className='nav-link'>Articles</Link>
    </li>
  </ul>
  <div className='mt-5'>
    <Outlet/>
  </div>
</div>
  )
}

export default UserProfile