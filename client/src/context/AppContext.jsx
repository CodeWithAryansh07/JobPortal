/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
// import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    
    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: '',
    })

    const [isSearched, setIsSearched] = useState(false);

    const [jobs, setJobs] = useState([ ])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    
    const [companyData, setCompanyData] = useState(null)

    const [ userData, setUserData] = useState(null)

    const [ userApplications, setUserApplications ] = useState([])


    // Function to fetch Jobs data
    const fetchJobs = async () => {

        try {
            
            const { data } = await axios.get(backendURL+'/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
        
        // setJobs(jobsData)
    }
    // FUnction to fetch company data

    const fetchCompanyData = async () => {
        try {
            
            const {data} = await axios.get(backendURL + '/api/company/company', {headers: {token: companyToken}})

            if (data.success) {
                setCompanyData(data.company)
                console.log(data)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // Function to fetch user data

    const fetchUserData = async () => {
        try {
            
            const token = await getToken();

            const { data } = await axios.get(backendURL+ '/api/users/user', 
                {headers: {Authorization: `Bearer ${token}`}}
            )

            if (data.success) {
                setUserData(data.user)
                // console.log(data);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Get user application data

    const fetchUserApplications = async () => {

        try {
            
            const token = await getToken()

            const { data } = await axios.get(backendURL+ '/api/users/applications', 
                {headers: {Authorization: `Bearer ${token}`}}
            )

            if (data.success) {
                setUserApplications(data.applications)
                // console.log(data);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    // const fetchApplication = async () => {
    //     try {
            
    //     } catch (error) {
    //         console.log(error);            
    //     }
    // }

    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserApplications()
            // setUserApplications(userApplications);
        }
    }, [user])

    useEffect(() => {
        // This will log the updated userApplications after the state is set
    }, [userApplications]);


    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendURL,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications
        // fetchUserApplications
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}