import React, { useContext, useState } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { IoMdArrowBack } from "react-icons/io";

import { useRef } from "react";
import { userDataContext } from "../context/userContext";
import {  useNavigate } from "react-router-dom";

const images = [image1, image2, image3, image4, image5, image6, image7];

const Customize = () => {

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

  const inputImage= useRef();
  const navigate = useNavigate();
  const handleImage = (e)=>{
    const file = e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
	return (
		<div className="w-full min-h-screen bg-linear-to-t relative from-black to-[#030353] flex justify-center items-center flex-col">
			
        <IoMdArrowBack 
            onClick={()=>navigate('/')}
            className="cursor-pointer absolute top-7.25 left-7.25 text-white w-6 h-6" />
            

				{/* Page heading */}
				<h1 className="text-white text-3xl font-semibold text-center  p-5 mb-7.25 ">
					Choose Your <span className="text-blue-200"> Assistant</span>
				</h1>

				{/* Cards grid */}
				<div className=" w-full max-w-225  flex flex-wrap justify-center items-center gap-4">
					{images.map((img, index) => (
						<Card key={index} image={img} />
					))}
					<div 
          onClick={ ()=>{
            inputImage.current.click()
            setSelectedImage("input")
          }
            
          }
          className={`md:w-38 md:h-70 w-30 h-60 bg-[#030026] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage=="input"? "shadow-2xl  shadow-blue-950 border-4  border-white" : null}`}>
          {!frontendImage && 	<RiImageAddLine className="text-white w-6 h-6" />}
          {frontendImage && <img src={frontendImage} className="h-full object-cover "/>}
					</div>
        <input 
        type="file" 
        accept="image/*" 
        hidden ref={inputImage}
        onChange={handleImage}  />
				</div>

         {selectedImage  && 
          <button  
          onClick={()=>navigate("/customize2")}
          className="min-w-37.5 h-15 cursor-pointer text-black mt-7.5 font-semibold text-[19px] rounded-full bg-white"
          >Next</button>}
		</div>
	);
};

export default Customize;
