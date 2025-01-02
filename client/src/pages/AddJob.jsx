// import React from 'react'

import { useEffect, useRef, useState } from "react"
import Quill from "quill"
import { JobCategories, JobLocations } from "../assets/assets"

const AddJob = () => {

    const [title, setTitle] = useState('')

    const [location, setLocation] = useState('Bangalore')

    const [category, setCategory] = useState('Programming')

    const [level, setLevel] = useState('Entry Level')

    const [salary, setSalary] = useState(0)

    const editorRef = useRef(null)

    const quillRef = useRef(null)

    useEffect(() => {
        // Initiate Quill only once

        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Type here...'
            })
        }
    }, [])

    return (
        <form className="container p-4 flex flex-col w-full items-start gap-3">
            <div className="w-full">
                <p className="mb-2">Job Title</p>
                <input className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded" type="text" placeholder="Type here" onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="w-full max-w-lg">
                <p className="my-2">Job Description</p>
                <div ref={editorRef}>

                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">

                <div>
                    <p className="mb-2">Job Category</p>
                    <select className="w-full px-3 py-2 border-2 rounded border-gray-300" onChange={e => setCategory(e.target.value)}>
                        {JobCategories.map((jobCategory, index) =>
                            <option key={index} value={jobCategory}>{jobCategory}
                            </option>)}
                    </select>
                </div>

                
                
                <div>
                    <p className="mb-2">Job Location</p>
                    <select className="w-full px-3 py-2 border-2 rounded border-gray-300" onChange={e => setLocation(e.target.value)}>
                        {JobLocations.map((jobLocation, index) =>
                            <option key={index} value={jobLocation}>{jobLocation}
                            </option>)}
                    </select>
                </div>
                
                <div>
                    <p className="mb-2">Job Level</p>
                    <select className="w-full px-3 py-2 border-2 rounded border-gray-300" onChange={e => setLevel(e.target.value)}>
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                    </select>
                </div>

            </div>
            <div>
                    <p className="mb-2">Job Salary</p>
                    <input className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]" type="number" placeholder="25000" onChange={e => setSalary(e.target.value)} required min="0" />
                </div>

                <button className="w-28 py-3 bt-4 bg-black text-white rounded">Add</button>
        </form>
    )
}

export default AddJob
