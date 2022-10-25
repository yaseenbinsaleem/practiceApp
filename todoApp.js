import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import CardComponent from "../../components/card/card";
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

function TodoApp() {
  const [values, setValues] = useState({
    work: "",
    time: "",
    date:""
  });
  const [valueIndex, setValueIndex] = useState(null);
  const [formData, setFormData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const HandleWorkChange = (e, i) => {
    setValues({ ...values, work: e.target.value });
  };
  const HandleTimeChange = (e) => {
    setValues({ ...values, time: e.target.value });
  };
 const HandleDateChange = (e) => {
  setValues({ ...values, date: e.target.value });
};

  const HandleSubmit = (e) => {
    e.preventDefault();
    console.log("HandleSubmitfunction");

    if (isEdit) {
      let data = [...formData];

      data[valueIndex] = values;
      setFormData(data);
      setValueIndex(null);
      setOpen(false);
      // listData[indexVal] = text aamir
    } else {
      let data = [...formData];
      data.push(values);
      //.push is used to add new index in an array
      setFormData(data);
    }
    setValues({
      work: "",
      time: ""
    });

    setIsEdit(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  };

  const deleteTodo = (i) => {
    setValueIndex(i);
    setConfirmOpen(true);
  };

  const deleteConfirm = () => {
    let data = [...formData];
    data.splice(valueIndex, 1);
    setFormData(data);

    setConfirmOpen(false);
  };
  const EditTodo = (value, i) => {
    // let data = [...formData,i];
    console.log(i);
    setIsEdit(true);
    setValueIndex(i);
    setOpen(true);
    setValues({ ...value, time: value.time, work: value.work });

    // value.time and value.work is from value we have sent on edit button, time and work is from ...value
    // console.log(data);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "5%"
        }}
      >
        <Modal
          className="edit-modal"
          open={open}
          onClose={() => setOpen(false)} /** */
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "background.paper",
              boxShadow: 24,
              p: 4,
              m: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px"
            }}
          >
            <h1>Edit the rows</h1>
            <TextField
              id="outlined-basic"
              label="work"
              variant="outlined"
              placeholder="what to do?"
              value={values.work}
              onChange={HandleWorkChange}
            />
            <TextField
              id="outlined-basic"
              label="time"
              variant="outlined"
              placeholder="At what time?"
              value={values.time}
              onChange={HandleTimeChange}
            />
            <Button variant="contained" color="success" onClick={HandleSubmit}>
              edit
            </Button>
          </Box>
        </Modal>

        <Paper
          elevation={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30%",
            padding: "10%"
          }}
        >
          <Box
            component="form"
            onSubmit={HandleSubmit}
            sx={{
              m: 1,
              width: "25ch",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px"
            }}
            noValidate={false}
            autoComplete="off"
          >
            <h2>Task Manager</h2>
            {submitted ? (
              <Alert variant="filled" severity="success">
                This is a success alert — check it out!
              </Alert>
            ) : null}
            <TextField
              onChange={HandleWorkChange}
              id="outlined-basic"
              required
              label="work"
              variant="outlined"
              value={values.work}
              placeholder="what to do?"
            />
            {/* <TextField
              onChange={HandleTimeChange}
              id="outlined-basic"
              required
              label="time"
              variant="outlined"
              value={values.time}
              placeholder="At what time?"
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/DD/YYYY"
          value={values.date}
          onChange={HandleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        
        <TimePicker
          label="Time"
          value={values.time}
          onChange={HandleTimeChange}
          renderInput={(params) => <TextField {...params} />}
        />

      
      </Stack>
    </LocalizationProvider>
            <Button variant="contained" color="success" onClick={HandleSubmit}>
              add
            </Button>
          </Box>
        </Paper>

        <Modal
          className="delete-modal"
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)} /** */
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "background.paper",
              boxShadow: 24,
              p: 4,
              m: 1,
              display: "flex",

              alignItems: "center",
              justifyContent: "center",
              gap: "20px"
            }}
          >
            <h2>are you sure?</h2>
            <Button variant="contained" color="success" onClick={deleteConfirm}>
              yes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setConfirmOpen(false)}
            >
              cancel
            </Button>
          </Box>
        </Modal>
        
        <cards style={{display:"flex",flexWrap:"wrap", justifyContent:"space-around", padding:"5%"}}>
          {formData.map((value, i) => (
            <CardComponent key={i} works={value.work} times={value.time}>
              <IconButton
                aria-label="update"
                onClick={() => EditTodo(value, i)}
              >
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => deleteTodo(i)}>
                <DeleteIcon />
              </IconButton>
            </CardComponent>
          ))}
        </cards>
        {/* <TableContainer
          component={Paper}
          elevation={16}
          sx={{ maxWidth: "70%", backgroundColor: "lightgrey" }}
        >
          <Table>
            <TableHead sx={{ maxwidth: "100%" }}>
              <TableRow sx={{ backgroundColor: "darkblue" }}>
                <TableCell>work</TableCell>
                <TableCell>time</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {formData.map((value, i) => (
                <CardComponent key={i} works={value.work} times={value.time}  >
                <IconButton
                  aria-label="update"
                  onClick={() => EditTodo(value, i)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => deleteTodo(i)}>
                    <DeleteIcon />
                  </IconButton>
                  </CardComponent>
                // <TableRow key={i}>
                //   <TableCell> {value.work} </TableCell>
                //   <TableCell> {value.time} </TableCell>
                //   <IconButton aria-label="delete" onClick={() => deleteTodo(i)}>
                //     <DeleteIcon />
                //   </IconButton>
                //   <IconButton
                //     aria-label="update"
                //     onClick={() => EditTodo(value, i)}
                //   >
                //     <EditIcon />
                //   </IconButton>
                // </TableRow> 
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
      </Box>
    </>
  );
}

export default TodoApp;
