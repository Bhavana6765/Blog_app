import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import './Home.css'; // Import the CSS

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSelectRole(e) {
    setError('');
    const selectedRole = e.target.value;
    currentUser.role = selectedRole;
    let res = null;
    try {
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:4000/author-api/author', currentUser);
        let { message, payload } = res.data;
        if (message === 'author') {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
      if (selectedRole === 'user') {
        res = await axios.post('http://localhost:4000/user-api/user', currentUser);
        let { message, payload } = res.data;
        if (message === 'user') {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn === true) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  return (
    <div className='container'>
      {isSignedIn === false && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <motion.img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTG1LW-o46L89kVB2prwNmWNpXYH5nU-2qeg&s"
            alt="Tech Explorer"
            className="img-fluid mx-auto d-block w-100 mb-4"
            style={{ maxWidth: "600px" }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            className="bg-warning text-dark text-center py-2 mb-4 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h5 className="mb-0">🚀 Empowering Your Tech Journey – Learn, Code, Innovate!</h5>
          </motion.div>

          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            Welcome to <strong>Tech Explorer Hub</strong> – where passion for technology meets actionable knowledge.
          </motion.p>

          <motion.ul className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
            <li>🧠 Deep dives into Artificial Intelligence & Machine Learning</li>
            <li>👨‍💻 Full-stack development guides and real-world coding challenges</li>
            <li>🔒 Security essentials and staying safe in the digital realm</li>
            <li>📈 Data-driven decision making with analytics and visualization</li>
            <li>🎯 Career roadmaps, interview prep, and tech industry trends</li>
          </motion.ul>

          <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5 }}>
            Join a growing community of learners and creators. Sharpen your skills, explore innovations, and stay ahead in the tech frontier.
          </motion.p>
        </motion.div>
      )}

      {isSignedIn === true && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className='d-flex justify-content-evenly align-items-center bg-light p-3 rounded'>
            <motion.img src={user.imageUrl} width="100px" className='rounded-circle' alt="User Avatar" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} />
            <motion.p className="display-6 text-dark" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              Welcome, {user.firstName}!
            </motion.p>
            <motion.p className="lead text-muted" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              {user.emailAddresses[0].emailAddress}
            </motion.p>
          </div>

          <motion.p className="lead mt-4 text-center text-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            Choose how you'd like to contribute:
          </motion.p>

          {error.length !== 0 && (
            <motion.p className="text-danger fs-5 text-center" style={{ fontFamily: "sans-serif" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
              ⚠️ {error}
            </motion.p>
          )}

          <div className='d-flex role-radio py-3 justify-content-center'>
            <motion.div className="form-check me-4" whileHover={{ scale: 1.1 }}>
              <input type="radio" name="role" id="author" value="author" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="author" className="form-check-label">📚 Author</label>
            </motion.div>
            <motion.div className="form-check" whileHover={{ scale: 1.1 }}>
              <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
              <label htmlFor="user" className="form-check-label">🧑‍💻 User</label>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Home;
