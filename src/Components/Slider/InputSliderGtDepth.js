import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { useEffect } from 'react';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSliderGtDepth({ onValueChange,resetSignal }) {
  const [value, setValue] = React.useState(0.35);  // Default value changed to 0.5
  
  useEffect(() => {
    if (resetSignal) {
      setValue(0.35);
      onValueChange(0.35);
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
    } else if (value > 1) {
      setValue(1);
      onValueChange(1);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography sx={{display: 'flex', position: 'relative'}} id="input-slider" gutterBottom>
        Gt_Depth_Scale
        <div className="info-icon-container">
          <img
            style={{ width: '15px', height: '15px', marginTop: '-10px' }}
            src="info.svg"
            alt="Info Icon"
          />
          <div className="info-tooltip">The ground truth (gt) depth scale is a scaling factor used to adjust the depth values. This scaling factor is applied to bring the estimated depth values closer to the ground truth depth values. It is often necessary to scale the predicted depth maps to match the scale of the actual depth information.</div>
        </div>
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          {/* <VolumeUp /> */}
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            max={1}  // Maximum value set to 1
            step={0.01}  // Step value set to 0.01
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 0.01,   // Step value set to 0.01
              min: 0,
              max: 1,    // Maximum value set to 1
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
