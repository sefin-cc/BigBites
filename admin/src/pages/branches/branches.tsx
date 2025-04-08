import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Checkbox, TextField } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import location from "../../data/location.json"
import AddBranches from './addBranches';
import EditBranches from './editBranch';
import { useGetBranchesQuery, useDeleteBranchMutation } from '../../features/api/branchApi';
import ReactLoading from 'react-loading';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../features/loadingSlice';

// Data Types
interface Data {
    id: string;
    branchName: string;
    province: string;
    city: string;
    fullAddress: string;
    openingTime: string;
    closingTime: string;
    acceptAdvancedOrder: boolean;
}

// Data Row Creation
function createData(
    id: string,
    branchName: string,
    province: string,
    city: string,
    fullAddress: string,
    openingTime: string,
    closingTime: string,
    acceptAdvancedOrder: boolean

): Data {
  return {
    id,
    branchName,
    province,
    city,
    fullAddress,
    openingTime,
    closingTime,
    acceptAdvancedOrder
  };
}


function descendingComparator<T>(a: T, b: T, sortBy: keyof T): number {
  const valueA = a[sortBy];
  const valueB = b[sortBy];

  if (typeof valueA === 'boolean') {
    return valueA ? -1 : 1;
  }

  if (typeof valueB === 'boolean') {
    return valueB ? -1 : 1;
  }

  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueB.localeCompare(valueA); // for string comparison
  }

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueB - valueA; // for number comparison
  }

  // Default fallback for arrays or other types (if necessary)
  return 0;
}


type menuCategory = 'asc' | 'desc';

function getComparator<Key extends keyof any>(menuCategory: menuCategory, sortBy: Key): (
  a: { [key in Key]: number | string | any[] | boolean },
  b: { [key in Key]: number | string | any[] | boolean }
) => number {
  return menuCategory === 'desc'
    ? (a, b) => descendingComparator(a, b, sortBy)
    : (a, b) => -descendingComparator(a, b, sortBy);
}
// Table Header Cell Type
interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

// Head Cells
const headCells: readonly HeadCell[] = [
  { id: 'branchName', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'province', numeric: false, disablePadding: false, label: 'Province' },
  { id: 'city', numeric: false, disablePadding: false, label: 'City' },
  { id: 'fullAddress', numeric: false, disablePadding: false, label: 'Full Address' },
  { id: 'openingTime', numeric: false, disablePadding: false, label: 'Open Time' },
  { id: 'closingTime', numeric: false, disablePadding: false, label: 'Closing Time' },

];

// Table Header Component
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  menuCategory: menuCategory;
  sortBy: string;
  rowCount: number;
  isAllSelected: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, menuCategory, sortBy, onRequestSort, isAllSelected } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox checked={isAllSelected} onChange={onSelectAllClick} />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={sortBy === headCell.id ? menuCategory : false}
          >
            <TableSortLabel
              active={sortBy === headCell.id}
              direction={sortBy === headCell.id ? menuCategory : 'asc'}
              onClick={createSortHandler(headCell.id)}
              sx={{ padding: 1, fontWeight: "bold", fontSize: 19 }}
            >
              {headCell.label}
              {sortBy === headCell.id ? (
                <Box component="span" sx={{ visibility: 'hidden' }} >
                  {menuCategory === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  province: string;
  cities: string;
  handleCitiesChange:  (event: SelectChangeEvent<string>) => void;
  handleProvinceChange:  (event: SelectChangeEvent<string>) => void;
  numSelected: number;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selected: Set<string>;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { selected, handleDelete,  onSearchChange, numSelected, province, cities, handleCitiesChange, handleProvinceChange  } = props;


  return (
    <Toolbar sx={{ flex: 1, flexDirection: "column" }}>
      <Typography variant="h6" component="div" sx={{ margin: 2, fontWeight: "bold", fontFamily: "Madimi One" }}>
        BRANCH
      </Typography>
      <Box sx={{ display: "flex", flex: 1, width: "100%", gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          onChange={onSearchChange}
          placeholder="Search..."
        />

      <FormControl>
        <InputLabel id="type-filter-label">Province</InputLabel>
        <Select
          labelId="type-filter-label"
          value={province}
          onChange={handleProvinceChange}
          label="Province"
          size="small"
          sx={{ width: 200 }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200, // Set maximum height for the dropdown
                overflowY: 'auto', // Enable scrolling if the content exceeds maxHeight
              }
            }
          }}
        >
           <MenuItem value="">All</MenuItem>
          {location.Luzon.provinces.map((province, key) => (
            <MenuItem key={key} value={province.name}>
              {province.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="city-filter-label">Cities</InputLabel>
        <Select
          labelId="city-filter-label"
          value={cities}
          onChange={handleCitiesChange}
          label="Cities"
          size="small"
          sx={{ width: 200 }}
          disabled={!province}  // Disable the Cities dropdown if no Province is selected
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200, // Set maximum height for the dropdown
                overflowY: 'auto', // Enable scrolling if the content exceeds maxHeight
              }
            }
          }}
        >
          <MenuItem value="">All</MenuItem>
          {province && (
            location.Luzon.provinces
              .find((p) => p.name === province)
              ?.cities.map((city, key) => (
                <MenuItem key={key} value={city}>
                  {city}
                </MenuItem>
              ))
          )}
        </Select>
      </FormControl>

      <AddBranches location={location} />

        {numSelected > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={handleDelete}  className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}
        {numSelected === 1 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <EditBranches location={location}  id={selected}/>
          </div>
        ) : null}
      </Box>
    </Toolbar>
  );
}

