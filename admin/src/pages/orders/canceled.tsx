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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import orders from "../../data/orders.json";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, TextField } from '@mui/material';
import { useGetOrdersQuery } from '../../features/api/orderApi';
import ReactLoading from 'react-loading';


interface Data {

  id: number;
  datatime: string;
  name: string;
  address: string;
  phone: string;
  discountDeduction: number;
  deliveryFee: number;
  subTotal: number;
  grandTotal: number;
  type: string;
  pickUpType: string;
  order: Array<any>;
  status: string;
  dateTimePickUp: any | null;
}

// Data Row Creation
function createData(
  id: number,
  datatime: string,
  name: string,
  address: string,
  phone: string,
  discountDeduction: number,
  deliveryFee: number,
  subTotal: number,
  grandTotal: number,
  type: string,
  pickUpType: string,
  order: Array<any>,
  status: string,
  dateTimePickUp: any | null
): Data {
  return {
    id,
    datatime,
    name,
    address,
    phone,
    discountDeduction,
    deliveryFee,
    subTotal,
    grandTotal,
    type,
    pickUpType,
    order,
    status,
    dateTimePickUp
  };
}


// Sorting Functions
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];

  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    return valueA[0] < valueB[0] ? -1 : valueA[0] > valueB[0] ? 1 : 0;
  } else if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB);
  } else if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB;
  }

  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (
  a: { [key in Key]: number | string | any[] },
  b: { [key in Key]: number | string | any[] }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
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
  { id: 'datatime', numeric: false, disablePadding: true, label: 'Date and Time' },
  { id: 'name', numeric: true, disablePadding: false, label: 'Name' },
  { id: 'address', numeric: true, disablePadding: false, label: 'Address' },
  { id: 'phone', numeric: true, disablePadding: false, label: 'Phone' },
  { id: 'grandTotal', numeric: true, disablePadding: false, label: 'Total Price' },
];

// Table Header Component
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Toolbar Component with Filter
interface EnhancedTableToolbarProps {
  numSelected: number;
  onFilterChange: (event: SelectChangeEvent<string>) => void;
  filterValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterOrderChange: (event: SelectChangeEvent<string>) => void;
  filterOrder: string;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { onSearchChange, onFilterChange, filterValue, filterOrder,handleFilterOrderChange} = props;

  return (
    <Toolbar>
      <Typography sx={{ marginRight:2, fontFamily:"Madimi One"}} variant="h6" component="div">
        CANCELED ORDERS
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
            <InputLabel id="type-filter-label">Type</InputLabel>
            <Select
              labelId="type-filter-label"
              value={filterValue}
              onChange={onFilterChange}
              label="Type"
              size="small"
              sx={{ width: 110 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PickUp">PickUp</MenuItem>
              <MenuItem value="Delivery">Delivery</MenuItem>
            </Select>
        </FormControl>
        <FormControl>
            <InputLabel id="type-filter-label">Order Type</InputLabel>
            <Select
              labelId="type-filter-label"
              value={filterOrder}
              onChange={handleFilterOrderChange}
              label="Type"
              size="small"
              sx={{ width: 110 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Advance Order">Advance Order</MenuItem>
              <MenuItem value="Normal Order">Normal Order</MenuItem>
            </Select>
        </FormControl>
      </Box>
      
    </Toolbar>
  );
}


export default function Canceled() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('datatime');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterType, setFilterType] = React.useState<string>('');
  const [filterOrder, setFilterOrder] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const { data: orders, error, isLoading } = useGetOrdersQuery();
  const [rows, setRows] = React.useState<any[]>([]); 
     
   React.useEffect(() => {
     if (orders) {
 
       setRows(orders.map((order, index) =>
         createData(
           index + 1,
           order.timestamp,
           order.user.name,
           order.location?.description || order.branch.branchName +', '+ order.branch.fullAddress,
           order.user.email,
           order.fees.discountDeduction,
           order.fees.deliveryFee,
           order.fees.subTotal,
           order.fees.grandTotal,
           order.type,
           order.pick_up_type || '',
           order.order_items,
           order.status,
           order.date_time_pickup
         )
       ));
    
     }
   }, [orders]);  

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];
  
    if (selectedIndex === -1) {
      newSelected = [id];
    } else {
      newSelected = [];
    }
  
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
  };
  const handleFilterOrderChange = (event: SelectChangeEvent<string>) => {
    setFilterOrder(event.target.value);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const filteredRows = rows
    .filter(row => !filterType || row.type === filterType)  
    .filter(row => row.status === 'canceled')  
    .filter(row => {
      // Apply the filter based on filterOrder
      if (filterOrder === 'All') {
        return true; // Show all rows
      } else if (filterOrder === 'Advance Order') {
        return row.dateTimePickUp; // Show rows with a dateTimePickUp
      } else if (filterOrder === 'Normal Order') {
        return !row.dateTimePickUp; // Show rows without a dateTimePickUp
      }
      return true; // Default case to show all rows if no filterOrder is set
    })
    .filter(row => {
      const searchTermLower = searchTerm.toLowerCase();
      // Apply search term across multiple fields (name, phone, datatime)
      return (
        row.name.toLowerCase().includes(searchTermLower) || 
        row.phone.toLowerCase().includes(searchTermLower) || 
        row.datatime.toLowerCase().includes(searchTermLower)
      );
    });
  

    
  

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );

