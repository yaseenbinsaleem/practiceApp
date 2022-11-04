/**
 * Import all the necessary modules
 */
import Edit from './edit';
import moment from 'moment';
import Radio from '@mui/material/Radio';
import PrintIcon from '@material-ui/icons/Print';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import { GetTypes } from 'redux/reducers/Types';
import { user } from '@jumbo/utils/localStorage';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';
import { GetPurchase } from 'redux/reducers/Purchase';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches } from 'redux/reducers/Branches';
import CustomDataGridStyle from 'theme/CustomDataGridStyle';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { GetSubAccountList } from 'redux/reducers/SubAccounts';
import { Box, Grid, Button, Checkbox } from '@material-ui/core';
import { getJournalVouchers } from 'redux/reducers/JournalVoucher';
import DatePicker from 'components/ReusableComponent/CustomDatePickerComponent';
import { checkconditions, checkLengthGreaterThanZero } from 'services/functions';
import OrganizationDropdown from 'components/ReusableComponent/OrganizationDropdown';
import CustomDropDownComponent from 'components/ReusableComponent/CustomDropDownComponent';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

/**
 * @initialEditState all the fields of edit file will be initialize here first
 * if the field is a date value will be null,
 * if a dropdown or input field then empty string ''
 * if number then 0
 */
const initialEditState = {
  PurchaseId: '',
  Branch: '',
  TransactionType: 'L ',
  ReferenceNo: '',
  TransactionDate: null,
  Calendar: '',
  PurchaseOrderNo: '',
  PurchaseOrderDate: null,
  Supplier: '',
  CreditPeriod: '',
  SupplierQuotationNo: '',
  Currency: '',
  ExchangeRate: '',
  ExchangeRate: '',
  SupplierInvoiceNo: '',
  SupplierInvoiceDate: null,
  GSTInvoiceNo: '',
  GSTInvoiceDate: null,
  BillOfEntryNo: '',
  BillOfEntryDate: null,
  LCNO: '',
  LCDate: null,
  PurchaseAccount: '',
  SalesTaxAccount: '',
  RateType: '',
  GSTRate: '',
  AmountExcludingGST: '',
  GSTAmount: '',
  Narration: '',
  Status: '',
  IsPosted: '',
  PostingDate: null,
  DeliveryDate: null,
  DeliveryAddress: '',
  Voucher: '',
  Organization: '',
};

/**
 * @function Main in this system we are using arrow functions
 * @returns a jsx module that will create a a Data Grid and Form
 */
