import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { useEffect } from 'react';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSliderFOVDepth({ onValueChange ,resetSignal}) {
  
  const [value, setValue] = React.useState(40);  // Default value changed to 40
  useEffect(() => {
    if (resetSignal) {
      setValue(40);
      onValueChange(40);
    }
  }, [resetSignal]);
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const handleInputChange = (event) => {
    const numValue = event.target.value === '' ? '' : Number(event.target.value);
    setValue(numValue);
    if (typeof numValue === 'number') {
      onValueChange(numValue);
    }
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
      onValueChange(0);
    } else if (value > 100) { // Updated maximum limit to 100
      setValue(100);
      onValueChange(100);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography sx={{display: 'flex', position: 'relative'}} id="input-slider" gutterBottom>
        FOV
        <div className="info-icon-container">
          <img
            style={{ width: '15px', height: '15px', marginTop: '-10px' }}
            src="info.svg"
            alt="Info Icon"
          />
          <div className="info-tooltip">
            FOV stands for Field of View. In the context of the food calorie estimation model, this parameter likely refers to the camera's field of view, which is the extent of the scene that the camera can capture. It is usually measured in degrees and determines the width of the image frame.
          </div>
        </div>
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item></Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={0}       // Minimum value set to 0
            max={100}     // Maximum value set to 100
            step={1}      // Step value set to 1 for whole number increments
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,     // Step value set to 1 for whole number increments
              min: 0,
              max: 100,    // Maximum value set to 100
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
