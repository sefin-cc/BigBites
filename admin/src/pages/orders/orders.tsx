import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Pending from './pending';
import Completed from './completed';

export default function NavTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue); // Update the selected tab
  };

  return (
    <div style={{ width: '100%'}}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="order tabs"
        role="navigation"
      >
        {/* Simply use Tab without href and onClick */}
        <Tab label="Pending Orders" />
        <Tab label="Completed Orders" />
      </Tabs>

      {/* Content Below Tabs */}
      <Box sx={{ paddingTop: 2}}>
        {value === 0 && (
          <Box>
            <Pending />
          </Box>
        )}
        {value === 1 && (
          <Box>
            <Completed />
          </Box>
        )}
      </Box>
    </div>
  );
}