  return (
    <div style={{ display: 'flex', flexDirection: "row", gap: 20}}>
       <Box sx={{ width: '70%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          onFilterChange={handleFilterChange} 
          filterValue={filterType} 
          onSearchChange={handleSearchChange}
          handleFilterOrderChange={handleFilterOrderChange}
          filterOrder={filterOrder}
          />
          <TableContainer sx={{ width: '100%' }}>
            <Table aria-labelledby="tableTitle" size="small" sx={{ width: '100%' }}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredRows.length}
              />
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                        <ReactLoading type="spinningBubbles" color="#FB7F3B" height={30} width={30} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : visibleRows.length > 0 ? (
                  visibleRows.map((row, index) => {
                    const isItemSelected = selected.includes(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">
                          {row.datatime}
                        </TableCell>
                        <TableCell align="right">{row.name}</TableCell>
                        <TableCell align="right">{row.address}</TableCell>
                        <TableCell align="right">{row.phone}</TableCell>
                        <TableCell align="right">{row.grandTotal}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: 'gray', fontStyle: 'italic', py: 4 }}>
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}

                {emptyRows > 0 && !isLoading && visibleRows.length > 0 && (
                  <TableRow style={{ height: 33 }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
            const selectedRow = rows.find(row => row.id === selected[0]);

            return (
            <div className='p-2 '>
            
                <div className='flex flex-row gap-20 w-full'>
                  <div>
                    <div>
                      <p className='font-bold'>Name:</p>
                      <p>{selectedRow?.name}</p>
                    </div>
                    <div>
                      <p className='font-bold'>Phone:</p>
                      <p>{selectedRow?.phone}</p>
                    </div>
                  </div>

                  <div>
                    <div>
                      <p className='font-bold'>Type:</p>
                      <p> {selectedRow?.type + ", " + selectedRow?.pickUpType}</p>
                    </div>
                  <div>
                      <p className='font-bold'>Location:</p>
                      <p>{selectedRow?.address}</p>
                  </div>
                  </div>

              </div>

              {
                selectedRow?.dateTimePickUp ?

                <div>
                  <div>
                    <p className='font-bold'>Advance Order:</p>
                    <p>Yes</p>
                  </div>
                  <div>
                    <p className='font-bold'>Expected Date and Time:</p>
                    <p>{selectedRow?.dateTimePickUp}</p>
                  </div>
                </div> :

                <div>
                  <p className='font-bold'>Advance Order:</p>
                  <p>No</p>
                </div>

              }
                  <p className='font-bold'>Order List:</p>
                  <div className=' rounded-2xl mt-1 border-4 ' style={{borderColor:"#FB7F3B"}}>
                  <div className='pr-4 pl-4 pt-2 rounded-2xl' style={{backgroundColor: "#FFEEE5"}}>
                      {
                        selectedRow?.order.map((item: { label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; price: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; addOns: any[]; }, index: React.Key | null | undefined) => (
                          <div key={index}>
                            <div className="flex justify-between text-end ">
                              <p className="font-bold w-full">{item.label}</p>
                              <p className="pr-1 pl-1">-</p>
                              <p className="w-full">{item.price}</p>
                            </div>
                            {
                              item.addOns?.map((addon: any, addonIndex: number) => (
                                <div key={addonIndex} className="flex justify-between text-end">
                                  <p className="text-xs w-full">{addon.label}</p>
                                  <p className="pr-1 pl-1">-</p>
                                  <p className=" text-xs w-full">{addon.price}</p>
                                </div>
                              ))
                            }
                          </div>
                        ))
                      }
                    </div>
                      <div className=' bg-white border-t-4 border-dashed flex flex-col text-end pr-3 p-2' style={{borderColor:"#FB7F3B"}}>
                          <p className='font-bold'>SubTotal: PHP {selectedRow?.subTotal}</p>
                          <p className='font-bold'>Discount: PHP {selectedRow?.discountDeduction}</p>
                          <p className='font-bold'>Delivery Fee: PHP {selectedRow?.deliveryFee}</p>
                      </div>
                      <div className='text-white flex flex-row  justify-end items-center gap-3 pr-3 rounded-b-sm' style={{backgroundColor:"#FB7F3B"}}>
                        <p className=' font-bold text-lg'>Grand Total:  </p>
                        <p  className='font-bold text-lg'> PHP {selectedRow?.grandTotal}</p>
                      </div>
                  </div>
                    
      
              </div>
            );
          })()) : <div className="w-full h-full flex justify-center items-center text-center"><p className='text text-gray-800'>Click a row to see the details.</p></div>}
      </Box>  
    </div>
  );
}
