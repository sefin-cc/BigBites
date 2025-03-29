import * as React from 'react';
import { alpha } from '@mui/material/styles';
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
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddSubCategoryModal from './addSubcategoryModal';
import EditSubCategoryModal from './editSubcategoryModal';
import { useGetMenuQuery } from '../../features/api/menu/menu';
import ReactLoading from 'react-loading';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useDeleteSubCategoryMutation } from '../../features/api/menu/subCategoryApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../features/loadingSlice';

// Data Types
interface Data {
  category_id: number;
  category: string;
  sub_id: number;
  label: string;
  no_items: number;
}

// Data Row Creation
function createData(
  category_id: number,
  category: string,
  sub_id: number,
  label: string,
  no_items: number,
): Data {
  return {
    category_id,
    category,
    sub_id,
    label,
    no_items,
  };
}

// Sorting Functions
function descendingComparator<T>(a: T, b: T, sortBy: keyof T) {
  const valueA = a[sortBy];
  const valueB = b[sortBy];

  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    return valueA[0] < valueB[0] ? -1 : valueA[0] > valueB[0] ? 1 : 0;
  } else if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB);
  } else if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB;
  }

  return 0;
}

type menuCategory = 'asc' | 'desc';

function getComparator<Key extends keyof any>(menuCategory: menuCategory, sortBy: Key): (
  a: { [key in Key]: number | string | any[] },
  b: { [key in Key]: number | string | any[] }
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
  { id: 'category', numeric: false, disablePadding: true, label: 'Category' },
  { id: 'label', numeric: true, disablePadding: false, label: 'Sub-Category' },
  { id: 'no_items', numeric: true, disablePadding: false, label: 'No. Items' },
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
          <Checkbox
            checked={isAllSelected}
            onChange={onSelectAllClick}
          />
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
              sx={{padding: 1, fontWeight: "bold", fontSize: 19}}
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
  menu: any[]| undefined;
  numSelected: number;
  onFilterChange: (event: SelectChangeEvent<string>) => void;
  filterValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSubCategories: Set<string>;  // Keep track of selected sub-categories
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<Set<string>>>; // Allow setting the selected sub-categories
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { menu, handleDelete, onFilterChange, filterValue, onSearchChange, selectedSubCategories } = props;

  // You can add any logic you need to manage or modify selectedSubCategories here if necessary

  return (
    <Toolbar sx={{ flex: 1, flexDirection: "column" }}>
      <Typography variant="h6" component="div" sx={{ margin: 2, fontWeight: "bold", fontFamily: "Madimi One" }}>
        SUB-CATEGORY MENU
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
          <InputLabel id="type-filter-label">Categories</InputLabel>
          <Select
            labelId="type-filter-label"
            value={filterValue}
            onChange={onFilterChange}
            label="Categories"
            size="small"
            sx={{ width: 170 }}
          >
            <MenuItem value="">All</MenuItem>
            {
              [...new Set(menu?.map(item => item.category))].map((category, key) => (
                <MenuItem key={key} value={category}>
                  {category}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <AddSubCategoryModal menu={menu} />

        {selectedSubCategories.size > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={handleDelete} className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}

        {selectedSubCategories.size === 1 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <EditSubCategoryModal  menu={menu} id={selectedSubCategories}/>
          </div>
        ) : null}
      </Box>
    </Toolbar>
  );
}


export default function SubCategory() {
  const [menuCategory, setMenuCategory] = React.useState<menuCategory>('asc');
  const [sortBy, setSortBy] = React.useState<keyof Data>('category');
  const [selectedSubCategories, setSelectedSubCategories] = React.useState<Set<string>>(new Set()); // Tracks selected subcategories
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterType, setFilterType] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const { data: menu, error, isLoading, refetch } = useGetMenuQuery();
  const [deleteSubCategory, { isLoading: deleteLoading}] = useDeleteSubCategoryMutation();
  const [rows, setRows] = React.useState<any[]>([]); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (menu) {
      setRows(menu.flatMap((category) =>
          category.sub_categories.map((subCategories) =>
            createData(
              category.id,
              category.category,
              subCategories.id, 
              subCategories.label,
              subCategories.items.length
            )
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
  }, [menu]);  


  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = sortBy === property && menuCategory === 'asc';
    setMenuCategory(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Select all currently visible rows
      const newSelectedSubCategories = new Set<string>(
        visibleRows.map(row => `${row.category_id}-${row.sub_id}`)
      );
      setSelectedSubCategories(newSelectedSubCategories);
    } else {
      setSelectedSubCategories(new Set());
    }
  };
  


  const handleSubCategorySelect = (event: React.ChangeEvent<HTMLInputElement>, subId: string) => {
    const newSelectedSubCategories = new Set(selectedSubCategories);
    if (event.target.checked) {
      newSelectedSubCategories.add(subId);
    } else {
      newSelectedSubCategories.delete(subId);
    }

    setSelectedSubCategories(newSelectedSubCategories);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = rows.filter(row =>
    (filterType ? row.category === filterType : true) && 
    (row.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
     row.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(menuCategory, sortBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [menuCategory, sortBy, page, rowsPerPage, filteredRows],
  );

  const isAllSelected =
  visibleRows.length > 0 && visibleRows.every((row) =>
    selectedSubCategories.has(`${row.category_id}-${row.sub_id}`)
  );

  const handleDelete = async () => {
     
        if (selectedSubCategories.size === 0) {
          toast.warning('No Sub Catergory selected for deletion.', {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
            transition: Slide,
          });
          return;
        }
      
        if (!confirm(`Are you sure you want to delete ${selectedSubCategories.size > 1 ? 'these sub categories?' : 'this sub category?'}`)) {
          return;
        }
      
        try {
          await Promise.all(
            Array.from(selectedSubCategories).map((id) => {
              const subCategoryId = Number(id.split("-")[1]) || 0; // Extract correct ID inside loop
              return deleteSubCategory(subCategoryId).unwrap();
            })
          );

          refetch();
          
          toast.success(`${selectedSubCategories.size > 1 ? 'Branches' : 'Branch'} deleted successfully!`, {
            position: "top-right",
            autoClose: 5000,
            theme: "light",
            transition: Slide,
          });
      
          setSelectedSubCategories(new Set()); // Clear selection after successful deletion
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
            numSelected={selectedSubCategories.size}
            onFilterChange={handleFilterChange}
            filterValue={filterType}
            onSearchChange={handleSearchChange}
            selectedSubCategories={selectedSubCategories}
            setSelectedSubCategories={setSelectedSubCategories}
            menu={menu}
            handleDelete={handleDelete}
          />
          <TableContainer sx={{ width: '100%' }}>
          <Table
            aria-labelledby="tableTitle"
            size="small"
            sx={{ width: '100%', minHeight: 100 }}
          >
            <EnhancedTableHead
              numSelected={selectedSubCategories.size}
              menuCategory={menuCategory}
              sortBy={sortBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
              isAllSelected={isAllSelected}
          />

          <TableBody>
            {isLoading ? (
               <TableRow>
                  <TableCell colSpan={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                      <ReactLoading type="spinningBubbles" color="#FB7F3B" height={30} width={30} />
                    </Box>
                  </TableCell>
                </TableRow>
            ) : visibleRows.length > 0 ? (
              visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover key={`${row.subId}`}>
                    <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSubCategories.has(`${row.category_id}-${row.sub_id}`)}
                      onChange={(e) => handleSubCategorySelect(e, `${row.category_id}-${row.sub_id}`)}
                    />

                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {row.category}
                    </TableCell>
                    <TableCell align="right">{row.label}</TableCell>
                    <TableCell align="right">{row.no_items}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: "gray", fontStyle: "italic", py: 4 }}>
                  No Data Available
                </TableCell>
              </TableRow>
            )}

            {emptyRows > 0 && !isLoading && visibleRows.length > 0 && (
              <TableRow style={{ height: 33 }}>
                <TableCell colSpan={4} />
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
