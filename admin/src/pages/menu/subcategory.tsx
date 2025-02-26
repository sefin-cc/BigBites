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
import menu from '../../data/menu.json';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddSubCategoryModal from '../orders/addSubcategoryModal';

// Data Types
interface Data {
  id: number;
  category: string;
  subId: number;
  label: string;
  noitems: number;
}

// Data Row Creation
function createData(
  id: number,
  category: string,
  subId: number,
  label: string,
  noitems: number,
): Data {
  return {
    id,
    category,
    subId,
    label,
    noitems,
  };
}

// Mapping orders to rows
const rows = menu.flatMap((category) =>
  category.subCategories.map((subCategories) =>
    createData(
      parseInt(category.id, 10),
      category.category,
      parseInt(subCategories.subId, 10),
      subCategories.label,
      subCategories.items.length
    )
  )
);

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
  { id: 'noitems', numeric: true, disablePadding: false, label: 'No. Items' },
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
  numSelected: number;
  onFilterChange: (event: SelectChangeEvent<string>) => void;
  filterValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSubCategories: Set<string>;  // Keep track of selected sub-categories
  setSelectedSubCategories: React.Dispatch<React.SetStateAction<Set<string>>>; // Allow setting the selected sub-categories
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onFilterChange, filterValue, onSearchChange, selectedSubCategories, setSelectedSubCategories } = props;

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
              [...new Set(rows.map(item => item.category))].map((category, key) => (
                <MenuItem key={key} value={category}>
                  {category}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>



        <AddSubCategoryModal />

        {selectedSubCategories.size > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}

        {selectedSubCategories.size === 1 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <ModeEditRoundedIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}
      </Box>
    </Toolbar>
  );
}


export default function SubCategory() {
  const [menuCategory, setMenuCategory] = React.useState<menuCategory>('asc');
  const [sortBy, setSortBy] = React.useState<keyof Data>('category');
  const [selectedCategories, setSelectedCategories] = React.useState<Set<number>>(new Set()); // Tracks selected categories
  const [selectedSubCategories, setSelectedSubCategories] = React.useState<Set<string>>(new Set()); // Tracks selected subcategories
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterType, setFilterType] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = sortBy === property && menuCategory === 'asc';
    setMenuCategory(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const visibleRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const newSelectedSubCategories = new Set<string>();
    visibleRows.forEach((row) => {
      newSelectedSubCategories.add(`${row.id}-${row.subId}`);
    });

    if (event.target.checked) {
      setSelectedSubCategories(newSelectedSubCategories);
    } else {
      setSelectedSubCategories(new Set());
    }
  };

  const handleCategorySelect = (event: React.ChangeEvent<HTMLInputElement>, categoryId: number) => {
    const newSelectedCategories = new Set(selectedCategories);
    const newSelectedSubCategories = new Set(selectedSubCategories);
    if (event.target.checked) {
      newSelectedCategories.add(categoryId);
      rows
        .filter((row) => row.id === categoryId)
        .forEach((row) => newSelectedSubCategories.add(`${row.id}-${row.subId}`));
    } else {
      newSelectedCategories.delete(categoryId);
      rows
        .filter((row) => row.id === categoryId)
        .forEach((row) => newSelectedSubCategories.delete(`${row.id}-${row.subId}`));
    }

    setSelectedCategories(newSelectedCategories);
    setSelectedSubCategories(newSelectedSubCategories);
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
      selectedSubCategories.has(`${row.id}-${row.subId}`)
    );

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
          />
          <TableContainer sx={{ width: '100%' }}>
            <Table
              aria-labelledby="tableTitle"
              size={'small'}
              sx={{ width: '100%' }}
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
                {visibleRows.map((row, index) => {
                  const isCategorySelected = selectedCategories.has(row.id);
                  const isSubCategorySelected = selectedSubCategories.has(`${row.id}-${row.subId}`);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      key={`${row.id}-${row.subId}`}
                    >
                      <TableCell padding="checkbox">
                        {row.subId === 0 ? (
                          // Category checkbox
                          <Checkbox
                            checked={isCategorySelected}
                            onChange={(e) => handleCategorySelect(e, row.id)}
                          />
                        ) : (
                          // Sub-category checkbox
                          <Checkbox
                            checked={isSubCategorySelected}
                            onChange={(e) => handleSubCategorySelect(e, `${row.id}-${row.subId}`)}
                          />
                        )}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.category}
                      </TableCell>
                      <TableCell align="right">{row.label}</TableCell>
                      <TableCell align="right">{row.noitems}</TableCell>
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
