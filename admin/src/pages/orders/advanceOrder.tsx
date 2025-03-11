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
import orders from "../../data/orders.json";
import { visuallyHidden } from '@mui/utils';
import { TextField } from '@mui/material';

// Data Types
interface Data {
  id: number;
  datatime: string;
  name: string;
  address: string;
  phone: string;
  discountDeduction: number;
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
    subTotal,
    grandTotal,
    type,
    pickUpType,
    order,
    status,
    dateTimePickUp
  };
}

// Mapping orders to rows
const rows = orders.map((order, index) =>
  createData(
    index + 1,
    order.timestamp,
    order.costumer || 'Unknown',
    order.location?.description || order.branch[0].branchName +', '+ order.branch[0].fullAddress,
    order.costumer || '0978787877',
    order.fees.discountDeduction,
    order.fees.subTotal,
    order.fees.grandTotal,
    order.type,
    order.pickUpType || '',
    order.order,
    order.status,
    order.dateTimePickUp
  )
);

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
    { id: 'dateTimePickUp', numeric: false, disablePadding: true, label: 'Expected Date and Time' },
    { id: 'datatime', numeric: false, disablePadding: true, label: 'Timestamp' },
    { id: 'name', numeric: true, disablePadding: false, label: 'Name' },
    { id: 'address', numeric: true, disablePadding: false, label: 'Address' },
    { id: 'phone', numeric: true, disablePadding: false, label: 'Phone' },
    { id: 'grandTotal', numeric: true, disablePadding: false, label: 'Total Price' },
];

// Table Header Component
interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {  order, orderBy, onRequestSort } = props;
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

interface EnhancedTableToolbarProps {
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { onSearchChange } = props;
    return (
        <Toolbar>
            <Typography sx={{ marginRight:2, fontFamily:"Madimi One"}} variant="h6" component="div">
                PENDING ADVANCE ORDERS
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
            </Box>
        </Toolbar>
    );
}

// Main Pending Orders Component
export default function AdvanceOrders() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('dateTimePickUp');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
 const [searchTerm, setSearchTerm] = React.useState<string>('');

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const filteredRows = rows
    .filter(row => row.status === 'pending')  // Apply filter for 'completed' status
    .filter(row => row.dateTimePickUp)  
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
            onSearchChange={handleSearchChange}
        />
          <TableContainer sx={{ width: '100%' }}>
            <Table
              aria-labelledby="tableTitle"
              size={'small'}
              sx={{ width: '100%' }}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
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
                      <TableCell padding="checkbox">
                      
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.dateTimePickUp}
                      </TableCell>
                      <TableCell align="right">{row.datatime}</TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.address}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">{row.grandTotal}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 33,
                    }}
                  >
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
                  <div>
                  <div>
                    <p className='font-bold'>Advance Order:</p>
                    <p>Yes</p>
                  </div>
                  <div>
                    <p className='font-bold'>Expected Date and Time:</p>
                    <p>{selectedRow?.dateTimePickUp}</p>
                  </div>
                </div>
                  <p className='font-bold'>Order List:</p>
                  <div className=' rounded-2xl mt-1 border-4 ' style={{borderColor:"#FB7F3B"}}>
                  <div className='pr-4 pl-4 pt-2 rounded-2xl' style={{backgroundColor: "#FFEEE5"}}>
                      {
                        selectedRow?.order.map((item, index) => (
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
                      </div>
                      <div className='text-white flex flex-row  justify-end items-center gap-3 pr-3 rounded-b-sm' style={{backgroundColor:"#FB7F3B"}}>
                        <p className=' font-bold text-lg'>Grand Total:  </p>
                        <p  className='font-bold text-lg'> PHP {selectedRow?.grandTotal}</p>
                      </div>
                  </div>
                    
                  <div className="flex justify-between mt-4 w-full">
                    <button className="text text-white  px-4 py-2 rounded-md focus:outline-none" style={{backgroundColor: "#2C2C2C"}}>COMPLETED</button>
                    <button className="text text-white  px-4 py-2 rounded-md focus:outline-none justify-center gap-1 items-center flex " style={{backgroundColor: "#C1272D"}}>
                      <p>CANCEL ORDER</p>
                    </button>
                  </div>
              </div>
            );
          })()) : <div className="w-full h-full flex justify-center items-center text-center"><p className='text text-gray-800'>Click a row to see the details.</p></div>}
      </Box>  
    </div>
  );
}
