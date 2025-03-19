import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ArticleByID() {

  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [currentArticle,setCurrentArticle]=useState(state)
  const [commentStatus,setCommentStatus]=useState('')
  //console.log(state)

  // Check if current user is the author of the article
  const isAuthorOfArticle = currentUser?.email === currentArticle?.authorData?.email

  //to enable edit of article
  function enableEdit() {
    setEditArticleStatus(true)
  }


  //to save modified article
  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...state, ...modifiedArticle }
    const token = await getToken()
    const currentDate = new Date();
    //add date of modification
    articleAfterChanges.dateOfModification = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()

    //make http post req
    let res = await axios.put(`http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

    if (res.data.message === 'article modified') {
      //change edit article status to false
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload })
    }


  }


  //add comment by user
  async function addComment(commentObj){
    //add name of user to comment obj
    commentObj.nameOfUser=currentUser.firstName;
    console.log(commentObj)
    //http put
    let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj);
    if(res.data.message==='comment added'){
      setCommentStatus(res.data.message)
    }
  }


  // Delete article function
  async function deleteArticle() {
    if (!isAuthorOfArticle) {
      toast.error("You don't have permission to delete this article")
      return
    }
    
    state.isArticleActive = false
    let res = await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`, state)
    if (res.data.message === 'article deleted or restored') {
      setCurrentArticle(res.data.payload)
      toast.success("Article deleted successfully")
    }
  }

  // Restore article function
  async function restoreArticle() {
    if (!isAuthorOfArticle) {
      toast.error("You don't have permission to restore this article")
      return
    }
    
    state.isArticleActive = true
    let res = await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`, state)
    if (res.data.message === 'article deleted or restored') {
      setCurrentArticle(res.data.payload)
      toast.success("Article restored successfully")
    }
  }

  return (
    <div className="article-detail-container">
      <div className="article-content">
        {!editArticleStatus ? (
          <>
            <h1 className="article-title">{currentArticle.title}</h1>
            <div className="article-meta">
              <p>By {currentArticle.authorData.nameOfAuthor}</p>
              <p>Created: {currentArticle.dateOfCreation}</p>
            </div>
            <div className="article-text">{currentArticle.content}</div>
            <div className="d-flex justify-content-between">
              <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
                <div>
                  <span className="py-3">
                    <small className="text-secondary me-4">
                      Modified on: {currentArticle.dateOfModification}
                    </small>
                  </span>

                </div>
                {/* author details */}
                <div className="author-details text-center">
                  <img src={currentArticle.authorData.profileImageUrl} width='60px' className='rounded-circle' alt="" />
                </div>

              </div>
              {/* Show edit & delete buttons only if current user is the author */}
              {isAuthorOfArticle && (
                <div className="d-flex me-3">
                  <button className="edit-button me-2" onClick={enableEdit}>
                    <FaEdit />
                    Edit
                  </button>
                  {currentArticle.isArticleActive ? (
                    <button className="delete-button" onClick={deleteArticle}>
                      <MdDelete />
                      Delete
                    </button>
                  ) : (
                    <button className="edit-button" onClick={restoreArticle}>
                      <MdRestore />
                      Restore
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* user commnets */}
            <div>
              <div className="comments my-4">
                {
                  currentArticle.comments.length === 0 ? <p className='display-3'>No comments yet..</p> :
                    currentArticle.comments.map(commentObj => {
                      return <div key={commentObj._id} >
                        <p className="user-name">
                          {commentObj?.nameOfUser}
                        </p>
                        <p className="comment">
                          {commentObj?.comment}
                        </p>
                      </div>
                    })
                }
              </div>
            </div>
            {/* comment form */}
            <h6>{commentStatus}</h6>
            {
              currentUser.role==='user'&&<form onSubmit={handleSubmit(addComment)} >
                <input type="text"  {...register("comment")} className="form-control mb-4" />
                <button className="btn btn-success">
                  Add a comment
                </button>
              </form>
            }
          </>
        ) : (
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={currentArticle.title}
                {...register("title")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={currentArticle.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content")}
                className="form-control"
                id="content"
                rows="10"
                defaultValue={currentArticle.content}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ArticleByID