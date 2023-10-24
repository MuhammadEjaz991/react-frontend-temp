import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import './Sliders.css';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSliderMinDepth({ onValueChange, resetSignal}) {
  const [value, setValue] = useState(0.01);

  useEffect(() => {
    if (resetSignal) {
      setValue(0.01);
      onValueChange(0.01);
    }
  }, [resetSignal]);
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const handleInputChange = (event) => {
    
    let numValue = event.target.value === '' ? '' : Number(event.target.value);
    numValue = Math.round(numValue * 100) / 100;
    setValue(numValue);
    if (typeof numValue === 'number') {
      onValueChange(numValue);
    }
  };

  const handleBlur = () => {
    if (value < 0.01) {
      setValue(0.01);
      onValueChange(0.01);
    } else if (value > 10) {
      setValue(10);
      onValueChange(10);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography sx={{display: 'flex'}} id="input-slider" gutterBottom>
        MIN_Depth
        <div className="info-icon-container">
          <img
            style={{ width: '15px', height: '15px', marginTop: '-10px' }}
            src="info.svg"
            alt="Info Icon"
          />
          <div className="info-tooltip">
            MIN_DEPTH controls the minimum distance from the camera to an object that can be accurately estimated as a depth value. Objects closer to the camera than the MIN_DEPTH may not be reliably estimated.
          </div>
        </div>
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item></Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0.01}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={0.01}  // Minimum value set to 0.01
            max={10}
            step={0.01}
          />
        </Grid>
        <Grid item>
        <Input
    value={value}
    size="small"
    onChange={handleInputChange}
    onBlur={handleBlur}
    inputProps={{
        step: 0.01,
        min: 0.01,
        max: 10,
        type: 'text',
        'aria-labelledby': 'input-slider',
        readOnly: true   // Yeh line add kari hai
    }}
/>

        </Grid>
      </Grid>
    </Box>
  );
}
