import React from "react";
import Grid from "@mui/material/Grid";
import pic from "../../Assets-admin/pic.svg";

const ProfileEmployee = () => {
  return (
    <>
      <div className="bg-[#ffe9c865] py-12 px-4 w-[100%]">
        <Grid
          container
          xs={12}
          justifyContent="space-between"
          className="items-center"
        >
          <Grid item lg={4} xs={12}>
            <h1 className="text-[#ff9700] font-[600] text-[55px] font-[Poppins]">
              Profile
            </h1>
          </Grid>
        </Grid>
        <Grid container xs={12} className="justify-center my-12">
          <Grid container sm={11} xs={12}>
            <div className="bg-white w-full rounded-xl">
              <div className="bg-[#ff9700] h-[100px] rounded-lg m-2 px-6 py-6">
                <Grid container xs={12} justifyContent="space-between">
                  <Grid item className="pt-3">
                    <h2 className="text-white font-[700] leading-[32px] sm:text-[28px] text-[20px]">
                      Your Profile
                    </h2>
                  </Grid>
                  <Grid item>
                    <img
                      src={pic}
                      width="200px"
                      className="sm:w-[200px] w-[100px] max-[370px]:ml-[15%] max-[323px]:w-[80px] max-[323px]:mt-[10px]"
                      alt=""
                    />
                  </Grid>
                </Grid>
              </div>
              <Grid
                container
                xs={12}
                justifyContent="space-between"
                spacing={6}
                className="p-2"
              >
                <Grid item className="pb-8">
                  <table className="sm:mt-0 mt-8  ml-3 sm:ml-12 max-w-[350px] w-[100%]">
                    <tr>
                      <td className="text-[#6C757D] font-[500] pb-4 text-left ">
                        Admin id:
                      </td>
                      <td className="text-[#2B3674] font-[700] pb-4  pl-12 ">
                        110A
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#6C757D] font-[500] pb-4 text-left">
                        Name:
                      </td>
                      <td className="text-[#2B3674] font-[700] pb-4  pl-12">
                        Johnson Jam
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#6C757D] font-[500] pb-4 text-left">
                        Address:
                      </td>
                      <td className="text-[#2B3674] font-[700] pb-4  pl-12">
                        New York
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#6C757D] font-[500] pb-4 text-left">
                        Contact No.:
                      </td>
                      <td className="text-[#2B3674] font-[700] pb-4  pl-12">
                        +123456789
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#6C757D] font-[500] pb-4 text-left">
                        Email:
                      </td>
                      <td className="text-[#2B3674] font-[700] pb-4 pl-12">
                        Johnson@gmail.com
                      </td>
                    </tr>
                    <tr>
                      <td className="text-[#6C757D] font-[500] pb-4 text-left">
                        Password:
                      </td>
                      <td className="text-[#2B3674] font-[700] pb-4  pl-12">
                        **********
                      </td>
                    </tr>
                  </table>
                </Grid>
                <Grid item alignSelf="center">
                  <button className="mt-0 sm:mt-20 bg-[#ff9700] text-[white] text-[20px] rounded-full h-[50px] w-[130px] font-[Poppins]">
                    Edit
                  </button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProfileEmployee;
