import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SubCategory from './subcategory';
import MenuItems from './menuitems';


export default function Menu() {
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
        <Tab label="Sub-Categories" />
        <Tab label="Menu Items" />
      </Tabs>

      {/* Content Below Tabs */}
      <Box sx={{ paddingTop: 2}}>
        {value === 0 && (
          <Box>
              <SubCategory />
          </Box>
        )}
        {value === 1 && (
          <Box>
            <MenuItems />
          </Box>
        )}
      </Box>
    </div>
  );
}
