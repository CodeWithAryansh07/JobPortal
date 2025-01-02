/* eslint-disable no-unused-vars */
// import React from 'react'

import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { assets, JobCategories, JobLocations } from "../assets/assets"
import JobCard from "./JobCard"

const JobListing = () => {

    const {isSearched, searchFilter, setSearchFilter, jobs} = useContext(AppContext)

    const [ showFilter, setShowFilter ] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)

    const [selectedCategories, setSelectedCategories] = useState([])

    const [selectedLocations, setSelectedLocations] = useState([])

    const [filteredJobs, setFilteredJobs] = useState(jobs)

    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
        // console.log(selectedCategories)
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        );
    }

    useEffect(() => {

        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)

        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)

        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())

        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().filter(job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job))

        setFilteredJobs(newFilteredJobs)

        setCurrentPage(1)

    }, [selectedCategories, selectedLocations, jobs, searchFilter])

    return (
        <div className="container 2xl:px-20 mx-auto flex flex-col  lg:flex-row max-lg:space-y-8 py-8 gap-4"> 
            { /* Side bar */}

            <div className="w-full lg:w-1/4 bg-white px-4 rounded-[15px] p-4">

                { /* Search Filter from Hero COmponent */}
                {
                    isSearched && ( searchFilter.title !== "" || searchFilter.location !== "" ) && (
                        <>
                            <h3 className="font-medium text-lg mb-4">Current Search</h3>
                            <div className="mb-4 text-gray-600">
                                { searchFilter.title  && (
                                    <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                                        { searchFilter.title}
                                        <img onClick={e => setSearchFilter(prev => ({...prev, title:""}))} className="cursor-pointer" src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                                { searchFilter.location  && (
                                    <span className="ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                                        { searchFilter.location }
                                        <img onClick={e => setSearchFilter(prev => ({...prev, location:""}))} className="cursor-pointer" src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                            </div>
                        </>
                    )
                }

                <button onClick={e => setShowFilter(prev => !prev)} className="px-6 py-1.5 rounded border border-gray-400 lg:hidden">
                    { showFilter ? "Close" : "Filter" }
                </button>

                {/* Category Filter */}
                <div className={showFilter ? "": "max-lg:hidden"}>
                    <h4 className="font-medium text-lg py-4">Search by Categories</h4>
                    <ul className="space-y-4 text-gray-600">
                        {JobCategories.map((category, index) => (
                            <li className="flex gap-3 items-center" key={index}>
                                <input onChange={ () => handleCategoryChange(category)}
                                checked = {selectedCategories.includes(category)}
                                className="scale-125" type="checkbox"/>
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Location Filter */}
                <div className={showFilter ? "": "max-lg:hidden"}>
                    <h4 className="font-medium text-lg py-4 pt-14">Search by Location</h4>
                    <ul className="space-y-4 text-gray-600">
                        {JobLocations.map((location, index) => (
                            <li className="flex gap-3 items-center" key={index}>
                                <input onChange={ () => handleLocationChange(location)}
                                checked = {selectedLocations.includes(location)}
                                className="scale-125" type="checkbox" name="" id=""/>
                                {location}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Job Listing */}
            <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
                <h3 className="font-medium text-3xl py-2" id='job-list'>Latest Jobs</h3>
                <p className="mb-8">Get your desired job from top companies</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                            <JobCard key={index} job={job} />
                        ))}
                </div>

                {/*Pagination */}
                {
                    filteredJobs.length > 0 && (
                        <div className="flex items-center justify-center space-x-2 mt-10">
                            <a href="">
                                <img onClick={(e) =>{ e.preventDefault(); setCurrentPage(Math.max(currentPage - 1, 1))}} src={assets.left_arrow_icon} alt="" />
                            </a>
                            {Array.from({length:Math.ceil(filteredJobs.length / 6)}).map((_, index) => (
                                <a href ="#job-list" key={index}>
                                    <button onClick={(e) => { setCurrentPage(index + 1)}} className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage === index + 1 ?
                                    "bg-blue-100 text-blue-500" : "text-gray-500"
                                    }`}>
                                        {index + 1}
                                    </button>
                                </a>
                            ))}
                            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6))); }}>
                                <img src={assets.right_arrow_icon} alt="" />
                            </a>
                        </div>
                    )
                }
            </section>
        </div>
    )
}

export default JobListing