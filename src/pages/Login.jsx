import React from 'react'
import { Link } from "react-router-dom"
//@mui
import Grid from "@mui/material/Grid"

const Login = () => {
    return (
        <Grid container xs={12}>
            <Grid item lg={7} md={6} xs={12} align="center" className='min-h-[100vh] flex items-center w-full justify-center'>
                <div className='self-center'>
                <img src={require('../assets/WhatsApp_Image_2023-12-01_at_3.58 1.png')} alt="Logo" width={450} />
                <Grid container xs={12} justifyContent='center'>
                    <Grid item lg={9} xs={10} align="center" alignSelf="center">
                        <div className='block'>
                            <Link to="/super-admin/login">
                                <button className='block bg-[#FFE11B] text-[#292828] w-full py-6 text-[16px] font-montserrat font-semibold mt-12 my-12 rounded-md'>Log in as Super Admin</button>
                            </Link>
                            <Link to="/store-admin/login">
                                <button className='block bg-[#FFE11B] text-[#292828] w-full py-6 text-[16px] font-montserrat font-semibold my-12 rounded-md'>Log in as Store Admin</button>
                            </Link>
                            <Link to="/employee/login">
                                <button className='block bg-[#FFE11B] text-[#292828] w-full py-6 text-[16px] font-montserrat font-semibold my-12 rounded-md'>Log in as Employee</button>
                            </Link>
                        </div>
                    </Grid>
                </Grid>
                </div>
            </Grid>
            <Grid item lg={5} md={6} xs={0} className='hidden md:flex'>
                <img src={require('../assets/Image.png')} alt="" className='h-[100vh] w-full' />
            </Grid>
        </Grid>
    )
}

export default Login