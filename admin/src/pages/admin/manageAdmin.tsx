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
import AddUserModal from './addUserModal';
import EditUserModal from './editUserModal';



// Data Types
interface Data {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    branch: string;
    role: string;
}

// Data Row Creation
function createData(
    id: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    branch: string,
    role: string,

): Data {
  return {
    id,
    name,
    email,
    phone,
    address,
    branch,
    role,
  };
}

const branches = [
    { id: "1", branchName: "SM DAGUPAN CITY", province: "Pangasinan", city: "Dagupan", fullAddress: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan",  openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false  },
    { id: "2", branchName: "SM CITY URDANETA", province: "Pangasinan", city: "Urdaneta", fullAddress: "2nd St, Urdaneta, Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
    { id: "3", branchName: "CITYMALL SAN CARLOS", province: "Pangasinan", city: "San Carlos", fullAddress: "Bugallon St, cor Posadas St, San Carlos City, Pangasinan",  openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
    { id: "4", branchName: "ROBINSONS PLACE LA UNION", province: "La Union", city: "San Fernando", fullAddress: "Brgy, MacArthur Hwy, San Fernando, La Union",  openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: true },
  ];


const users: Data[] = [
    { id: "1", name: "Rogena Tibegar", email: "rogenasefin6@gmail.com", phone: "09500321222", address: "Mangaldan, Pangasinan",  branch: "SM DAGUPAN CITY", role: "Admin" },
  
  ];

  const rows = users.map(users => createData(
    users.id,
    users.name,
    users.email,
    users.phone,
    users.address,
    users.branch,
    users.role,
));

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
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
  { id: 'branch', numeric: false, disablePadding: false, label: 'Branch' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },

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
  const { onSelectAllClick, menuCategory, sortBy, numSelected, rowCount, onRequestSort, isAllSelected } = props;
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
  branch: string;
  handleBranchChange:  (event: SelectChangeEvent<string>) => void;
  role: string;
  handleRoleChange:  (event: SelectChangeEvent<string>) => void;
  numSelected: number;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { onSearchChange, numSelected, role, handleRoleChange, branch, handleBranchChange } = props;


  return (
    <Toolbar sx={{ flex: 1, flexDirection: "column" }}>
      <Typography variant="h6" component="div" sx={{ margin: 2, fontWeight: "bold", fontFamily: "Madimi One" }}>
        MANAGE USERS
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
        <InputLabel id="type-filter-label">Branch</InputLabel>
        <Select
          labelId="type-filter-label"
          value={branch}
          onChange={handleBranchChange}
          label="Branch"
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
           {branches.map((branch, key) => (
            <MenuItem key={key} value={branch.branchName}>
              {branch.branchName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id="type-filter-label">Role</InputLabel>
        <Select
          labelId="type-filter-label"
          value={role}
          onChange={handleRoleChange}
          label="Role"
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
           <MenuItem value="Admin">Admin</MenuItem>
           <MenuItem value="Employee">Employee</MenuItem>
        </Select>
      </FormControl>

    

      <AddUserModal branches={branches} />

        {/* <AddPromoModal /> */}
        {numSelected > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}
        {numSelected === 1 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <EditUserModal  branches={branches} />
          </div>
        ) : null}
      </Box>
    </Toolbar>
  );
}

export default function ManageAdmin() {
  const [menuCategory, setMenuCategory] = React.useState<menuCategory>('asc');
  const [sortBy, setSortBy] = React.useState<keyof Data>('name');
  const [selected, setSelected] = React.useState<Set<string>>(new Set()); // Tracks selected categories
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [role, setRoles] = React.useState<string>('');
  const [branch, setBranch] = React.useState<string>('');


  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setRoles(event.target.value);
  };

  const handleBranchChange = (event: SelectChangeEvent<string>) => {
    setBranch(event.target.value);
  };



  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = rows
    .filter(row => role ? row.role === role : true)
    .filter(row => branch ? row.branch === branch : true)
    .filter(row => row.role.toLowerCase().includes(searchTerm.toLowerCase())||
      row.name.toLowerCase().includes(searchTerm.toLowerCase())||
      row.branch.toLowerCase().includes(searchTerm.toLowerCase())||
      row.email.toLowerCase().includes(searchTerm.toLowerCase())||
      row.phone.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div style={{ display: 'flex', flexDirection: "row", gap: 20 }}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            branch={branch}
            handleBranchChange={handleBranchChange}
            role={role}  
            handleRoleChange={handleRoleChange}
            onSearchChange={handleSearchChange}
            numSelected={selected.size}
          />
          <TableContainer sx={{ width: '100%' }}>
            <Table
              aria-labelledby="tableTitle"
              size={'small'}
              sx={{ width: '100%' }}
            >
              <EnhancedTableHead
                menuCategory={menuCategory}
                sortBy={sortBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredRows.length}
                isAllSelected={isAllSelected} numSelected={0}              />
              <TableBody>
                {visibleRows.map((row, index) => {
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
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">{row.branch}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 }}>
                    <TableCell colSpan={6} />
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
    </div>
  );
}
