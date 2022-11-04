/**
 * Import all the necessary modules
 */
import moment from 'moment';
import { user } from '@jumbo/utils/localStorage';
import { getNewDate } from '@jumbo/utils/dateHelper';
import { useDispatch, useSelector } from 'react-redux';
import defaultCustomTheme from 'theme/customglobaltheme';
import { fetchBranches } from '../../redux/reducers/Branches';
import { GetCalendarByDate } from 'redux/reducers/FiscalYear';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { GetDetailAccountsByOrganizationId } from 'redux/reducers/Accounts';
import DatePicker from 'components/ReusableComponent/CustomDatePickerComponent';
import { GetDetailSubAccountsByOrganizationId, GetActiveAccountsBySubAccountId } from 'redux/reducers/SubAccounts';
import OrganizationDropdown from 'components/ReusableComponent/OrganizationDropdown';
import CustomDropDownComponent from 'components/ReusableComponent/CustomDropDownComponent';
import CustomTextFieldComponent from 'components/ReusableComponent/CustomTextFieldComponent';
import NotificationMsgComponent from 'components/ReusableComponent/NotificationMsgComponent';
import { fetchNaturesByParentId, fetchLedgerTypeByNatureParentId } from 'redux/reducers/Natures';
import FormControlButtonComponent from 'components/ReusableComponent/FormControlButtonComponent';
import { AddPurchase, GetPurchaseDetailByPurchaseId, UpdatePurchase } from 'redux/reducers/Purchase';
import { GetSubAccountList } from 'redux/reducers/SubAccounts';
import { GetExchangeRate } from 'redux/reducers/Currency';
import {
  checkconditions,
  getarrayObjById,
  validationString,
  checkLengthGreaterThanZero,
  convertTime,
} from 'services/functions';
import { Grid, Paper, FormLabel, TextField } from '@material-ui/core';
import { GetCurrenciesList } from 'redux/reducers/Currency';
import { fetchRateTypeByNatureParentId } from 'redux/reducers/Natures';
import { GetInstrumentTypesList } from 'redux/reducers/InstrumentTypes';
import { GetCostProfitCenter } from 'redux/reducers/CostProfitCenter';
import { fetchAccounts } from 'redux/reducers/Accounts';
import { GetStatusByParentId } from 'redux/reducers/Status';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Modal from './modal';
import Detail from './detail';
import DetailTotal from './detailTotal';
import { GetActiveAccountsByProductId } from 'redux/reducers/Product';

/**
 * @function Edit in this system we are using arrow functions
 * @props selectedRow, actionModal, cancel, editState, setEditState, handleEditState, tabId
 * @returns a jsx module that will create a parent-child form
 */