export default function Branches() {
  const [menuCategory, setMenuCategory] = React.useState<menuCategory>('asc');
  const [sortBy, setSortBy] = React.useState<keyof Data>('branchName');
  const [selected, setSelected] = React.useState<Set<string>>(new Set()); // Tracks selected categories
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [cities, setCities] = React.useState<string>('');
  const [province, setProvince] = React.useState<string>('');
  const dispatch = useDispatch();
  const { data: branches, error, isLoading } = useGetBranchesQuery();
  const [deleteBranch, { isLoading: deleteLoading}] = useDeleteBranchMutation();
  const [rows, setRows] = React.useState<any[]>([]);  // Initialize with an empty array

  useEffect(() => {
  if (branches) {
    setRows(branches.map(branch => createData(
      branch.id,
      branch.branchName,
      branch.province,
      branch.city,
      branch.fullAddress,
      branch.openingTime,
      branch.closingTime,
      branch.acceptAdvancedOrder
    )));
  }
  if(error){
    toast.error('Something went wrong!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });
  }
}, [branches]);  

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = sortBy === property && menuCategory === 'asc';
    setMenuCategory(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly typing the Set as Set<string>
    const newSelected: Set<string> = event.target.checked
      ? new Set(filteredRows.map(row => `${row.id}`)) // Select all rows
      : new Set(); // Deselect all rows
  
    setSelected(newSelected);
  };
  
  const handleSubCategorySelect = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const newSelected: Set<string> = new Set(selected); // Explicitly type the Set
    if (event.target.checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };



  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCitiesChange = (event: SelectChangeEvent<string>) => {
    setCities(event.target.value);
  };

  const handleProvinceChange = (event: SelectChangeEvent<string>) => {
    setProvince(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = rows
    .filter(row => cities ? row.city === cities : true)
    .filter(row => province ? row.province === province : true)  
    .filter(row => row.branchName.toLowerCase().includes(searchTerm.toLowerCase())||
      row.province.toLowerCase().includes(searchTerm.toLowerCase())||
      row.city.toLowerCase().includes(searchTerm.toLowerCase())||
      row.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())
  ); // Apply search

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(menuCategory, sortBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [menuCategory, sortBy, page, rowsPerPage, filteredRows],
  );

  const isAllSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selected.has(`${row.id}`));

    const handleDelete = async () => {
      if (selected.size === 0) {
        toast.warning('No branches selected for deletion.', {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Slide,
        });
        return;
      }
    
      if (!confirm(`Are you sure you want to delete ${selected.size > 1 ? 'these branches?' : 'this branch?'}`)) {
        return;
      }
    
      try {
        await Promise.all(Array.from(selected).map((id) => deleteBranch(id).unwrap()));
    
        toast.success(`${selected.size > 1 ? 'Branches' : 'Branch'} deleted successfully!`, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Slide,
        });
    
        setSelected(new Set()); // Clear selection after successful deletion
      } catch (err) {
        console.error('Failed to delete branch:', err);
    
        toast.error('Something went wrong!', {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Slide,
        });
      }
    };
    
    
      useEffect(() => {
        dispatch(setLoading(deleteLoading));
      }, [deleteLoading]);

  return (
    <div style={{ display: 'flex', flexDirection: "row", gap: 20 }}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            selected={selected}
            handleDelete={handleDelete}
            cities={cities}  
            province={province}
            handleCitiesChange={handleCitiesChange}
            handleProvinceChange={handleProvinceChange}
            onSearchChange={handleSearchChange}
            numSelected={selected.size}
          />
          <TableContainer sx={{ width: '100%' }}>
          <Table
              aria-labelledby="tableTitle"
              size="small"
              sx={{ width: '100%', minHeight: 100 }} // Ensures table has a minimum height
            >
          <EnhancedTableHead
            menuCategory={menuCategory}
            sortBy={sortBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={filteredRows.length}
            isAllSelected={isAllSelected}
            numSelected={0}
          />

              <TableBody>
                {isLoading ? (
                  // Centered loading indicator
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                        <ReactLoading type="spinningBubbles" color="#FB7F3B" height={30} width={30} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : visibleRows.length === 0 ? (
                  // "No Data Available" message
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: "gray", fontStyle: "italic", py: 4 }}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                ) : (
                  // Display rows when data is available
                  visibleRows.map((row) => {
                    const isSubCategorySelected = selected.has(`${row.id}`);
                    return (
                      <TableRow hover key={`${row.id}`}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSubCategorySelected}
                            onChange={(e) => handleSubCategorySelect(e, `${row.id}`)}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {row.branchName}
                        </TableCell>
                        <TableCell align="right">{row.province}</TableCell>
                        <TableCell align="right">{row.city}</TableCell>
                        <TableCell align="right">{row.fullAddress}</TableCell>
                        <TableCell align="right">{row.openingTime}</TableCell>
                        <TableCell align="right">{row.closingTime}</TableCell>
                      </TableRow>
                    );
                  })
                )}

                {/* 🔹 Preserve table structure when empty but not loading */}
                {emptyRows > 0 && !isLoading && visibleRows.length > 0 && (
                  <TableRow style={{ height: 33 }}>
                    <TableCell colSpan={7} />
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <ToastContainer/>
    </div>
  );
}
