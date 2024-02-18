import React, { useState, useEffect } from "react";
//mui
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";

import Modal from "@mui/material/Modal";
const WebChatModal = ({ modalOpen, setOpenModal }) => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [values, setValues] = useState({
    message: "",
  });
  const [messageArray, setMessageArray] = useState({});
  const handleMessageInput = (e) => {
    const Value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: Value,
    });
  };
  const [searchValue, setSearchValue] = useState("");

  const handleOpen = () => setOpen(true);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 768,
    bgcolor: "background.paper",
    /*     border: "2px solid #000", */
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setOpenModal(false);
    setOpen(false);
  };
  const handleInput = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchValue(value);
  };
  useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);
  const data = [
    {
      id: "1",
      name: "Pattrick Wand",
      message: "Thank you for your visit!",
      read: false,
    },
    {
      id: "2",

      name: "Panther Stein",
      message: "Thank you for your visit!",
      read: false,
    },
    {
      id: "3",

      name: "John Doe",
      message: "Thank you for your visit!",
      read: true,
    },
  ];
  console.log(searchValue);
  /*   const handleSend = () => {
    const ID = sessionStorage.getItem("id");
    setMessageArray({
      ...messageArray,
      ID: [...messageArray[ID], values.message],
    });
    setValues({
      message: "",
    });
  }; */
  const handleSend = () => {
    const id = sessionStorage.getItem("id");

    if (!messageArray[id]) {
      setMessageArray({
        ...messageArray,
        [id]: [values.message],
      });
    } else {
      setMessageArray({
        ...messageArray,
        [id]: [...messageArray[id], values.message],
      });
    }

    setValues({
      message: "",
    });
  };
  console.log(messageArray);
  return (
    <div>
      {" "}
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} id="chatModal">
          <i className="fa-solid fa-xmark" onClick={handleClose}></i>
          <h1 className="webchath1">Chat</h1>
          <FormControl
            /* sx={{ m: 1, width: "25ch" }} */ variant="outlined"
            className="searchInput"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Search
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type="text"
              endAdornment={
                <InputAdornment>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </InputAdornment>
              }
              label="Search"
              onChange={handleInput}
              value={searchValue}
            />
          </FormControl>
          {data
            .filter((item) => item.name.toLowerCase().startsWith(searchValue))
            .map((item, index) => (
              <div
                className="chatDiv"
                onClick={() => {
                  setOpen2(true);
                  sessionStorage.setItem("name", item.name);
                  sessionStorage.setItem("id", item.id);
                }}
              >
                <span className="imgSpan">
                  <i className="fa-solid fa-user"></i>
                </span>
                <span className="span1">
                  <h1>{item.name}</h1>
                  <p>{item.message}</p>
                </span>

                <span className="span2">
                  <h1>12:31 PM</h1>
                  <span className="span2child"></span>
                </span>
              </div>
            ))}

          {/*    <div className="chatDiv" onClick={() => setOpen2(true)}>
            <span className="imgSpan">
              <i className="fa-solid fa-user"></i>
            </span>
            <span className="span1">
              <h1>Pattrick Wand</h1>
              <p>Thank you for your visit!</p>
            </span>

            <span className="span2">
              <h1>12:31 PM</h1>
              <span className="span2child"></span>
            </span>
          </div>

          <div className="chatDiv" onClick={() => setOpen2(true)}>
            <span className="imgSpan">
              <i className="fa-solid fa-user"></i>
            </span>
            <span className="span1">
              <h1>Pattrick Wand</h1>
              <p>Thank you for your visit!</p>
            </span>

            <span className="span2">
              <h1>12:31 PM</h1>
             
            </span>
          </div> */}

          <Modal
            open={open2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} id="chatModal2">
              <i
                className="fa-solid fa-xmark"
                onClick={() => setOpen2(false)}
              ></i>
              <div className="nameDiv">
                <span className="imgSpan">
                  <i className="fa-solid fa-user"></i>
                </span>
                <span className="span1">
                  <h1>{sessionStorage.getItem("name")}</h1>
                  <p>Albert Barber</p>
                </span>

                <span className="spanPhone">
                  <i className="fa-solid fa-phone"></i>
                </span>
              </div>
              <div className="messageDiv">
                {/*  {messageArray.map((message, index) => (
                  <div className="messageRightDiv" key={index}>
                    <p>{message}</p>
                  </div>
                ))}
 */}
                {messageArray[sessionStorage.getItem("id")] &&
                  messageArray[sessionStorage.getItem("id")].map(
                    (message, index) => (
                      <div className="messageRightDiv" key={index}>
                        <p>{message}</p>
                      </div>
                    )
                  )}
                {/*  <div className="messageLeftDiv">
                  <p>Hey mate!</p>
                </div>

                <div className="messageLeftDiv">
                  <p>Come to barber now</p>
                </div>

                <div className="messageRightDiv">
                  <p>Alright bro wait for sec.</p>
                </div>

                <div className="messageRightDiv">
                  <p>Not so sure about my hair style 😂</p>
                </div> */}
              </div>
              <div className="sendMessageDiv">
                <span className="sendMessageDivSpan1">
                  <i className="fa-solid fa-plus"></i>
                </span>
                <input
                  type="text"
                  placeholder="Type a message"
                  className="messageInput"
                  name="message"
                  value={values.message}
                  onChange={handleMessageInput}
                />
                <span className="sendIconSpan" onClick={handleSend}>
                  <i className="fa-solid fa-paper-plane"></i>
                </span>
              </div>
            </Box>
          </Modal>
        </Box>
      </Modal>
    </div>
  );
};

export default WebChatModal;