const Edit = ({ selectedRow, actionModal, cancel, editState, setEditState, handleEditState, tabId }) => {
  /**
   * extracting all the styling from a global function
   */
  const classes = defaultCustomTheme();
  const [notClose, setNotClose] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [Validation, setValidation] = useState(true);
  const [ChildDialogBox, setChildDialogBox] = useState(false);
  const [tableRowIndex, setTableRowIndex] = React.useState(0);
  const [TargetCurrencyId, setTargetCurrencyId] = React.useState({});
  const [TargetCurrencyInputValue, setTargetCurrencyInputValue] = React.useState('');
  const [deleteRow, setDeleteRow] = useState([]);
  /**
   * @rows child form data where you have to add all the child table field
   * @rule while adding a new column follow this rules
   * @rule if Number: 0
   * @rule if Date: null
   * @rule if Boolean: false
   * @rule if Dropdown or TextFiled: ''
   */
  const [rows, setRows] = useState([
    {
      id: 1,
      record: 0,
      PurchaseDetailId: null,
      PurchaseId: null,
      Product: '',
      ProductAccountId: '',
      ProductFamily: '',
      Quantity: 0,
      Price: 0,
      Amount: 0,
      DiscountRate: 0,
      LastPrice: 0,
      ReferencePrice: 0,
      GSTRate: 0,
      AmountExcludingGST: 0,
      GSTAmount: 0,
      Description: '',
      Barcode: '',
      Status: '',
      IsDeleted: false,
      TotalAmount: 0,
    },
  ]);

  /**
   * @function dispatch ( use as a function )
   * @explanation use to call API(s) through the redux
   */
  const dispatch = useDispatch();
  /**
   * getting data from redux store
   * @explanation when we call any API through redux the response save in the state which we already defined in the Redux file redux/reducer/YourComponent.js ( here we are extracting all the variable connected to the API(s) we are going to call in this form )
   * @note if you are going to add a new dropdown in the form have to extract there reference variable to from here to full the dropdown and call the connected API through redux after this
   */
  const {
    currency: { CurrenciesList, ExchangeRate },
    branches: { branches },
    fiscalYear: { CalendarByDate },
    organizations: { OrganizationsByUser },
    accounts: { accounts },
    subAccounts: { SubAccountList, ActiveAccountsBySubAccountId },
    natures: { RateTypeByNatureParentId },
    status: { statusByParentId },
    purchase: { PurchaseDetailByPurchaseId },
    product: { ProductFamilyList, ActiveProducts, ActiveAccountsByProductId },
  } = useSelector(state => state);

  /**
   * initialization all the state of the page ( parent form only )
   * @rule while adding a new field follow this rules
   * @rule if Number: 0
   * @rule if Date: null
   * @rule if Boolean: false
   * @rule if Dropdown or TextFiled: ''
   */
  useEffect(() => {
    if (actionModal === 'add') {
      setEditState({
        ...editState,
        PurchaseId: '',
        ActiveAccountsBySubAccountId: '',
        PurchaseAccountId: '',
        Branch: '',
        CostProfitCenter: '',
        TransactionType: '',
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
      });
      setTargetCurrencyId({
        CurrencyName: '',
        CurrencyId: '',
      });
    }
    /**
     * all the function with 0 parameter will  call here ( on page load 1 time only )
     */
    dispatch(GetCurrenciesList());
    // eslint-disable-next-line
  }, []);

  /**
   * @useEffect run when any state change
   * @condition1 : if when don't provide any dependency it will run only 1 time eg: []
   * @condition2 : run every time when the vale change of the dependency time eg: [OrganizationId]
   * @condition3 : run on every state change if you don't make a empty array of dependance eg: [OrganizationId]
   *
   */
  useEffect(() => {
    /**
     * @dispatch calling api through redux
     * @GetActiveAccountsBySubAccountId function name which we create in the redux/Your-Component.js file
     * @params OrganizationId: @uuid is very common param we are going to use this system
     * @params SubAccountId: @uuid
     * @return @ArrayOfObject ( inside the @ActiveAccountsBySubAccountId which we already import from redux state )
     */
    dispatch(
      GetActiveAccountsBySubAccountId({
        OrganizationId: checkconditions(
          '00000000-0000-0000-0000-000000000000',
          ['', undefined],
          editState?.Organization?.OrganizationId,
        ),
        SubAccountId: editState?.Supplier?.SubAccountId,
      }),
    );
    /**
     * all the dependency ( anything on which we want to call our API )
     */
  }, [editState?.Supplier]);

  useEffect(() => {
    /**
     * all the API(s) that will run when @OrganizationId change
     */
    if (editState?.Organization?.OrganizationId) {
      dispatch(
        fetchBranches({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          BranchCode: '',
          BranchName: '',
        }),
      );
      dispatch(
        fetchNaturesByParentId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          ParentId: '6EF03ED2-075A-41B5-AFA7-55BF1586AEB1',
        }),
      );
      dispatch(
        GetDetailAccountsByOrganizationId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
        }),
      );
      dispatch(
        GetActiveAccountsBySubAccountId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          SubAccountId: editState?.Supplier?.SubAccountId,
        }),
      );
      dispatch(
        fetchLedgerTypeByNatureParentId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          ParentId: '21043464-F00E-47B7-BF3E-7A3D3B4637E6',
        }),
      );
      dispatch(
        GetDetailSubAccountsByOrganizationId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          SubAccountCode: '',
          SubAccountName: '',
        }),
      );
      dispatch(
        fetchRateTypeByNatureParentId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          ParentId: 'EED2B57D-AF6C-4631-A235-40BC2605297E',
        }),
      );
      dispatch(
        GetInstrumentTypesList({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
        }),
      );
      dispatch(
        GetCostProfitCenter({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          CostProfitCenterCode: '',
          CostProfitCenterName: '',
        }),
      );
      dispatch(
        GetSubAccountList({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          NatureId: '56456E9D-0393-44BC-8FBF-21CB34FC6027',
        }),
      );
      dispatch(
        fetchAccounts({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          AccountCode: '',
          AccountName: '',
        }),
      );
      dispatch(
        GetStatusByParentId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          ParentId: '690D95F3-B40B-443B-9F2E-2548FA2B8A71',
        }),
      );
    }
  }, [editState && editState?.Organization?.OrganizationId]);

  useEffect(() => {
    if (editState?.RateType?.NatureId && editState?.Organization?.OrganizationId) {
      dispatch(
        GetExchangeRate({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          SourceId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.CurrencyId,
          ),
          CurrencyId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], TargetCurrencyId?.CurrencyId),
          RateTypeId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.RateType?.NatureId,
          ),
        }),
      );
    }
  }, [editState?.RateType?.NatureId, TargetCurrencyId?.CurrencyId, editState?.Organization?.OrganizationId]);

  useEffect(() => {
    /**
     * @Validation handle validation of the parent form
     */
    if (
      /**
       * @function validationString
       * @params first: @ArrayOfString [ every single state or value that you want to validate ] eg: editState?.Organization?.OrganizationId
       * @params second: @ArrayOfString [ every value from which you want validation ] eg: null, undefined, '', '00000000-0000-0000-0000-000000000000'
       * @return boolean: if any from both array have a mutual value then it will return @true else @false
       * @explanation in the first parameter array put all the values you want to validate and on the second parameter state put all the value from which you want to validate
       */
      !validationString(
        [
          editState?.Organization?.OrganizationId,
          editState?.Branch?.BranchId,
          editState?.Supplier?.SubAccountId,
          editState?.PurchaseAccountId?.AccountId,
          TargetCurrencyId?.id,
          editState?.TransactionType,
        ],
        ['', null, undefined, '00000000-0000-0000-0000-000000000000'],
      )
    ) {
      setValidation(false);
    } else {
      setValidation(true);
    }
    // eslint-disable-next-line
  }, [editState, rows]);

  useEffect(() => {
    if (actionModal === 'edit') {
      /**
       * this useEffect use to set default values in the fields in edit mode
       * @note if you are going to add or remove any field from parent form remove/add that/this field form this here too
       * @note In this useEffect we just set textField values to avoid extra API(s) call
       * @selectedRow : @ArrayOfString this is the same row which we pass from main.js file through props and have all the values of the which we want to populate on our parent form
       * @rules if you have a dropdown set value with the function @getarrayObjById
       * @rules if you have a textField or boolean set value by simple assign it
       * @rules if you have a number field Convert it With JS default @Number function
       */
      setEditState({
        ...editState,
        PurchaseId: selectedRow && selectedRow.PurchaseId,
        TransactionType: selectedRow?.TransactionType,
        ReferenceNo: selectedRow?.ReferenceNo,
        TransactionDate: moment(selectedRow.TransactionDate),
        PurchaseOrderNo: selectedRow?.PurchaseOrderNo,
        PurchaseOrderDate: selectedRow?.PurchaseOrderDate ? moment(selectedRow?.PurchaseOrderDate) : null,
        CreditPeriod: selectedRow?.CreditPeriod,
        SupplierQuotationNo: selectedRow?.SupplierQuotationNo,
        ExchangeRate: selectedRow?.ExchangeRate,
        SupplierInvoiceNo: selectedRow?.SupplierInvoiceNo,
        SupplierInvoiceDate: selectedRow?.SupplierInvoiceDate ? moment(selectedRow?.SupplierInvoiceDate) : null,
        GSTInvoiceNo: selectedRow?.GSTInvoiceNo,
        GSTInvoiceDate: selectedRow?.GSTInvoiceDate ? moment(selectedRow?.GSTInvoiceDate) : null,
        BillOfEntryNo: selectedRow?.BillOfEntryNo,
        BillOfEntryDate: selectedRow?.BillOfEntryDate ? moment(selectedRow?.BillOfEntryDate) : null,
        LCNO: selectedRow?.LCNO,
        LCDate: selectedRow?.LCDate ? moment(selectedRow?.LCDate) : null,
        GSTRate: selectedRow?.GSTRate,
        GSTAmount: selectedRow?.GSTAmount,
        AmountExcludingGST: selectedRow?.AmountExcludingGST,
        GSTAmount: selectedRow?.GSTAmount,
        Narration: selectedRow?.Narration,
        IsPosted: selectedRow?.IsPosted,
        PostingDate: selectedRow?.PostingDate ? moment(selectedRow?.PostingDate) : null,
        DeliveryDate: selectedRow?.DeliveryDate ? moment(selectedRow?.DeliveryDate) : null,
        DeliveryAddress: selectedRow?.DeliveryAddress,
        ReferenceNo: selectedRow?.ReferenceNo,
        PurchaseOrderNo: selectedRow?.PurchaseOrderNo,
        StatusId: selectedRow?.StatusId,
      });
    }
  }, [selectedRow, actionModal]);

  useMemo(() => {
    if (actionModal === 'edit') {
      /**
       * this useEffect use to set default values in the fields in edit mode
       * @note If you are going to add a Dropdown in the parent form you have to handle it in edit state like this
       * @note In this useMemo we just set a single Field to avoid extra API(s) Calling
       */
      setEditState({
        ...editState,
        /**
         * @function getarrayObjById
         * @params {arrayOfObject} branches:
         * @params {selectedRow?.BranchId} @UUID
         * @return {Object}
         * @explain this function is use to extract the object which have same id as giving in the second parameter
         * @explain usually this function is called to set default value in dropdown state
         */
        Branch: getarrayObjById(branches, selectedRow?.BranchId),
      });
    }
  }, [branches]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setEditState({
        ...editState,
        Supplier: getarrayObjById(SubAccountList, selectedRow?.SupplierId),
      });
    }
  }, [SubAccountList]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setEditState({
        ...editState,
        PurchaseAccountId: getarrayObjById(ActiveAccountsBySubAccountId, selectedRow?.AccountId),
      });
    }
  }, [ActiveAccountsBySubAccountId]);

  useMemo(() => {
    if (actionModal === 'edit') {
      dispatch(
        GetPurchaseDetailByPurchaseId({
          PurchaseId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], selectedRow?.PurchaseId),
        }),
      );
    }
  }, [selectedRow?.PurchaseId]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setTargetCurrencyId(getarrayObjById(CurrenciesList, selectedRow?.CurrencyId));
    }
  }, [CurrenciesList]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setEditState({
        ...editState,
        ExchangeRate: getarrayObjById(ExchangeRate, selectedRow?.ExchangeRateId),
      });
    }
  }, [ExchangeRate]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setEditState({
        ...editState,
        SalesTaxAccount: getarrayObjById(accounts, selectedRow?.SalesTaxAccountId),
      });
    }
  }, [accounts]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setEditState({
        ...editState,
        RateType: getarrayObjById(RateTypeByNatureParentId, selectedRow?.RateTypeId),
      });
    }
  }, [RateTypeByNatureParentId]);

  useMemo(() => {
    if (actionModal === 'edit') {
      setEditState({
        ...editState,
        Organization: getarrayObjById(OrganizationsByUser, selectedRow?.OrganizationId),
      });
    }
  }, [OrganizationsByUser]);

  useMemo(() => {
    if (actionModal === 'add') {
      setEditState({
        ...editState,
        RateType: getarrayObjById(RateTypeByNatureParentId, '8C2E8C6D-3ECD-443D-A0DC-6E458F1D9752'),
        ExchangeRate: ExchangeRate[0]?.ExchangeRate,
        ExchangeRateId: ExchangeRate[0]?.ExchangeRateId,
      });
    }
  }, [RateTypeByNatureParentId, ExchangeRate]);

  useMemo(() => {
    setTargetCurrencyId(getarrayObjById(CurrenciesList, editState?.Organization?.CurrencyId));
  }, [editState?.Organization?.CurrencyId]);

  useEffect(() => {
    /**
     * @note if you are going to add or remove any field from child table remove/add that/this field form this here too
     * this is the same thing what we do with tha state of parent form
     */
    if (actionModal === 'edit') {
      let VoucherDetail = [...rows];
      /**
       * @PurchaseDetailByPurchaseId state from redux containing all the values for child table which we have to display
       */
      if (PurchaseDetailByPurchaseId?.length > 0) {
        /**
         * @explanation here we are doing the same thing with child table ( rows )
         * @explanation set the default value in edit mode
         * @loop we are using for loop to set all the rows with the data from redux state variable (PurchaseDetailByPurchaseId) respectively
         */
        for (let i = 0; i < PurchaseDetailByPurchaseId?.length; i++) {
          /**
         * @rules same rule apply here
         * @rules if you have a dropdown set value with the function @getarrayObjById
         * @rules if you have a textField or boolean set value by simple assign it
         * @rules if you have a number field Convert it With JS default @Number function
         */
          VoucherDetail[i] = {
            ...VoucherDetail,
            // VoucherDetail.push({
            id: i,
            record: 0,
            PurchaseDetailId: PurchaseDetailByPurchaseId[i]?.PurchaseDetailId,
            PurchaseId: PurchaseDetailByPurchaseId[i]?.PurchaseId,
            Product: {
              ProductId: PurchaseDetailByPurchaseId[i]?.ProductId,
              ProductName: PurchaseDetailByPurchaseId[i]?.ProductName,
            },
            ProductAccountId: {
              ProductAccountId: PurchaseDetailByPurchaseId[i]?.ProductAccountId,
              ProductAccountName: PurchaseDetailByPurchaseId[i]?.ProductAccountName,
            },
            Quantity: Number(PurchaseDetailByPurchaseId[i]?.Quantity),
            Price: Number(PurchaseDetailByPurchaseId[i]?.Price),
            Amount: (Number(PurchaseDetailByPurchaseId[i]?.Quantity) * Number(PurchaseDetailByPurchaseId[i]?.Price)).toFixed(
              4,
            ),
            DiscountRate: Number(PurchaseDetailByPurchaseId[i]?.DiscountRate),
            DiscountAmount: Number(PurchaseDetailByPurchaseId[i]?.DiscountAmount),
            TotalAmount: Number(PurchaseDetailByPurchaseId[i]?.DiscountAmount),
            LastPrice: Number(PurchaseDetailByPurchaseId[i]?.LastPrice),
            ReferencePrice: Number(PurchaseDetailByPurchaseId[i]?.ReferencePrice),
            GSTRate: Number(PurchaseDetailByPurchaseId[i]?.GSTRate),
            AmountExcludingGST: Number(PurchaseDetailByPurchaseId[i]?.AmountExcludingGST),
            GSTAmount: Number(PurchaseDetailByPurchaseId[i]?.GSTAmount),
            AmountIncludingGST: Number(PurchaseDetailByPurchaseId[i]?.AmountIncludingGST),
            Description: PurchaseDetailByPurchaseId[i]?.Description,
            Barcode: PurchaseDetailByPurchaseId[i]?.Barcode,
            IsDeleted: PurchaseDetailByPurchaseId[i]?.IsDeleted,
          };
        }
        setRows(VoucherDetail);
      }
    }
  }, [PurchaseDetailByPurchaseId]);

  useMemo(() => {
    /**
     * Updating detail table for dropdown
     */
    if (actionModal === 'edit') {
      let VoucherDetail = [...rows];
      if (PurchaseDetailByPurchaseId?.length > 0) {
        for (let i = 0; i < PurchaseDetailByPurchaseId?.length; i++) {
          VoucherDetail[i] = {
            ...rows,
            record: 0,
            ProductFamily: getarrayObjById(ProductFamilyList, PurchaseDetailByPurchaseId[i]?.ProductFamilyId),
          };
        }
        setRows(VoucherDetail);
      }
    }
  }, [PurchaseDetailByPurchaseId, ProductFamilyList]);

  useMemo(() => {
    if (actionModal === 'edit') {
      let VoucherDetail = [...rows];
      if (PurchaseDetailByPurchaseId?.length > 0) {
        for (let i = 0; i < PurchaseDetailByPurchaseId?.length; i++) {
          VoucherDetail[i] = {
            ...VoucherDetail[i],
            record: 0,
            Status: getarrayObjById(statusByParentId, PurchaseDetailByPurchaseId[i]?.StatusId),
          };
        }
        setRows(VoucherDetail);
      }
    }
  }, [PurchaseDetailByPurchaseId, statusByParentId]);

  /**
   * if you wan to show a alert on any field if user select it wrong or in wrong pattern use this
   */
  useEffect(() => {
    /**
     * make sure you have organization otherwise you don't have to show the error to the user ( in mostly cases )
     */
    if (editState?.Organization?.OrganizationId) {
      /**
       * here create your own condition
       * In my case I want to make sure that We have at least one record in ExchangeRate array ( state from redux state )
       * so I check the condition and if I don't have I show the alert with the help of setOpenAlert state
       */
      if (!ExchangeRate?.length) {
        setOpenAlert({ show: true, type: 'info', text: 'Please Open a Exchange Rate First' });
        setNotClose(false);
        setValidation(true);
      } else {
        setOpenAlert({ show: false });
        setEditState({
          ...editState,
          RateType: getarrayObjById(RateTypeByNatureParentId, '8C2E8C6D-3ECD-443D-A0DC-6E458F1D9752'),
          ExchangeRate: ExchangeRate[0]?.ExchangeRate,
          ExchangeRateId: ExchangeRate[0]?.ExchangeRateId,
        });
      }
    }
  }, [RateTypeByNatureParentId, ExchangeRate]);

  useEffect(() => {
    /**
     * call the API to get the the data for detail table
     */
    dispatch(
      GetPurchaseDetailByPurchaseId({
        PurchaseId: selectedRow && selectedRow?.PurchaseId,
      }),
    );
  }, [selectedRow?.PurchaseId]);

  useEffect(() => {
    if (editState?.Organization?.OrganizationId) {
      dispatch(
        GetCalendarByDate({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          AccountingDate: editState.TransactionDate ? moment(editState.TransactionDate).format('YYYY-MM-DD') : null,
        }),
      );
    }
  }, [editState.TransactionDate, editState?.Organization?.OrganizationId]);

  /**
   * @function AddFunc
   * @explain this function is call to
   */
  const AddFunc = async () => {
    let body;
    let detailsArray = [];
    for (let i = 0; i < rows?.length; i++) {
      /**
       * make a table ( array of object ) to add child record
       */
      if (rows[i]?.PurchaseDetailId !== null) {
        /**
         * pushing data in a array according to the endpoint requirements
         */
        detailsArray.push({
          PurchaseDetailId: null,
          PurchaseId: null,
          ProductId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], rows[i]['Product']?.ProductId),
          ProductAccountId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            rows[i]['ProductAccountId']?.ProductAccountId || rows[i]['ProductAccountId']?.AccountId,
          ),
          ProductFamilyId: rows[i]['ProductFamily']?.ProductFamilyId
            ? checkconditions(
              '00000000-0000-0000-0000-000000000000',
              ['', undefined],
              rows[i]['ProductFamily']?.ProductFamilyId,
            )
            : checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], rows[i]['ProductFamilyId']),
          Quantity: checkconditions(null, ['', undefined], rows[i]['Quantity']),
          Price: checkconditions(null, ['', undefined], rows[i]['Price']),
          DiscountRate: checkconditions(null, ['', undefined], rows[i]['DiscountRate']),
          LastPrice: checkconditions(null, ['', undefined], rows[i]['LastPrice']),
          ReferencePrice: checkconditions(null, ['', undefined], rows[i]['ReferencePrice']),
          GSTRate: checkconditions(null, ['', undefined], rows[i]['GSTRate']),
          AmountExcludingGST: checkconditions(null, ['', undefined], rows[i]['AmountExcludingGST']),
          GSTAmount: checkconditions(null, ['', undefined], rows[i]['GSTAmount']),
          Description: checkconditions(null, ['', undefined], rows[i]['Description']),
          Barcode: checkconditions(null, ['', undefined], rows[i]['Barcode']),
          StatusId: checkconditions(null, ['', undefined], rows[i]['StatusName']?.data?.id),
          IsDeleted: rows[i]['IsDeleted'] ? rows[i]['IsDeleted'] : false,
          DiscountAmount: rows[i]['DiscountAmount'] ? rows[i]['DiscountAmount'] : false,
          TotalAmount: rows[i]['TotalAmount'] ? rows[i]['TotalAmount'] : false,
          AmountIncludingGST: rows[i]['AmountIncludingGST'] ? rows[i]['AmountIncludingGST'] : false,
        });
      }
    }
    /**
     * creating body form to add parent form
     */
    body = {
      OrganizationId: checkconditions(
        '00000000-0000-0000-0000-000000000000',
        ['', undefined, null],
        editState?.Organization?.OrganizationId,
      ),
      /**
       * @Purchase arrayOfObject containing all the fields according to the endpoint requirements
       */
      Purchase: [
        {
          PurchaseId: null,
          BranchId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], editState?.Branch?.BranchId),
          CostProfitCenterId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.CostProfitCenter?.CostProfitCenterId,
          ),
          TransactionType: editState && editState?.TransactionType,
          ReferenceNo: editState && editState?.ReferenceNo,
          TransactionDate: editState?.TransactionDate ? convertTime(editState?.TransactionDate, true) : null,
          CalendarId: CalendarByDate[0]?.CalendarId,
          PurchaseOrderNo: editState && editState?.PurchaseOrderNo,
          PurchaseOrderDate: editState?.PurchaseOrderDate ? convertTime(editState?.PurchaseOrderDate, true) : null,
          SupplierId: checkconditions(
            null,
            ['00000000-0000-0000-0000-000000000000', '', undefined],
            editState?.Supplier?.SubAccountId,
          ),
          CreditPeriod: Number(editState?.CreditPeriod),
          SupplierQuotationNo: editState && editState?.SupplierQuotationNo,
          CurrencyId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], TargetCurrencyId?.id),
          ExchangeRateId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.ExchangeRateId,
          ),
          ExchangeRate: editState && editState?.ExchangeRate,
          SupplierInvoiceNo: editState && editState?.SupplierInvoiceNo,
          SupplierInvoiceDate: editState?.SupplierInvoiceDate ? convertTime(editState?.SupplierInvoiceDate, true) : null,
          GSTInvoiceNo: editState && editState?.GSTInvoiceNo,
          GSTInvoiceDate: editState?.GSTInvoiceDate ? convertTime(editState?.GSTInvoiceDate, true) : null,
          BillOfEntryNo: editState && editState?.BillOfEntryNo,
          BillOfEntryDate: editState?.BillOfEntryDate ? convertTime(editState?.BillOfEntryDate, true) : null,
          LCNO: (editState && editState?.LCNO) || null,
          LCDate: editState?.LCDate ? convertTime(editState?.LCDate, true) : null,
          PurchaseAccountId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.PurchaseAccountId?.AccountId,
          ),
          SalesTaxAccountId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.SalesTaxAccount?.AccountId,
          ),
          RateTypeId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.RateType?.NatureId,
          ),
          GSTRate: editState && editState?.GSTRate,
          AmountExcludingGST: editState && editState?.AmountExcludingGST,
          GSTAmount: editState && editState?.GSTAmount,
          Narration: editState && editState?.Narration,
          StatusId: editState?.StatusId,
          IsPosted: editState && editState?.IsPosted,
          PostingDate: (editState && editState?.PostingDate) || null,
          DeliveryDate: editState && editState?.DeliveryDate,
          DeliveryAddress: editState && editState?.DeliveryAddress,
        },
      ],
      TabId: tabId,
      CreatedOn: getNewDate(),
      /**
       * @PurchaseDetail {@detailsArray = ArrayOfObject which we created on above ( child table data )}
       */
      PurchaseDetail: detailsArray,
      CreatedBy: user && user.userId,
    };
    /**
     * error handling try catch so our application don't crash
     */
    try {
      dispatch(AddPurchase(body))
        .unwrap()
        .then(response => {
          /**
           * checking the status and showing alert according to the user status ( error/success )
           */
          // because this form is way more bigger than usual we should scroll user to the top of the screen so he/she can see the result of the form submission
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          if (response[0].STATUS === 'SUCCESSFULL') {
            // Alert
            setOpenAlert({ show: true, type: 'success', text: 'Purchase Added Successfully' });
            setTimeout(() => {
              cancel();
            }, 2500);
          } else {
            setOpenAlert({ show: true, type: 'error', text: 'Something went wrong' });
            setNotClose(true);
          }
        })
        .catch(e => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          setOpenAlert({ show: true, type: 'error', text: 'Something went Wrong' });
          setNotClose(true);
        });
    } catch (err) { }
  };

  const UpdateFunc = async () => {
    let body;
    let newArr = [];
    const updateRow = rows.concat(deleteRow);
    let detailsArray = [];

    for (let i = 0; i < updateRow.length; i++) {
      if (updateRow[i]?.PurchaseDetailId !== null && updateRow[i]?.PurchaseDetailId !== undefined) {
        detailsArray.push({
          PurchaseDetailId:
            updateRow[i]?.PurchaseDetailId === '00000000-0000-0000-0000-000000000000'
              ? null
              : updateRow[i]?.PurchaseDetailId || null,
          PurchaseId: selectedRow?.PurchaseId,
          ProductId: updateRow[i]['Product']?.ProductId
            ? checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], updateRow[i]['Product']?.ProductId)
            : checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], updateRow[i]['ProductId']),

          ProductFamilyId: updateRow[i]['ProductFamily']?.ProductFamilyId
            ? checkconditions(
              '00000000-0000-0000-0000-000000000000',
              ['', undefined],
              updateRow[i]['ProductFamily']?.ProductFamilyId,
            )
            : checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], updateRow[i]['ProductFamilyId']),

          ProductAccountId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            updateRow[i]['ProductAccountId']?.ProductAccountId || updateRow[i]['ProductAccountId']?.AccountId,
          ),
          Quantity: checkconditions(null, ['', undefined], updateRow[i]['Quantity']),
          Price: checkconditions(null, ['', undefined], updateRow[i]['Price']),
          DiscountRate: checkconditions(null, ['', undefined], updateRow[i]['DiscountRate']),
          LastPrice: checkconditions(null, ['', undefined], updateRow[i]['LastPrice']),
          ReferencePrice: checkconditions(null, ['', undefined], updateRow[i]['ReferencePrice']),
          GSTRate: checkconditions(null, ['', undefined], updateRow[i]['GSTRate']),
          AmountExcludingGST: checkconditions(null, ['', undefined], updateRow[i]['AmountExcludingGST']),
          GSTAmount: checkconditions(null, ['', undefined], updateRow[i]['GSTAmount']),
          Description: checkconditions(null, ['', undefined], updateRow[i]['Description']),
          Barcode: checkconditions(null, ['', undefined], updateRow[i]['Barcode']),
          StatusId: updateRow[i]['Status']?.id
            ? checkconditions(null, ['', undefined], updateRow[i]['Status']?.id)
            : checkconditions(null, ['', undefined], selectedRow?.StatusId),
          IsDeleted: updateRow[i]['IsDeleted'] ? updateRow[i]['IsDeleted'] : false,
          DiscountAmount: updateRow[i]['DiscountAmount'] ? updateRow[i]['DiscountAmount'] : null,
          TotalAmount: updateRow[i]['TotalAmount'] ? updateRow[i]['TotalAmount'] : null,
          AmountIncludingGST: updateRow[i]['AmountIncludingGST'] ? updateRow[i]['AmountIncludingGST'] : null,
        });
      }
    }

    body = {
      Purchase: [
        {
          PurchaseId: editState && editState?.PurchaseId,
          BranchId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], editState?.Branch?.BranchId),
          CostProfitCenterId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.CostProfitCenter?.CostProfitCenterId,
          ),
          TransactionType: editState && editState?.TransactionType,
          ReferenceNo: editState && editState?.ReferenceNo,
          TransactionDate: editState?.TransactionDate ? convertTime(editState?.TransactionDate, true) : null,
          CalendarId: CalendarByDate[0]?.CalendarId,
          PurchaseOrderNo: editState && editState?.PurchaseOrderNo,
          PurchaseOrderDate: editState?.PurchaseOrderDate ? convertTime(editState?.PurchaseOrderDate, true) : null,
          SupplierId: checkconditions(
            null,
            ['00000000-0000-0000-0000-000000000000', '', undefined],
            editState?.Supplier?.SubAccountId,
          ),
          CreditPeriod: Number(editState?.CreditPeriod),
          SupplierQuotationNo: editState && editState?.SupplierQuotationNo,
          CurrencyId: checkconditions('00000000-0000-0000-0000-000000000000', ['', undefined], TargetCurrencyId?.id),
          ExchangeRate: editState && editState?.ExchangeRate?.ExchangeRate,
          SupplierInvoiceNo: editState && editState?.SupplierInvoiceNo,
          SupplierInvoiceDate: editState?.SupplierInvoiceDate ? convertTime(editState?.SupplierInvoiceDate, true) : null,
          GSTInvoiceNo: editState && editState?.GSTInvoiceNo,
          GSTInvoiceDate: editState?.GSTInvoiceDate ? convertTime(editState?.GSTInvoiceDate, true) : null,
          BillOfEntryNo: editState && editState?.BillOfEntryNo,
          BillOfEntryDate: editState?.BillOfEntryDate ? convertTime(editState?.BillOfEntryDate, true) : null,
          LCNO: editState && editState?.LCNO,
          LCDate: editState?.LCDate ? convertTime(editState?.LCDate, true) : null,
          PurchaseAccountId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.PurchaseAccountId?.AccountId,
          ),
          SalesTaxAccountId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.SalesTaxAccount?.AccountId,
          ),
          RateTypeId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.RateType?.NatureId,
          ),
          GSTRate: editState && editState?.GSTRate,
          AmountExcludingGST: Number(editState?.AmountExcludingGST),
          GSTAmount: Number(editState?.GSTAmount),
          Narration: editState && editState?.Narration,
          StatusId: editState?.StatusId,
          IsPosted: editState && editState?.IsPosted,
          PostingDate: editState && editState?.PostingDate,
          DeliveryDate: editState && editState?.DeliveryDate,
          DeliveryAddress: editState && editState?.DeliveryAddress,
        },
      ],
      PurchaseDetail: detailsArray,
      UpdatedOn: getNewDate(),
      TabId: tabId,
      UpdatedBy: user && user.userId,
      OrganizationId: checkconditions(
        '00000000-0000-0000-0000-000000000000',
        ['', undefined],
        editState?.Organization?.OrganizationId,
      ),
    };
    try {
      dispatch(UpdatePurchase(body))
        .unwrap()
        .then(response => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          if (response[0].STATUS === 'SUCCESSFULL') {
            setOpenAlert({ show: true, type: 'success', text: 'Purchase Updated Successfully' });
            setTimeout(() => {
              cancel();
            }, 2500);
          } else {
            setOpenAlert({ show: true, type: 'error', text: 'Something Went Wrong' });
            setNotClose(true);
            // cancel();
          }
        })
        .catch(e => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          setOpenAlert({ show: true, type: 'error', text: 'Something went Wrong' });
          setNotClose(true);
          // cancel();
        });
    } catch (err) { }
  };

  useEffect(() => {
    if (actionModal === 'edit') {
      let VoucherDetail = [...rows];
      if (ActiveProducts?.length > 0) {
        VoucherDetail[tableRowIndex].Product = getarrayObjById(
          ActiveProducts,
          VoucherDetail[tableRowIndex].Product?.ProductId,
        );
        setRows(VoucherDetail);
      }
      dispatch(
        GetActiveAccountsByProductId({
          OrganizationId: checkconditions(
            '00000000-0000-0000-0000-000000000000',
            ['', undefined],
            editState?.Organization?.OrganizationId,
          ),
          ProductId: rows[tableRowIndex]?.Product?.ProductId,
        }),
      );
    }
  }, [ActiveProducts]);

  useEffect(() => {
    if (actionModal === 'edit') {
      let VoucherDetail = [...rows];
      if (ActiveAccountsByProductId?.length > 0) {
        VoucherDetail[tableRowIndex].ProductAccountId = getarrayObjById(
          ActiveAccountsByProductId,
          VoucherDetail[tableRowIndex]?.ProductAccountId?.ProductAccountId ||
          VoucherDetail[tableRowIndex]?.ProductAccountId?.AccountId,
        );
        console.log('🚀 ~ file: modal.js ~ line 115 ~ useEffect ~ VoucherDetail', VoucherDetail);
        setRows(VoucherDetail);
      }
    }
  }, [ActiveAccountsByProductId]);

  return (
    <div style={{ width: '100%' }}>
      {openAlert.show ? (
        <NotificationMsgComponent openAlert={openAlert} setOpenAlert={setOpenAlert} cancel={cancel} notClose={notClose} />
      ) : null}
      <Paper className="paper_container">
        <div className="edit_sign">
          {editState?.IsPosted ? 'View' : actionModal === 'add' ? 'Add' : 'Edit'}
          {/* {actionModal === 'add' ? 'Add' : 'Edit'} */}
        </div>
        <Grid container spacing={3}>
          <Grid item md={4} lg={6} sm={12} xs={12}>
            <OrganizationDropdown
              value={editState?.Organization}
              compValue={editState}
              setValue={setEditState}
              name="Organization"
              handle={e => handleEditState(e, false)}
              disable={editState?.IsPosted ? editState?.IsPosted : actionModal === 'edit' ? true : false}
              classes={classes}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={12} xs={12}>
            <CustomDropDownComponent
              label="Branch"
              optionArray={checkLengthGreaterThanZero(branches || [])}
              value={editState?.Branch}
              optionLabel="BranchName"
              name="Branch"
              handle={e => handleEditState(e, false)}
              classes={classes}
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <FormControl>
              <FormLabel id="TransactionType">Transaction Type</FormLabel>
              <RadioGroup
                row
                aria-labelledby="TransactionType"
                value={editState?.TransactionType || ''}
                onChange={e => handleEditState(e, false)}
                name="TransactionType">
                <FormControlLabel disabled={editState?.IsPosted} value="L " control={<Radio />} label="Local" />
                <FormControlLabel disabled={editState?.IsPosted} value="I" control={<Radio />} label="Import" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {actionModal === 'edit' ? (
            <Grid item md={6} lg={3} sm={12} xs={12}>
              <CustomTextFieldComponent
                label="ConstantLabel.ReferenceNo"
                value={selectedRow?.ReferenceNo}
                classes={classes}
                disable={true}
              />
            </Grid>
          ) : null}
          {actionModal === 'edit' ? <Grid item md={6} lg={9} sm={0} xs={0} /> : null}
          {SubAccountList?.length > 0 && (
            <Grid item md={4} lg={3} sm={6} xs={12}>
              <CustomDropDownComponent
                label="Supplier"
                disable={editState?.IsPosted ? editState?.IsPosted : actionModal === 'edit' ? true : false}
                optionArray={checkLengthGreaterThanZero(SubAccountList || [])}
                value={editState?.Supplier}
                optionLabel="SubAccountName"
                name="Supplier"
                handle={e => handleEditState(e, false)}
                classes={classes}
              />
            </Grid>
          )}
          {/* {ActiveAccountsBySubAccountId?.length > 0 && ( */}
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomDropDownComponent
              label="Purchase Account"
              optionArray={checkLengthGreaterThanZero(ActiveAccountsBySubAccountId || [])}
              value={editState?.PurchaseAccountId}
              // value={actionModal === 'add' ? editState?.PurchaseAccountId : editState?.PurchaseAccountId || ''}
              optionLabel="AccountName"
              name="PurchaseAccountId"
              handle={e => handleEditState(e, false)}
              classes={classes}
              disable={editState?.IsPosted ? editState?.IsPosted : actionModal === 'edit' ? true : false}
            />
          </Grid>
          {/* )} */}
          {accounts?.length > 0 && (
            <Grid item md={6} lg={3} sm={12} xs={12}>
              <CustomDropDownComponent
                label="Sales Tax Account"
                disable={editState?.IsPosted ? editState?.IsPosted : accounts?.length <= 0 && true}
                optionArray={checkLengthGreaterThanZero(accounts || [])}
                value={editState?.SalesTaxAccount}
                optionLabel="AccountName"
                name="SalesTaxAccount"
                handle={e => handleEditState(e, false)}
                classes={classes}
              />
            </Grid>
          )}
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.GSTInvoiceNo"
              value={editState?.GSTInvoiceNo}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="GSTInvoiceNo"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
            <DatePicker
              classes={classes}
              handle={handleEditState}
              value={editState?.GSTInvoiceDate}
              name="GSTInvoiceDate"
              label="GST Invoice Date"
              def={true}
              disabled={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.SupplierInvoiceNo"
              value={editState?.SupplierInvoiceNo}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="SupplierInvoiceNo"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
            <DatePicker
              classes={classes}
              handle={handleEditState}
              value={editState?.SupplierInvoiceDate}
              name="SupplierInvoiceDate"
              label="Supplier Invoice Date"
              def={true}
              disabled={editState?.IsPosted}
            />
          </Grid>
          {editState?.TransactionType === 'I' && (
            <Grid item md={4} lg={3} sm={6} xs={12}>
              <CustomTextFieldComponent
                label="Purchase.BillOfEntryNo"
                value={editState?.BillOfEntryNo}
                handle={e => handleEditState(e, false)}
                classes={classes}
                name="BillOfEntryNo"
                disable={editState?.IsPosted}
              />
            </Grid>
          )}
          {editState?.TransactionType === 'I' && (
            <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
              <DatePicker
                classes={classes}
                handle={handleEditState}
                value={editState?.BillOfEntryDate}
                name="BillOfEntryDate"
                label="Bill Of Entry Date"
                def={true}
                disabled={editState?.IsPosted}
              />
            </Grid>
          )}
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.CreditPeriod"
              value={editState?.CreditPeriod}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="CreditPeriod"
              type="Number"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.SupplierQuotationNo"
              value={editState?.SupplierQuotationNo}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="SupplierQuotationNo"
              disable={editState?.IsPosted}
            />
          </Grid>
          {editState?.TransactionType === 'I' && (
            <Grid item md={4} lg={3} sm={6} xs={12}>
              <CustomTextFieldComponent
                label="Purchase.LCNO"
                value={editState?.LCNO}
                handle={e => handleEditState(e, false)}
                classes={classes}
                name="LCNO"
                disable={editState?.IsPosted}
              />
            </Grid>
          )}
          {editState?.TransactionType === 'I' && (
            <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
              <DatePicker
                classes={classes}
                handle={handleEditState}
                value={editState?.LCDate}
                name="LCDate"
                label="LC Date"
                def={true}
                disabled={editState?.IsPosted}
              />
            </Grid>
          )}
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              // label="ConstantLabel.OrderNo"
              label="Purchase Order No"
              value={editState?.PurchaseOrderNo}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="PurchaseOrderNo"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
            <DatePicker
              classes={classes}
              handle={handleEditState}
              value={editState?.PurchaseOrderDate}
              name="PurchaseOrderDate"
              label="Purchase Order Date"
              def={true}
              disabled={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.GSTRate"
              value={editState?.GSTRate}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="GSTRate"
              type="Number"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.AmountExcludingGST"
              value={editState?.AmountExcludingGST}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="AmountExcludingGST"
              type="Number"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={4} lg={3} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.GSTAmount"
              value={editState?.GSTAmount}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="GSTAmount"
              type="Number"
              disable={editState?.IsPosted}
            />
          </Grid>
          {CurrenciesList?.length > 0 && (
            <Grid item md={4} lg={3} sm={6} xs={12}>
              <Autocomplete
                value={TargetCurrencyId}
                onChange={(event, newValue) => {
                  setTargetCurrencyId(newValue);
                }}
                inputValue={TargetCurrencyInputValue}
                onInputChange={(event, newInputValue) => {
                  setTargetCurrencyInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={CurrenciesList}
                getOptionLabel={option => option.CurrencyName}
                renderInput={params => <TextField {...params} label="Currency" />}
                disabled={editState?.IsPosted}
              />
            </Grid>
          )}
          {RateTypeByNatureParentId?.length > 0 && (
            <Grid item md={4} lg={3} sm={6} xs={12}>
              <CustomDropDownComponent
                label="Rate Type"
                optionArray={checkLengthGreaterThanZero(RateTypeByNatureParentId)}
                value={editState?.RateType}
                optionLabel="NatureName"
                name="RateType"
                required
                handle={e => handleEditState(e, false)}
                disable={editState?.IsPosted ? editState?.IsPosted : actionModal === 'edit' ? true : false}
                classes={classes}
              />
            </Grid>
          )}
          {ExchangeRate?.length > 0 && (
            <Grid item md={4} lg={3} sm={6} xs={12}>
              <CustomTextFieldComponent
                label="Balance.ExchangeRate"
                value={editState?.ExchangeRate}
                handle={e => handleEditState(e, false)}
                required
                classes={classes}
                name="ExchangeRate"
                type="Number"
                // disable={true}
                disabled={editState?.IsPosted}
              />
            </Grid>
          )}
          <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
            <DatePicker
              classes={classes}
              handle={handleEditState}
              value={editState?.TransactionDate}
              name="TransactionDate"
              label="Transaction Date"
              def={true}
              disabled={editState?.IsPosted}
            />
          </Grid>
          {editState?.IsPosted && (
            <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
              <DatePicker
                classes={classes}
                handle={handleEditState}
                value={editState?.PostingDate}
                name="PostingDate"
                label="Posting Date"
                def={true}
                disabled={editState?.IsPosted}
              />
            </Grid>
          )}
          <Grid style={{ marginTop: 'auto' }} item md={4} lg={3} sm={6} xs={12}>
            <DatePicker
              classes={classes}
              handle={handleEditState}
              value={editState?.DeliveryDate}
              name="DeliveryDate"
              label="Delivery Date"
              def={true}
              disabled={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={6} lg={6} sm={6} xs={12}>
            <CustomTextFieldComponent
              label="Purchase.DeliveryAddress"
              value={editState?.DeliveryAddress}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="DeliveryAddress"
              disable={editState?.IsPosted}
            />
          </Grid>
          <Grid item md={12} lg={12} sm={12} xs={12}>
            <CustomTextFieldComponent
              row={5}
              multiline
              label="Purchase.Narration"
              value={editState?.Narration}
              handle={e => handleEditState(e, false)}
              classes={classes}
              name="Narration"
              type="Number"
              disable={editState?.IsPosted}
            />
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
        <Detail
          rows={rows}
          setRows={setRows}
          actionModal={actionModal}
          setTableRowIndex={setTableRowIndex}
          ChildDialogBox={ChildDialogBox}
          setChildDialogBox={setChildDialogBox}
          DataStatus={editState?.IsPosted}
          deleteRow={deleteRow}
          setDeleteRow={setDeleteRow}
        />
        <DetailTotal rows={rows} />
        <Modal
          OrganizationId={editState.Organization?.OrganizationId}
          rows={rows}
          setRows={setRows}
          tableRowIndex={tableRowIndex}
          openDialogBox={ChildDialogBox}
          setOpenDialogBox={setChildDialogBox}
        />
        <Grid container spacing={3}>
          <Grid item md={12} lg={12} sm={12} xs={12} style={{ display: 'flex' }}>
            <FormControlButtonComponent
              Validation={editState?.IsPosted ? editState?.IsPosted : Validation}
              cancelhandler={cancel}
              actionModal={actionModal}
              UpdateFunc={UpdateFunc}
              AddFunc={AddFunc}
              classes={classes}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default React.memo(Edit);
