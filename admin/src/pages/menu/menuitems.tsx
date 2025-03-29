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
import AddMenuItemsModal from './addMenuItemsModal';
import EditMenuItemsModal from './editMenuItemsModal';
import { useGetMenuQuery } from '../../features/api/menu/menu';
import ReactLoading from 'react-loading';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useDeleteItemMutation } from '../../features/api/menu/itemApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../features/loadingSlice';

// Data Types
interface Data {
  id: number,
  category: string,
  subId: number,
  subLabel: string,
  itemId: number,
  itemLabel: string,
  itemFullLabel: string,
  description: string,
  price: number,
  time: string,
  image:  string,
  addOns: any[]
}

// Data Row Creation
function createData(
  id: number,
  category: string,
  subId: number,
  subLabel: string,
  itemId: number,
  itemLabel: string,
  itemFullLabel: string,
  description: string,
  price: number,
  time: string,
  image:  string,
  addOns: any[]
): Data {
  return {
    id,
    category,
    subId,
    subLabel,
    itemId,
    itemLabel,
    itemFullLabel,
    description,
    price,
    time,
    image,
    addOns
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
  { id: 'itemLabel', numeric: false, disablePadding: true, label: 'Item Label' },
  { id: 'price', numeric: false, disablePadding: false, label: 'Price' },
];

// Table Header Component
interface EnhancedTableProps {

  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  menuCategory: menuCategory;
  sortBy: string;

}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {  menuCategory, sortBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>

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
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { menu, numSelected, onFilterChange, filterValue, onSearchChange } = props;
  const [categoryType, setCategoryType] = React.useState<string>('BURGERS');

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategoryType(event.target.value);
  };

  return (
    <Toolbar sx={{ flex: 1, flexDirection: "column" }}>
      <Typography variant="h6" component="div" sx={{ margin: 2, fontWeight: "bold", fontFamily: "Madimi One" }}>
        MENU ITEMS
      </Typography>

      <Box sx={{ display: "flex", flex: 1, width: "100%", gap: 1}}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{ flex: 1 , minWidth: 200 }}
          onChange={onSearchChange}
          placeholder="Search..."
        />

        <FormControl>
          <InputLabel id="type-filter-label">Categories</InputLabel>
          <Select
            labelId="type-filter-label"
            value={categoryType}
            onChange={handleCategoryChange}
            label="Categories"
            size="small"
            sx={{ width: 200 }}
          >
            {
              // Extract unique categories from rows
              [...new Set(menu?.map(item => item.category))].map((category, key) => (
                <MenuItem key={key} value={category}>
                  {category}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="type-filter-label">Sub-Categories</InputLabel>
          <Select
            labelId="type-filter-label"
            value={filterValue}
            onChange={onFilterChange}
            label="Sub-Categories"
            size="small"
            sx={{ width: 200 }}
            disabled={!categoryType}  // Disable subcategory dropdown until a category is selected
          >
          {
              menu
                ?.find(cat => cat.category === categoryType) 
                ?.sub_categories 
                ?.map((subcat:any, key:number) => (
                  <MenuItem key={key} value={subcat.label}>
                    {subcat.label}
                  </MenuItem>
                )) || [] 
            }
          </Select>
        </FormControl>

        <AddMenuItemsModal menu={menu} />

        {numSelected > 0 ? (
          <div style={{ display: "flex", gap: 5 }}>
            <button className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
              <DeleteIcon sx={{ color: "gray" }} />
            </button>
          </div>
        ) : null}

        {numSelected === 1 ? (
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


export default function MenuItems() {
  const [menuCategory, setMenuCategory] = React.useState<menuCategory>('asc');
  const [sortBy, setSortBy] = React.useState<keyof Data>('category');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filterType, setFilterType] = React.useState<string>('JR BURGERS');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const { data: menu, error, isLoading, refetch} = useGetMenuQuery();
  const [rows, setRows] = React.useState<any[]>([]); 
  const [deleteMenuItem, { isLoading: deleteLoading}] = useDeleteItemMutation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (menu) {
      setRows(menu.flatMap((category) =>
        category.sub_categories.flatMap((subCategory) =>
          subCategory.items.map((item) => 
            createData(
              category.id,        
              category.category,                  
              subCategory.id, 
              subCategory.label,                     
              item.id, 
              item.label,                         
              item.full_label,                       
              item.description,                    
              item.price,                            
              item.time,                           
              item.image,                            
              item.add_ons                           
            )
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

  const handleClick = (event: React.MouseEvent<unknown>, uniqueId: string) => {
    const selectedIndex = selected.indexOf(uniqueId);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
        // Select the clicked row
        newSelected = [uniqueId];
    } else {
        // Deselect if already selected
        newSelected = [];
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

  const filteredRows = rows.filter(row =>
    (filterType ? row.subLabel === filterType : true) && 
    (row.itemFullLabel.toLowerCase().includes(searchTerm.toLowerCase()) || 
     row.subLabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(menuCategory, sortBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [menuCategory, sortBy, page, rowsPerPage, filteredRows],
  );

  const handleDelete = async (id: number) => {
    
      if (selected.length === 0) {
        toast.warning('No Menu item selected for deletion.', {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Slide,
        });
        return;
      }
    
      if (!confirm(`Are you sure you want to delete  this Menu Item?`)) {
        return;
      }
    
      try {
        await deleteMenuItem(id).unwrap();

        refetch();
        
        toast.success(`Menu Item deleted successfully!`, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Slide,
        });
    
        setSelected([]); 
      } catch (err) {
        console.error('Failed to delete menu item:', err);
    
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
      <Box sx={{ width: '75%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            menu={menu}
            numSelected={selected.length}
            onFilterChange={handleFilterChange}
            filterValue={filterType}
            onSearchChange={handleSearchChange}
          />
          <TableContainer sx={{ width: '100%' }}>
          <Table aria-labelledby="tableTitle" size="small" sx={{ width: '100%', minHeight: 100 }}>
            <EnhancedTableHead
              menuCategory={menuCategory}
              sortBy={sortBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                      <ReactLoading type="spinningBubbles" color="#FB7F3B" height={30} width={30} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : visibleRows.length > 0 ? (
                visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow 
                        hover 
                        onClick={(event) => handleClick(event, `${row.id}-${row.subId}-${row.itemId}`)} 
                        key={`${row.id}-${row.subId}-${row.itemId}`}
                      >
                      <TableCell component="th" id={labelId} scope="row">
                        {row.itemLabel}
                      </TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ color: 'gray', fontStyle: 'italic', py: 4 }}>
                    No Data Available
                  </TableCell>
                </TableRow>
              )}

              {emptyRows > 0 && !isLoading && visibleRows.length > 0 && (
                <TableRow style={{ height: 33 }}>
                  <TableCell colSpan={2} />
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

      <Box sx={{ 
        width: "35%", 
        borderRadius: 3, 
        boxShadow: 2,  
        p: 2,  
        borderWidth: 4,
        borderColor:"#FB7F3B"
    
      }}>
        {selected.length > 0 ? (
          (() => {

            const selectedRow = rows.find(row => `${row.id}-${row.subId}-${row.itemId}` === selected[0]);


            return (
            <div className='p-2 '>

                <img src={selectedRow?.image}
                  style={{
                    backgroundColor: "#d6d5d2",
                    borderRadius: 3,
                    height: 200
                }}/>

                <div className='flex flex-row gap-20 w-full mt-5'>
                  <div>
                    <div>
                      <p className='font-bold'>Category:</p>
                      <p>{selectedRow?.category}</p>
                    </div>
                    <div>
                      <p className='font-bold'>Sub-Category:</p>
                      <p>{selectedRow?.subLabel}</p>
                    </div>
                    <div>
                        <p className='font-bold'>Price:</p>
                        <p>{selectedRow?.price}</p>
                    </div>
                  </div>

                  <div>
                    <div>
                        <p className='font-bold'>Label:</p>
                        <p> {selectedRow?.itemLabel}</p>
                      </div>
                      <div>
                          <p className='font-bold'>Full Label:</p>
                          <p>{selectedRow?.itemFullLabel}</p>
                      </div>
                      <div>
                        <p className='font-bold'>Time:</p>
                        <p> {selectedRow?.time}</p>
                      </div>
  
                    </div>
                  </div>
                 
                  <div>
                      <p className='font-bold'>Description:</p>
                      <p> {selectedRow?.description}</p>
                  </div>
                  <div>
                      <p className='font-bold'>AddOns:</p>
                      <div>
                        {selectedRow?.addOns?.map((item: any, index: number) => (
                          <p className='pr-2' key={index}>{item.label} - PHP{item.price}</p> 
                        ))}
                      </div>
                  </div>

                  <div className="flex justify-between mt-5 w-full">
                    <EditMenuItemsModal menu={menu} itemId={selectedRow?.itemId} categoryId={selectedRow?.id}/>
                    <button onClick={() =>handleDelete(selectedRow.itemId)}  className="text text-white  px-6 py-1 rounded-md focus:outline-none justify-center gap-1 items-center flex " style={{backgroundColor: "#C1272D"}}   disabled={deleteLoading} >
                      {deleteLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "DELETE"}
                    </button>
                  </div>
              </div>
            );
          })()) : <div className="w-full h-full flex justify-center items-center text-center"><p className='text text-gray-800'>Click a row to see the details.</p></div>}
      </Box>
      <ToastContainer/>
    </div>
  );
}
