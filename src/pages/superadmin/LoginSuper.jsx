import React from 'react'
import { Link } from 'react-router-dom'
//@mui
import Grid from "@mui/material/Grid"
// react icons
import { FaEye } from "react-icons/fa";

const LoginSuper = () => {
    return (
        <Grid container xs={12}>
            <Grid item lg={7} md={6} xs={12} align="center" className='min-h-[100vh] items-center w-full justify-center px-16 sm:px-32 py-16'>
                <div className="self-center">
                <img src={require('../../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png')} width="250px" alt="logo" />
                <Grid item xs={12} align="left" className="pt-6">
                    <h2 className='mt-8 text-[36px] font-[700] -tracking-[0.72px] leading-[56px]'>Login as Admin</h2>
                    <p className='text-[#A3AED0] text-[16px] font-[400] mt-4'>Enter your email and password to log in!</p>
                    <div className='mt-12'>
                        <p className='text-[14px] font-[500] -tracking-[0.28px]'>Email*</p>
                        <input className='rounded-md px-4 py-4 w-[100%] border border-[#E0E2E7] mt-4' type="email" placeholder='mail@example.com' />
                    </div>
                    <div className='mt-8'>
                        <p className='text-[14px] font-[500] -tracking-[0.28px]'>Password*</p>
                        <div className='flex items-center'>
                            <input className='rounded-md px-4 py-4 w-[100%] border border-[#E0E2E7] mt-4' type="password" placeholder='Min 8 charachters' />
                            <div className='w-0 h-0'>
                                <FaEye className='text-[#E0E2E7] relative -left-[45px] -top-[5px] text-[25px]' />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center w-[100%] justify-between mt-4'>
                        <div className='self-center'>
                            <input type="checkbox" class="accent-[#FFE11B] w-5 h-5 rounded-lg relative top-1" checked /> 
                            <span className="text-[#A3AED0] ml-2 text-[15px] font-[400] leading-[20px]">Keep me logged in</span>
                        </div>
                        <div className='self-center'>
                            <p className="text-[#FFE11B] text-[14px]">Forgot password?</p>
                        </div>
                    </div>
                    <div className='text-center mt-20'>
                        <Link to="/super-admin/dashboard">
                            <button className='rounded-md border-[#FFE11B] bg-[#FFE11B] text-[#292828] w-[100%] py-6 font-[600]'>Log in</button>
                        </Link>
                    </div>
                </Grid>
                </div>
            </Grid>
            <Grid item lg={5} md={6} xs={0} className='hidden md:flex'>
                <img src={require('../../assets/Image.png')} alt="" className='h-[100vh] w-full' />
            </Grid>
        </Grid>
    )
}

export default LoginSuper