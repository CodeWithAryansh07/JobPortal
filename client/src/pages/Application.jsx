/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Application = () => {

    const { user } = useUser()

    const { getToken } = useAuth()

    const [isEdit, setIsEdit] = useState(false)

    const [resume, setResume] = useState(null)

    const { backendURL, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

    const updateResume = async () => {        
        
        try {

            const formdata = new FormData()
            formdata.append('resume', resume)

            const token = await getToken()

            const { data } = await axios.post(backendURL+'/api/users/update-resume', formdata, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            // console.log("TMep")

            console.log(data)
            if (data.success) {
                toast.success(data.message)
                await fetchUserData()
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }

        setIsEdit(false)
        setResume(null)
    }

    useEffect(() => {
        if (user) {
            // fetchUserData()
            fetchUserApplications()
        }
    }, [user])

    // useEffect(() => {
    //     // This will log the updated userApplications after the state is set
    //     console.log("Updated userApplications:", userApplications);
    // }, [userApplications]);

    return (
        <>
            <Navbar />
            <div className='container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
                <h2 className='text-xl font-semibold'>Your Resume</h2>
                <div className='flex gap-2 mb-6 mt-3'>
                    {
                        isEdit || userData?.resume === "" ?
                        <>
                            <label className='flex items-center' htmlFor="resumeUpload">
                                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : 'Select Resume'}</p>
                                <input className='cursor-pointer'  id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" name="" hidden  />
                                <img className='cursor-pointer' src={assets.profile_upload_icon} alt="" />
                            </label>
                            <button onClick={updateResume} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>

                        </> :
                        <div className='flex gap-2'>
                            <a target='_blank' className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href={userData?.resume}>Resume</a>
                            <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'> 
                                Edit
                            </button>
                        </div>
                    }
                </div>
                <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
                <table className='min-w-full bg-white border rounded-lg'>
                    <thead>
                        <tr>
                            <th className='py-3 px-4 border-b text-left'>Company</th>
                            <th className='py-3 px-4 border-b text-left'>Job Title</th>
                            <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                            <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                            <th className='py-3 px-4 border-b text-left'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userApplications && userApplications.length > 0 ? (
                                userApplications.map((job, index) => (
                                    <tr key={index}>
                                        <td className='py-3 px-4 flex items-center gap-2 border-b'>
                                            <img className='w-8 h-8' src={job.companyId.image} alt="" />
                                            {job.companyId.name}
                                        </td>
                                        <td className='py-2 px-4 border-b'>{job.jobId.title}</td>
                                        <td className='py-2 px-4 border-b max-sm:hidden'>{job.jobId.location}</td>
                                        <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                                        <td className='py-2 px-4 border-b'>
                                            <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded-lg`}>{job.status}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-3 px-4 border-b">
                                        Loading.....
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>

                </table>
            </div>
            <Footer />
        </>
    )
}

export default Application
