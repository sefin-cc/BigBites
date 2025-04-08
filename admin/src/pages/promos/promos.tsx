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
import { SelectChangeEvent, Checkbox, TextField } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import AddPromoModal from './addPromos';
import EditPromoModal from './editPromos';
import { useGetPromosQuery, useDeletePromoMutation } from '../../features/api/promoApi';
import ReactLoading from 'react-loading';
import { Slide, toast } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../features/loadingSlice';
import { useDeleteImageMutation } from '../../features/api/imageApi';


// Data Types
interface Data {
  id: number;
  label: string;
  image: string;
}

// Data Row Creation
function createData(id: number, label: string, image: string): Data {
  return {
    id,
    label,
    image,
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
  { id: 'label', numeric: false, disablePadding: true, label: 'Label' },
  { id: 'image', numeric: true, disablePadding: false, label: 'Image Link' },
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
            padding={'normal'}
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
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected: Set<string>;
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { onSearchChange, selected, handleDelete} = props;

  return (
    <Toolbar sx={{ flex: 1, flexDirection: "column" }}>
      <Typography variant="h6" component="div" sx={{ margin: 2, fontWeight: "bold", fontFamily: "Madimi One" }}>
        PROMOS
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
        <AddPromoModal />
        {selected.size > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={handleDelete} className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}
        {selected.size === 1 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <EditPromoModal  id={selected}/>
          </div>
        ) : null}
      </Box>
    </Toolbar>
  );
}

export default function Promos() {
  const [menuCategory, setMenuCategory] = React.useState<menuCategory>('asc');
  const [sortBy, setSortBy] = React.useState<keyof Data>('label');
  const [selected, setSelected] = React.useState<Set<string>>(new Set()); // Tracks selected categories
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterType, setFilterType] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const { data: promos, error, isLoading: promoLoading } = useGetPromosQuery();
  const [rows, setRows] = React.useState<any[]>([]); 
  const [deletePromo] = useDeletePromoMutation();
  const dispatch = useDispatch();
  const [deleteImage] = useDeleteImageMutation();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (promos) {
      setRows(promos.map(promo => createData(
        promo.id,
        promo.label,
        promo.image,
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
  }, [promos]);  

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

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = rows
    .filter(row => !filterType || row.label === filterType) // Apply filter
    .filter(row => row.label.toLowerCase().includes(searchTerm.toLowerCase())); // Apply search

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
      setIsLoading(true);
      for (const promoId of selected) {
        const promo = rows.find((row) => `${row.id}` === promoId); 
        if (promo && promo.image) {
          await deleteImage({ url: promo.image }).unwrap(); 
        }
        
        await deletePromo(Number(promoId)).unwrap(); 
      }
      // await Promise.all(Array.from(selected).map((id) => deletePromo(Number(id)).unwrap()));
  
      toast.success(`${selected.size > 1 ? 'Promos' : 'Promo'} deleted successfully!`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Slide,
      });
  
      setSelected(new Set()); // Clear selection after successful deletion
    } catch (err) {
      console.error('Failed to delete promo:', err);
  
      toast.error('Something went wrong!', {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Slide,
      });
    }finally{
      setIsLoading(false);
    }
  };

      useEffect(() => {
        dispatch(setLoading(isLoading));
      }, [isLoading]);

  return (
    <div style={{ display: 'flex', flexDirection: "row", gap: 20 }}>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            onSearchChange={handleSearchChange}
            selected={selected}
            handleDelete={handleDelete}
          />
          <TableContainer sx={{ width: '100%' }}>
          <Table
              aria-labelledby="tableTitle"
              size="small"
              sx={{ width: '100%', minHeight: 100 }} 
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
              {promoLoading ? (
                // Show loading indicator first
                <TableRow>
                    <TableCell colSpan={7}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                        <ReactLoading type="spinningBubbles" color="#FB7F3B" height={30} width={30} />
                      </Box>
                    </TableCell>
                  </TableRow>
              ) : visibleRows.length > 0 ? (
                // Show data if available
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
                      <TableCell component="th" scope="row" padding="normal">
                        {row.label}
                      </TableCell>
                      <TableCell align="right">
                        <a href={row.image} target="_blank" >
                          <img 
                            src={row.image} 
                            alt={row.label} 
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 5 }}
                          />
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                // Show "No Data Available" only if not loading and empty
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: "gray", fontStyle: "italic", py: 4 }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              )}

              {/*  Preserve table structure when empty but not loading */}
              {emptyRows > 0 && !promoLoading && visibleRows.length > 0 && (
                <TableRow style={{ height: 33 }}>
                  <TableCell colSpan={3} />
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
