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
import { useGetAdminsQuery, useDeleteAdminMutation } from '../../features/api/adminUsersApi';
import { useGetBranchesQuery } from '../../features/api/branchApi';
import ReactLoading from 'react-loading';
import { Slide   , toast } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../features/loadingSlice';

// Data Types
interface Data {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    branch: string;
    role: string;
}

// Data Row Creation
function createData(
    id: number,
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

interface Branch {
  id: string;
  branchName: string;
  province: string;
  city: string;
  fullAddress: string;
  openingTime: string;
  closingTime: string;
  acceptAdvancedOrder: boolean;
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
  branch: string;
  handleBranchChange:  (event: SelectChangeEvent<string>) => void;
  role: string;
  handleRoleChange:  (event: SelectChangeEvent<string>) => void;
  selected: Set<string>;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  branchesList: Branch[];
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {handleDelete, branchesList, onSearchChange, selected, role, handleRoleChange, branch, handleBranchChange } = props;


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
           {branchesList.map((branch, key) => (
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
           <MenuItem value="Administrator">Administrator</MenuItem>
           <MenuItem value="Manager">Manager</MenuItem>
           <MenuItem value="Staff">Staff</MenuItem>
        </Select>
      </FormControl>

    

      <AddUserModal branches={branchesList} />

        {/* <AddPromoModal /> */}
        {selected.size > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={handleDelete} className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}
        {selected.size === 1 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <EditUserModal  branches={branchesList} id={selected} />
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
  const { data: branchesList } = useGetBranchesQuery();
  const { data: users, error, isLoading } = useGetAdminsQuery();
  const [rows, setRows] = React.useState<any[]>([]); 
  const [deleteUser, { isLoading: deleteLoading}] = useDeleteAdminMutation();
  const dispatch = useDispatch();
  
  useEffect(() => {
  if (users) {
    setRows(users.map(user => createData(
        user.id,
        user.name,
        user.email,
        user.phone,
        user.address,
        user.branch,
        user.roles.length > 0 ? user.roles[0].name : 'No Role'
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
  }, [users]);  

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

  const handleDelete = async () => {
    if (selected.size === 0) {
      toast.warning('No users selected for deletion.', {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Slide,
      });
      return;
    }
  
    if (!confirm(`Are you sure you want to delete ${selected.size > 1 ? 'these users?' : 'this user?'}`)) {
      return;
    }
  
    try {
      await Promise.all(Array.from(selected).map((id) => deleteUser(Number(id)).unwrap()));
  
      toast.success(`${selected.size > 1 ? 'Users' : 'User'} deleted successfully!`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Slide,
      });
  
      setSelected(new Set()); // Clear selection after successful deletion
    } catch (err) {
      console.error('Failed to delete user:', err);
  
      const errorMessage =
        (err as any)?.data?.message ||
        (err as any)?.error ||
        "Something went wrong!";
        
      toast.error(errorMessage, {
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
            branch={branch}
            branchesList={branchesList || []}
            handleBranchChange={handleBranchChange}
            role={role}  
            handleRoleChange={handleRoleChange}
            onSearchChange={handleSearchChange}
            selected={selected}
            handleDelete={handleDelete}
          />
          <TableContainer sx={{ width: '100%' }}>
          <Table aria-labelledby="tableTitle" size="small" sx={{ width: '100%', minHeight: 100 }}>
            <EnhancedTableHead
                menuCategory={menuCategory}
                sortBy={sortBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredRows.length}
                isAllSelected={isAllSelected} numSelected={0} 
                />
            <TableBody>
              {isLoading ? (
                // Show loading indicator when fetching data
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                      <ReactLoading type="spinningBubbles" color="#FB7F3B" height={30} width={30} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : visibleRows.length === 0 ? (
                //  Show "No Data Available" when no rows exist
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: "gray", fontStyle: "italic", py: 2 }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              ) : (
                //  Render table rows when data is available
                visibleRows.map((row) => {
                  const isSubCategorySelected = selected.has(`${row.id}`);
                  return (
                    <TableRow hover key={row.id}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSubCategorySelected} onChange={(e) => handleSubCategorySelect(e, `${row.id}`)} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">{row.name}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">{row.branch}</TableCell>
                      <TableCell align="right">{row.role}</TableCell>
                    </TableRow>
                  );
                })
              )}

              {/* 🔹 Preserve table height when empty but not loading */}
              {emptyRows > 0 && !isLoading && visibleRows.length > 0 && (
                <TableRow sx={{ height: 33 }}>
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
       
    </div>
  );
}
