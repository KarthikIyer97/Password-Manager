import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async() => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        console.log(passwords)
        setPasswordArray(passwords)
      
    }
    
    

    useEffect(() => {
        getPasswords()
        
        }, [])


    const copyText = (text) => {
        toast('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,

        });
        navigator.clipboard.writeText(text)
    }


    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("icons/eyecross.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            ref.current.src = "icons/eyecross.png"
            passwordRef.current.type = "text"
        }
    }


    const savePassword = async() => {
        if(form.site.length > 3 && form.username.length > 3 && form.password.length > 3){
        console.log(form)
        
        // If any such id exists in the db, delete it
        await fetch("http://localhost:3000/", {method: "DELETE", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: form.id}) } )
        
        setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
        await fetch("http://localhost:3000/", {method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...form, id: uuidv4()}) } )
        // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
        // console.log([...passwordArray, form])
        setform({site:"", username:"", password:""})
        toast('Password Saved!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,

        });

    }
    else{
        toast('Error: Password not saved!');
    }
    }



    const deletePassword = async(id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if(c){
            setPasswordArray(passwordArray.filter(item=>item.id!==id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            let res = await fetch("http://localhost:3000/", {method: "DELETE", headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id}) } )
            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
    
            });

        }
       
    }

    const editPassword = (id) => {
        console.log("Editing password with id", id)
        setform({...passwordArray.filter(i=>i.id===id)[0], id: id})
        setPasswordArray(passwordArray.filter(item=>item.id!==id))
        

    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })

    }


    return (

        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
            />
            {/* Same as */}
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="p-3 md:mycontainer min-h-[88.2vh]">
                <h1 className='text-4xl text font-bold text-center'>
                    <span className='text-green-500'> &lt;</span>

                    <span>Pass</span>
                    <span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input onChange={handleChange} value={form.site} placeholder='Enter website URL' className='rounded-full border border-green-400 w-full p-4 py-1' type="text" name="site" id="site" />

                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">

                        <input onChange={handleChange}
                            value={form.username}
                            placeholder='Enter Username' className='rounded-full border border-green-400 w-full p-4 py-1' type="text" name="username" id="username" />

                        <div className="relative">

                            <input ref={passwordRef} onChange={handleChange}
                                value={form.password}
                                placeholder='Enter Password' className='rounded-full border border-green-400 w-full p-4 py-1' type="password" name="password" id="password" />

                            <span className="absolute right-[3px] top-[3px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className="p-1" width={27} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className="flex justify-center items-center bg-green-400 rounded-full px-8 py-2 w-fit gap-2  border border-green-900 hover:bg-green-300">
                        <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        Save</button>

                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>

                    {passwordArray.length === 0 && <div>No Passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full  rounded-md overflow-hidden mb-10">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='text-center py-2 border border-white'>
                                        <div className='flex justify-center items-center '>
                                            <span>
                                                <a href={item.site} target="_blank">{item.site}</a>
                                            </span>
                                            <div className='flex  justify-center  items-center '>
                                                <div className="size-7 cursor-pointer lordiconcopy" onClick={() => { copyText(item.site) }}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center py-2 border border-white'>
                                        <div className='flex  justify-center  items-center'>
                                            <span>{item.username}</span>

                                            <div className="size-7 cursor-pointer lordiconcopy" onClick={() => { copyText(item.username) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center py-2 border border-white'>
                                        <div className='flex  justify-center  items-center'>
                                            <span>{"*".repeat(item.password.length)}</span>

                                            <div className="size-7 cursor-pointer lordiconcopy " onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                                            </div>
                                        </div>
                                    </td>

                                    <td className='text-center py-2 border border-white'>
                                        <span className='cursor-pointer mx-1' onClick={()=>{editPassword(item.id)}}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>

                                        <span className='cursor-pointer mx-1' onClick={()=>{deletePassword(item.id)}}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>

                                    </td>
                                </tr>

                            })}



                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    )
}

export default Manager