const Main = () => {
  /**
   * to extract the tab Id from tabs ( redux state ) no need to edit this section
   * section start TabId
   */
  const [pageLocation, setPageLocation] = useState(window?.location?.pathname);
  const location = useLocation();
  const { state: params } = location;
  const [tabId, setTabId] = useState(params?.tabId);
  const { tabs } = useSelector(state => state);
  const dispatch = useDispatch();
  useEffect(() => {
    if (params?.tabId) {
      setTabId(params.tabId);
    }
  }, []);

  useEffect(() => {
    if (!tabId) {
      if (tabs.length) {
        let thisTab = tabs.find(v => v.TabPath === pageLocation);
        setTabId(thisTab.TabId);
      }
    }
    // eslint-disable-next-line
  }, [tabs]);

  /**
   * Section End TabId
   */

  const classes = CustomDataGridStyle();
  // common in all pages ( handle data in dataGrid )
  const [tblData, setTblData] = useState([]);
  // common in all pages ( handle Add Form )
  const [showAddForm, setShowAddForm] = React.useState(false);
  // common in all pages ( handle Edit Form )
  const [showEditForm, setShowEditForm] = React.useState(false);
  // common in all pages ( to call api on searchClick )
  const [searchClick, setSearchClick] = React.useState(false);
  const [rowData, setRowData] = useState({});
  const [pageSize, setPageSize] = useState(25);
  const [editState, setEditState] = useState(initialEditState);

  const [search, setSearch] = useState({
    Organization: '',
    Branch: '',
    Supplier: '',
    TransactionType: 'l',
    FromDate: moment()
      .subtract(3, 'months')
      .format('L'),
    ToDate: moment()
      .add(1, 'week')
      .format('L'),
    Narration: '',
  });
  const {
    purchase: { Purchase },
    branches: { branches },
    subAccounts: { SubAccountList },
    journalVoucher: { journalVouchers },
  } = useSelector(state => state);

  useEffect(() => {
    dispatch(GetTypes());
  }, []);

  useEffect(() => {
    dispatch(
      fetchBranches({
        OrganizationId: checkconditions(
          '00000000-0000-0000-0000-000000000000',
          ['', undefined],
          search?.Organization?.OrganizationId,
        ),
        BranchCode: '',
        BranchName: '',
      }),
    );
    dispatch(
      GetSubAccountList({
        OrganizationId: checkconditions(
          '00000000-0000-0000-0000-000000000000',
          ['', undefined],
          search?.Organization?.OrganizationId,
        ),
        NatureId: '56456E9D-0393-44BC-8FBF-21CB34FC6027',
      }),
    );
    // eslint-disable-next-line
  }, [search && search?.Organization?.OrganizationId]);

  useEffect(() => {
    if (search?.Organization?.OrganizationId) {
      if (search?.Organization?.OrganizationId !== null) {
        dispatch(
          GetPurchase({
            OrganizationId: checkconditions(
              '00000000-0000-0000-0000-000000000000',
              ['', undefined],
              search?.Organization?.OrganizationId,
            ),
            BranchId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], search?.Branch?.BranchId),
            SupplierId: checkconditions(
              null,
              ['00000000-0000-0000-0000-000000000000', '', undefined],
              search?.Supplier?.SubAccountId,
            ),
            CostProfitCenterId: checkconditions(
              '00000000-0000-0000-0000-000000000000',
              ['', undefined],
              search?.CostProfitCenter?.CostProfitCenterId,
            ),
            TransactionType: search && search?.TransactionType,
            FromDate: search && search?.FromDate,
            ToDate: search?.ToDate ? search?.ToDate : null,
            UserId: user && user?.userId,
          }),
        );
      } else {
        setTblData([]);
      }
    }
  }, [searchClick]);

  useEffect(() => {
    if (search?.Organization?.OrganizationId !== null) setTblData(Purchase);
  }, [searchClick, Purchase]);

  const editHandler = params => {
    setRowData(params.row);
    setShowAddForm(false);
    setShowEditForm(true);
  };

  const initCol = [
    {
      headerName: 'Action',
      flex: 0.12,
      align: 'center',
      headerAlign: 'center',
      field: 'action',
      headerClassName: classes['.super-app-theme--header--left--corner'],
      renderCell: params => {
        apiRef.current = params.api;
        return (
          <Button onClick={() => editHandler(params)}>
            <EditRoundedIcon />
          </Button>
        );
      },
    },
    {
      field: 'ReferenceNo',
      headerName: 'ReferenceNo',
      flex: 1,
      align: 'left',
      flex: 0.25,
      headerAlign: 'center',
      headerClassName: classes['.super-app-theme--header'],
    },
   
    // {
    //   field: 'ReferenceNo',
    //   headerName: 'ali',
    //   flex: 0.25,
    //   align: 'center',

    //   headerAlign: 'center',
    //   headerClassName: classes['.super-app-theme--header'],
    // },
    {
      field: 'TransactionDate',
      headerName: 'Date',
      flex: 0.25,
      align: 'left',
      headerAlign: 'center',
      headerClassName: classes['.super-app-theme--header'],
      renderCell: param => {
        const { row } = param;
        return <>{param.row?.TransactionDate?.slice(0, 10)}</>;
      },
    },
    {
      field: 'BranchName',
      headerName: 'Branch',
      flex: 0.50,
      align: 'left',
      headerAlign: 'center',
      headerClassName: classes['.super-app-theme--header'],
    },
    
    {
      field: 'SupplierName',
      headerName: 'Supplier',
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      headerClassName: classes['.super-app-theme--header'],
    },
    {
      field: 'StatusName',
      headerName: 'Status',
      flex: 0.25,
      align: 'center',
      headerAlign: 'center',
      headerClassName: classes['.super-app-theme--header'],
    }
  ];

  function useApiRef() {
    const apiRef = React.useRef(null);
    const _columns = React.useMemo(
      () =>
        initCol.concat( {
          headerName: 'Print',
          flex: 0.12,
          align: 'center',
          headerAlign: 'center',
          field: 'Print',
          headerClassName: classes['.super-app-theme--header'],
          renderCell: params => {
            apiRef.current = params.api;
            return (
              <Button onClick={() => editHandler(params)}>
                <PrintIcon />
              </Button>
            );
          },
        },),
        
      [],
    );
    return { apiRef, columns: _columns };
  }

  const { apiRef, columns } = useApiRef();

  const cancelFunc = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    dispatch(
      GetPurchase({
        OrganizationId: checkconditions(
          '00000000-0000-0000-0000-000000000000',
          ['', undefined],
          search?.Organization?.OrganizationId,
        ),
        BranchId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], search?.branch?.BranchId),
        SupplierId: checkconditions(
          null,
          ['00000000-0000-0000-0000-000000000000', '', undefined],
          search?.Supplier?.SubAccountId,
        ),
        TransactionType: search && search?.TransactionType,
        FromDate: search && search?.FromDate,
        ToDate: search?.ToDate ? search?.ToDate : null,
        UserId: user && user?.userId,
      }),
    );
  };

  const handleEditState = (e, dateState) => {
    if (dateState) {
      const tempGivenDate = moment(dateState?.value).format('L');
      const existanceDate = moment(editState[dateState?.name]).format('L');
      if (tempGivenDate === existanceDate) {
        setEditState({ ...editState, [dateState.name]: null });
      } else {
        setEditState({ ...editState, [dateState.name]: dateState.value });
      }
    } else {
      setEditState({ ...editState, [e.target.name]: e.target.value });
    }
  };
  const handleSearch = (e, dateState) => {
    if (dateState) {
      const tempGivenDate = moment(dateState?.value).format('L');
      const existanceDate = moment(search[dateState?.name]).format('L');
      if (tempGivenDate === existanceDate) {
        setSearch({ ...search, [dateState.name]: null });
      } else {
        setSearch({ ...search, [dateState.name]: dateState.value });
      }
    } else {
      setSearch({ ...search, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '10px',
          justifyContent: 'right',
        }}>
        {!showAddForm && !showEditForm ? (
          <Button
            onClick={e => {
              setShowAddForm(true);
              setEditState(initialEditState);
            }}
            variant="contained"
            color="primary">
            Add
          </Button>
        ) : null}
      </div>
      <>
        {showAddForm ? (
          <>
            <Edit
              tabId={tabId}
              actionModal="add"
              cancel={cancelFunc}
              editState={editState}
              setEditState={setEditState}
              handleEditState={handleEditState}
            />
          </>
        ) : null}
        {showEditForm && !showAddForm ? (
          <>
            <Edit
              tabId={tabId}
              actionModal="edit"
              selectedRow={rowData}
              cancel={cancelFunc}
              editState={editState}
              setEditState={setEditState}
              handleEditState={handleEditState}
            />
          </>
        ) : null}
        {!showAddForm && !showEditForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', borderRadius: 10 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                marginBottom: '50px',
                backgroundColor: '#ffff',
                padding: '20px 10px',
                flexWrap: 'wrap',
                borderRadius: 5,
              }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Grid container spacing={3}>
                  <Grid item md={6} lg={6} sm={6} xs={12}>
                    <OrganizationDropdown
                      value={search?.Organization}
                      compValue={search}
                      setValue={setSearch}
                      name="Organization"
                      handle={e => handleSearch(e, false)}
                      classes={classes}
                    />
                  </Grid>
                  <Grid item md={6} lg={6} sm={6} xs={12} />
                  <Grid item md={4} lg={4} sm={12} xs={12}>
                    <CustomDropDownComponent
                      label="Branch"
                      optionArray={checkLengthGreaterThanZero(branches || [])}
                      value={search?.Branch}
                      optionLabel="BranchName"
                      name="Branch"
                      handle={e => handleSearch(e, false)}
                      classes={classes}
                    />
                  </Grid>
                  {SubAccountList?.length > 0 && (
                    <Grid item md={4} lg={4} sm={12} xs={12}>
                      <CustomDropDownComponent
                        label="Supplier"
                        // disable={SubAccountList?.length <= 0 && true}
                        optionArray={checkLengthGreaterThanZero(SubAccountList || [])}
                        value={search?.Supplier}
                        optionLabel="SubAccountName"
                        name="Supplier"
                        handle={e => handleSearch(e, false)}
                        classes={classes}
                      />
                    </Grid>
                  )}
                  <Grid item md={4} lg={4} sm={6} xs={12}>
                    <DatePicker
                      classes={classes}
                      handle={handleSearch}
                      value={search?.FromDate}
                      name="FromDate"
                      label="From"
                      def={true}
                    />
                  </Grid>
                  <Grid item md={4} lg={4} sm={6} xs={12}>
                    <DatePicker
                      classes={classes}
                      handle={handleSearch}
                      value={search?.ToDate}
                      name="ToDate"
                      label="To"
                      def={false}
                    />
                  </Grid>
                  <Grid item md={6} lg={4} sm={12} xs={12}>
                    <FormControl>
                      <FormLabel id="TransactionType">Transaction Type</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="TransactionType"
                        value={search?.TransactionType}
                        onChange={e => handleSearch(e, false)}
                        name="TransactionType">
                        <FormControlLabel value="l" control={<Radio />} label="Local" />
                        <FormControlLabel value="i" control={<Radio />} label="Import" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    lg={12}
                    sm={6}
                    xs={12}
                    style={{
                      justifyContent: 'right',
                      alignItem: 'right',
                      marginTop: 'auto',
                    }}>
                    <Box className={classes?.root} style={{ justifyContent: 'right', alignItem: 'right' }}>
                      <Button onClick={e => setSearchClick(!searchClick)} variant="outlined" color="primary">
                        <SearchIcon />
                        Search
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div style={{ width: '100%' }}>
              {tblData.length ? (
                <DataGrid
                  style={{
                    width: '100%',
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    backgroundColor: 'white',
                  }}
                  rows={tblData}
                  columns={columns}
                  autoHeight
                  rowsPerPageOptions={[25, 50, 100]}
                  apiRef={apiRef}
                  spacing={2}
                  pageSize={pageSize}
                  onPageSizeChange={newPage => setPageSize(newPage)}
                  pagination
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </>
    </>
  );
};

export default React.memo(Main);
