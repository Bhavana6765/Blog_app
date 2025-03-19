import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // adjust the path as needed
import { useClerk, useUser } from '@clerk/clerk-react';
import { userAuthorContextObj } from '../../contexts/UserAuthorContext';

function Header() {
    const { signOut } = useClerk();
    const { isSignedIn, user, isLoaded } = useUser();
    const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
    const navigate = useNavigate();
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('admin'));

    useEffect(() => {
        setIsAdminLoggedIn(localStorage.getItem('admin'));
    }, [localStorage.getItem('admin')]);

    const adminData = isAdminLoggedIn ? JSON.parse(isAdminLoggedIn) : null;

    async function handleSignout() {
        await signOut();
        setCurrentUser(null);
        localStorage.removeItem('admin');
        navigate('/');
    }

    return (
        <div>
            <nav className='header d-flex justify-content-between'>
                <div className="d-flex justify-content-center w-30 h-30">
                    <Link to='/'>
                        <img src={logo} alt="" width="60px" className="ms-4 rounded-circle" />
                    </Link>
                </div>
                <ul className='d-flex justify-content-around header-Links list-unstyled py-2'>
                    {isAdminLoggedIn ? (
                        <div className='user-button d-flex justify-content-between'>
                            <div style={{ position: 'relative' }}>
                                <p className='role' style={{ position: 'absolute', top: '0px', right: '-20px' }}>Admin</p>
                                <p className=' user-name 'style={{padding:'4px'}}>{adminData.email}</p>
                            </div>
                            <button className=" mx-3 my-4 btn btn-danger btn-sm" onClick={handleSignout}>Sign Out</button>
                        </div>
                    ) : (
                        !isSignedIn ?
                            <>
                                <li>
                                    <Link to=''>Home</Link>
                                </li>
                                <li>
                                    <Link to='signin'>Signin</Link>
                                </li>
                                <li>
                                    <Link to='signup'>Signup</Link>
                                </li>
                            </> :
                            <div className='user-button d-flex justify-content-between'>
                                <div style={{ position: 'relative' }}>
                                    <img src={user.imageUrl} width='40px' className='rounded-circle' alt='' />
                                    <p className='role' style={{ position: 'absolute', top: '0px', right: '-20px' }}>{currentUser.role}</p>
                                    <p className=' user-name'>{user.firstName}</p>
                                </div>
                                <button className=" mx-3 my-4 btn btn-danger btn-sm" onClick={handleSignout}>Signout</button>
                            </div>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Header;