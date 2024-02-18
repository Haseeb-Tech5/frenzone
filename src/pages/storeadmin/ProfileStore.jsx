import React, { Fragment, useState } from 'react'
import Grid from "@mui/material/Grid"
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
// react icons
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  
  const members = [
    { id: 1, name: 'Johnson' },
    { id: 2, name: 'Ali' },
    { id: 3, name: 'Jason' },
    { id: 4, name: 'Abdullah' },
    { id: 5, name: 'Ahmed' },
    // Add more members as needed
  ];
  
  const times = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

const ProfileStore = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [personSelected, setPersonSelected] = useState('All Team')
    
    const handleChangeMonth = (value) => {
        setCurrentMonth(value);
    };
    
    return (
        <>
            <div className='bg-[#F4F7FE] py-12 px-4 w-[100%]'>
                <Grid container xs={12} justifyContent="space-between" className='items-center'>
                    <Grid item lg={4} xs={12}>
                        <h1 className='text-[#FFE11B] font-[700] text-[34px]'>Profile</h1>
                    </Grid>
                </Grid>
                <Grid container xs={12} className="justify-center my-24">
                    <Grid container sm={11} xs={12}>
                        <div className='bg-white w-full rounded-xl'>
                            <div className='bg-[#FFE11B] h-[100px] rounded-lg m-2 px-6 py-6'>
                                <Grid container xs={12} justifyContent="space-between">
                                    <Grid item className="pt-3">
                                        <h2 className='text-white font-[700] leading-[32px] sm:text-[28px] text-[20px]'>Your Profile</h2>
                                    </Grid>
                                    <Grid item>
                                        <img src={require('../../assets/Group 246 (1).png')} width="200px" className='sm:w-[200px] w-[100px]' alt="" />
                                    </Grid>
                                </Grid>
                            </div>
                            <Grid container xs={12} justifyContent="space-between" spacing={6} className="p-2">
                            <Grid item className="pb-8">
                                <table className='sm:mt-0 mt-8  ml-3 sm:ml-12 max-w-[350px]'>
                                    <tr>
                                        <td className='text-[#6C757D] font-[500] pb-4 text-left'>Admin id:</td>
                                        <td className='text-[#2B3674] font-[700] pl-12'>110A</td>
                                    </tr>
                                    <tr>
                                        <td className='text-[#6C757D] font-[500] pb-4 text-left'>Name:</td>
                                        <td className='text-[#2B3674] font-[700] pl-12'>Johnson Jam</td>
                                    </tr>
                                    <tr>
                                        <td className='text-[#6C757D] font-[500] pb-4 text-left'>Address:</td>
                                        <td className='text-[#2B3674] font-[700] pl-12'>New York</td>
                                    </tr>
                                    <tr>
                                        <td className='text-[#6C757D] font-[500] pb-4 text-left'>Contact No.:</td>
                                        <td className='text-[#2B3674] font-[700] pl-12'>+123456789</td>
                                    </tr>
                                    <tr>
                                        <td className='text-[#6C757D] font-[500] pb-4 text-left'>Email:</td>
                                        <td className='text-[#2B3674] font-[700] pl-12'>Johnson@gmail.com</td>
                                    </tr>
                                    <tr>
                                        <td className='text-[#6C757D] font-[500] pb-4 text-left'>Password:</td>
                                        <td className='text-[#2B3674] font-[700] pl-12'>**********</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item alignSelf="center">
                                <button className='mt-0 sm:mt-20 bg-[#FFE11B] text-[#292828] rounded-full px-12 py-3'>Edit</button>
                            </Grid>
                            </Grid>

                        </div>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default ProfileStore