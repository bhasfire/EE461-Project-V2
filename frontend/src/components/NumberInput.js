import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';

export default function NumberInput(props) {
    const [inputText, setInputText] = useState("0");

    useEffect(() => {
        props.getInputFromChild(inputText);
      }, [inputText]); // This will call getInputFromChild whenever inputText changes

    const handleInputChange = e => {
        setInputText(e.target.value);
    };

    return(
        <TextField
            id="outlined-number"
            label="Number"
            type="number"
            size="small"
            InputLabelProps={{
                shrink: true,
            }}
            value={inputText}
            onChange={handleInputChange}
            sx={{
                input: {
                    color: 'black', // Change text color
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "black", // Change border color
                    },
                    "&:hover fieldset": {
                        borderColor: "black", // Change border color on hover
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "black", // Change border color when focused
                    },
                },
            }}
        />
    )
}