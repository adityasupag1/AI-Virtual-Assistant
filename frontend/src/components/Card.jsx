import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({image}) => {
  const  { 
      serverUrl,
      userData,
      setUserData,
      frontendImage,
      setFrontendImage,
      backendImage,
      setBackendImage,
      selectedImage,
      setSelectedImage } = useContext(userDataContext)
  return (
    <div
    onClick={()=> {
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}
     className={`md:w-38 md:h-70 w-30 h-60 bg-[#030026] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image? "shadow-2xl  shadow-blue-950 border-4  border-white" : null}`}>
    <img 
    src={image} 
    className='h-full object-cover'
    alt="" />
    </div>
  )
}

export default Card