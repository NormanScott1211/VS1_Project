import {
    ContactService
} from "./contact-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    UtilityService
} from "../utility-service";
import XLSX from 'xlsx';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';

import {Session} from 'meteor/session';
import { Template } from 'meteor/templating';
import './employeelistpop.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let contactService = new ContactService();
Template.employeelistpop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.custdatatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
    templateObject.tablename = new ReactiveVar();

    templateObject.getDataTableList = function (data) {
        let linestatus = '';
        if (data.Active == true) {
            linestatus = "";
        } else if (data.Active == false) {
            linestatus = "In-Active";
        }
        ;
        var dataList = [
            data.EmployeeID || "",
            data.EmployeeName || "",
            data.FirstName || "",
            data.LastName || "",
            data.Phone || "",
            data.Mobile || '',
            data.Email || '',
            data.DefaultClassName || '',
            data.CustFld1 || '',
            data.CustFld2 || '',
            data.Street || "",
            data.Street2 || "",
            data.State || "",
            data.Postcode || "",
            data.Country || "",
            linestatus,
        ];
        return dataList;
    }

    let headerStructure = [
        {index: 0, label: 'Emp #', class: 'colEmployeeNo', active: false, display: true, width: "10"},
        {index: 1, label: 'Employee Name', class: 'colEmployeeName', active: true, display: true, width: "200"},
        {index: 2, label: 'First Name', class: 'colFirstName', active: true, display: true, width: "100"},
        {index: 3, label: 'Last Name', class: 'colLastName', active: true, display: true, width: "100"},
        {index: 4, label: 'Phone', class: 'colPhone', active: true, display: true, width: "95"},
        {index: 5, label: 'Mobile', class: 'colMobile', active: false, display: true, width: "95"},
        {index: 6, label: 'Email', class: 'colEmail', active: true, display: true, width: "200"},
        {index: 7, label: 'Department', class: 'colDepartment', active: true, display: true, width: "80"},
        {index: 8, label: 'Custom Field 1', class: 'colCustFld1', active: false, display: true, width: "120"},
        {index: 9, label: 'Custom Field 2', class: 'colCustFld2', active: false, display: true, width: "120"},
        {index: 10, label: 'Address', class: 'colAddress', active: true, display: true, width: "150"},
        {index: 11, label: 'City/Suburb', class: 'colSuburb', active: false, display: true, width: "120"},
        {index: 12, label: 'State', class: 'colState', active: false, display: true, width: "120"},
        {index: 13, label: 'Postcode', class: 'colPostcode', active: false, display: true, width: "80"},
        {index: 14, label: 'Country', class: 'colCountry', active: false, display: true, width: "200"},
        {index: 15, label: 'Status', class: 'colStatus', active: true, display: true, width: "120"},
    ];
    templateObject.tableheaderrecords.set(headerStructure);
});

Template.employeelistpop.onRendered(function (){
    $( "#employeeListPOPModal, #employeeListModal" ).on('shown.bs.modal', function(){
        setTimeout(function() {
            if($('#tblEmployeelist_filter .form-control-sm').length)
                $('#tblEmployeelist_filter .form-control-sm').get(0).focus();
            if($('#tblEmployeelistpop_filter .form-control-sm').length)
                $('#tblEmployeelistpop_filter .form-control-sm').get(0).focus();
        }, 500);
    });

    //$('.fullScreenSpin').css('display','inline-block');
    // let templateObject = Template.instance();
    // let contactService = new ContactService();
    // const employeeList = [];
    // let salesOrderTable;
    // var splashArray = new Array();
    // var splashArrayEmployeeList = new Array();
    //
    // let currenttablename = templateObject.data.tablename || "tblEmployeelist";
    // templateObject.tablename.set(currenttablename);
    //
    // const lineEmployeeItems = [];
    // const dataTableList = [];
    // const tableHeaderList = [];
    //
    // Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), currenttablename, function (error, result) {
    //     if (error) {
    //
    //     } else {
    //         if (result) {
    //
    //             for (let i = 0; i < result.customFields.length; i++) {
    //                 let customcolumn = result.customFields;
    //                 let columData = customcolumn[i].label;
    //                 let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                 let hiddenColumn = customcolumn[i].hidden;
    //                 let columnClass = columHeaderUpdate.split('.')[1];
    //                 let columnWidth = customcolumn[i].width;
    //                 // let columnindex = customcolumn[i].index + 1;
    //                 $("th." + columnClass + "").html(columData);
    //                 $("th." + columnClass + "").css('width', "" + columnWidth + "px");
    //
    //             }
    //         }
    //
    //     }
    // });
    //
    // templateObject.resetData = function (dataVal) {
    //     location.reload();
    // }
    //
    // templateObject.getEmployees = function () {
    //   var employeepage = 0;
    //     getVS1Data('TEmployee').then(function (dataObject) {
    //         if (dataObject.length == 0) {
    //             sideBarService.getAllEmployeesDataVS1(initialBaseDataLoad, 0).then(function (data) {
    //                 addVS1Data('TEmployee', JSON.stringify(data));
    //                 let lineItems = [];
    //                 let lineItemObj = {};
    //                 for (let i = 0; i < data.temployee.length; i++) {
    //                     let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
    //                     let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
    //                     let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
    //                     let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
    //                     let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
    //                     var dataList = {
    //                         id: data.temployee[i].fields.ID || '',
    //                         clientName: data.temployee[i].fields.ClientName || '',
    //                         company: data.temployee[i].fields.Companyname || '',
    //                         contactname: data.temployee[i].fields.ContactName || '',
    //                         phone: data.temployee[i].fields.Phone || '',
    //                         arbalance: arBalance || 0.00,
    //                         creditbalance: creditBalance || 0.00,
    //                         balance: balance || 0.00,
    //                         creditlimit: creditLimit || 0.00,
    //                         salesorderbalance: salesOrderBalance || 0.00,
    //                         email: data.temployee[i].fields.Email || '',
    //                         job: data.temployee[i].fields.JobName || '',
    //                         accountno: data.temployee[i].fields.AccountNo || '',
    //                         clientno: data.temployee[i].fields.ClientNo || '',
    //                         jobtitle: data.temployee[i].fields.JobTitle || '',
    //                         notes: data.temployee[i].fields.Notes || '',
    //                         state: data.temployee[i].fields.State || '',
    //                         country: data.temployee[i].fields.Country || '',
    //                         street: data.temployee[i].fields.Street || ' ',
    //                         street2: data.temployee[i].fields.Street2 || ' ',
    //                         street3: data.temployee[i].fields.Street3 || ' ',
    //                         suburb: data.temployee[i].fields.Suburb || ' ',
    //                         postcode: data.temployee[i].fields.Postcode || ' ',
    //                         clienttype: data.temployee[i].fields.ClientTypeName || 'Default',
    //                         discount: data.temployee[i].fields.Discount || 0
    //                     };
    //
    //                     dataTableList.push(dataList);
    //                     let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
    //                     var dataListEmployee = [
    //                         data.temployee[i].fields.EmployeeName || '-',
    //                         data.temployee[i].fields.FirstName || '',
    //                         data.temployee[i].fields.LastName || '',
    //                         data.temployee[i].fields.Phone || '',
    //                         mobile || '',
    //                         data.temployee[i].fields.Email || '',
    //                         data.temployee[i].fields.DefaultClassName || '',
    //                         data.temployee[i].fields.Country || '',
    //                         data.temployee[i].fields.State || '',
    //                         data.temployee[i].fields.Street2 || '',
    //                         data.temployee[i].fields.Street || '',
    //                         data.temployee[i].fields.Postcode || '',
    //                         data.temployee[i].fields.ID || ''
    //                     ];
    //                     splashArrayEmployeeList.push(dataListEmployee);
    //                     //}
    //                 }
    //
    //                 function MakeNegative() {
    //                     $('td').each(function () {
    //                         if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    //                     });
    //                 };
    //
    //                 templateObject.custdatatablerecords.set(dataTableList);
    //
    //                 if (templateObject.custdatatablerecords.get()) {
    //
    //                     Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), currenttablename, function (error, result) {
    //                         if (error) {
    //
    //                         } else {
    //                             if (result) {
    //                                 for (let i = 0; i < result.customFields.length; i++) {
    //                                     let customcolumn = result.customFields;
    //                                     let columData = customcolumn[i].label;
    //                                     let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                                     let hiddenColumn = customcolumn[i].hidden;
    //                                     let columnClass = columHeaderUpdate.split('.')[1];
    //                                     let columnWidth = customcolumn[i].width;
    //                                     let columnindex = customcolumn[i].index + 1;
    //
    //                                     if (hiddenColumn == true) {
    //
    //                                         $("." + columnClass + "").addClass('hiddenColumn');
    //                                         $("." + columnClass + "").removeClass('showColumn');
    //                                     } else if (hiddenColumn == false) {
    //                                         $("." + columnClass + "").removeClass('hiddenColumn');
    //                                         $("." + columnClass + "").addClass('showColumn');
    //                                     }
    //
    //                                 }
    //                             }
    //
    //                         }
    //                     });
    //
    //
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                 }
    //
    //                 //$('.fullScreenSpin').css('display','none');
    //                 setTimeout(function () {
    //                     $(currenttablename).DataTable({
    //                         data: splashArrayEmployeeList,
    //                         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                         columnDefs: [
    //                             {
    //                                 className: "colEmployeeName",
    //                                 "targets": [0]
    //                             }, {
    //                                 className: "colFirstName",
    //                                 "targets": [1]
    //                             }, {
    //                                 className: "colLastName",
    //                                 "targets": [2]
    //                             }, {
    //                                 className: "colPhone",
    //                                 "targets": [3]
    //                             }, {
    //                                 className: "colMobile",
    //                                 "targets": [4]
    //                             }, {
    //                                 className: "colEmail ",
    //                                 "targets": [5]
    //                             }, {
    //                                 className: "colDepartment",
    //                                 "targets": [6]
    //                             }, {
    //                                 className: "colCountry",
    //                                 "targets": [7]
    //                             }, {
    //                                 className: "colState hiddenColumn",
    //                                 "targets": [8]
    //                             }, {
    //                                 className: "colCity hiddenColumn",
    //                                 "targets": [9]
    //                             }, {
    //                                 className: "colStreetAddress hiddenColumn",
    //                                 "targets": [10]
    //                             }, {
    //                                 className: "colZipCode hiddenColumn",
    //                                 "targets": [11]
    //                             }, {
    //                                 className: "colID hiddenColumn",
    //                                 "targets": [12]
    //                             }
    //                         ],
    //                         select: true,
    //                         destroy: true,
    //                         colReorder: true,
    //                         pageLength: initialDatatableLoad,
    //                         lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
    //                         info: true,
    //                         responsive: true,
    //                         "order": [[0, "asc"]],
    //                         action: function () {
    //                             $('.tblEmployeelist').DataTable().ajax.reload();
    //                         },
    //                         "fnDrawCallback": function (oSettings) {
    //                             $('.paginate_button.page-item').removeClass('disabled');
    //                             $('#tblEmployeelist_ellipsis').addClass('disabled');
    //                             if (oSettings._iDisplayLength == -1) {
    //                                 if (oSettings.fnRecordsDisplay() > 150) {
    //
    //                                 }
    //                             } else {
    //
    //                             }
    //                             if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
    //                                 $('.paginate_button.page-item.next').addClass('disabled');
    //                             }
    //
    //                             $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                                 .on('click', function () {
    //                                     $('.fullScreenSpin').css('display', 'inline-block');
    //                                     var splashArrayEmployeeListDupp = new Array();
    //                                     let dataLenght = oSettings._iDisplayLength;
    //                                     let employeeSearch = $('#tblEmployeelist_filter input').val();
    //
    //                                     sideBarService.getAllEmployeesDataVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
    //
    //                                                 for (let j = 0; j < dataObjectnew.temployee.length; j++) {
    //
    //                                                     let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.ARBalance) || 0.00;
    //                                                     let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.CreditBalance) || 0.00;
    //                                                     let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.Balance) || 0.00;
    //                                                     let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.CreditLimit) || 0.00;
    //                                                     let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.SalesOrderBalance) || 0.00;
    //                                                     var dataList = {
    //                                                         id: dataObjectnew.temployee[j].fields.ID || '',
    //                                                         clientName: dataObjectnew.temployee[j].fields.ClientName || '',
    //                                                         company: dataObjectnew.temployee[j].fields.Companyname || '',
    //                                                         contactname: dataObjectnew.temployee[j].fields.ContactName || '',
    //                                                         phone: dataObjectnew.temployee[j].fields.Phone || '',
    //                                                         arbalance: arBalance || 0.00,
    //                                                         creditbalance: creditBalance || 0.00,
    //                                                         balance: balance || 0.00,
    //                                                         creditlimit: creditLimit || 0.00,
    //                                                         salesorderbalance: salesOrderBalance || 0.00,
    //                                                         email: dataObjectnew.temployee[j].fields.Email || '',
    //                                                         job: dataObjectnew.temployee[j].fields.JobName || '',
    //                                                         accountno: dataObjectnew.temployee[j].fields.AccountNo || '',
    //                                                         clientno: dataObjectnew.temployee[j].fields.ClientNo || '',
    //                                                         jobtitle: dataObjectnew.temployee[j].fields.JobTitle || '',
    //                                                         notes: dataObjectnew.temployee[j].fields.Notes || '',
    //                                                         state: dataObjectnew.temployee[j].fields.State || '',
    //                                                         country: dataObjectnew.temployee[j].fields.Country || '',
    //                                                         street: dataObjectnew.temployee[j].fields.Street || ' ',
    //                                                         street2: dataObjectnew.temployee[j].fields.Street2 || ' ',
    //                                                         street3: dataObjectnew.temployee[j].fields.Street3 || ' ',
    //                                                         suburb: dataObjectnew.temployee[j].fields.Suburb || ' ',
    //                                                         postcode: dataObjectnew.temployee[j].fields.Postcode || ' ',
    //                                                         clienttype: dataObjectnew.temployee[j].fields.ClientTypeName || 'Default',
    //                                                         discount: dataObjectnew.temployee[j].fields.Discount || 0
    //                                                     };
    //
    //                                                     dataTableList.push(dataList);
    //                                                     let mobile = contactService.changeMobileFormat(dataObjectnew.temployee[j].fields.Mobile)
    //                                                     var dataListEmployeeDupp = [
    //                                                         dataObjectnew.temployee[j].fields.EmployeeName || '-',
    //                                                         dataObjectnew.temployee[j].fields.FirstName || '',
    //                                                         dataObjectnew.temployee[j].fields.LastName || '',
    //                                                         dataObjectnew.temployee[j].fields.Phone || '',
    //                                                         mobile || '',
    //                                                         dataObjectnew.temployee[j].fields.Email || '',
    //                                                         dataObjectnew.temployee[j].fields.DefaultClassName || '',
    //                                                         dataObjectnew.temployee[j].fields.Country || '',
    //                                                         dataObjectnew.temployee[j].fields.State || '',
    //                                                         dataObjectnew.temployee[j].fields.Street2 || '',
    //                                                         dataObjectnew.temployee[j].fields.Street || '',
    //                                                         dataObjectnew.temployee[j].fields.Postcode || '',
    //                                                         dataObjectnew.temployee[j].fields.ID || ''
    //                                                     ];
    //
    //                                                     splashArrayEmployeeList.push(dataListEmployeeDupp);
    //                                                     //}
    //                                                 }
    //
    //                                                 let uniqueChars = [...new Set(splashArrayEmployeeList)];
    //                                                 var datatable = $('.tblEmployeelist').DataTable();
    //                                                 datatable.clear();
    //                                                 datatable.rows.add(uniqueChars);
    //                                                 datatable.draw(false);
    //                                                 setTimeout(function () {
    //                                                   $(".tblEmployeelist").dataTable().fnPageChange('last');
    //                                                 }, 400);
    //
    //                                                 $('.fullScreenSpin').css('display', 'none');
    //
    //
    //                                     }).catch(function (err) {
    //                                         $('.fullScreenSpin').css('display', 'none');
    //                                     });
    //
    //                                 });
    //                             setTimeout(function () {
    //                                 MakeNegative();
    //                             }, 100);
    //                         },
    //                         language: { search: "",searchPlaceholder: "Search List..." },
    //                         "fnInitComplete": function (oSettings) {
    //                             $("<button class='btn btn-primary btnAddNewEmployee' data-dismiss='modal' data-toggle='modal' data-target='#addEmployeeModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEmployeelist_filter");
    //                             $("<button class='btn btn-primary btnRefreshEmployee' type='button' id='btnRefreshEmployee' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEmployeelist_filter");
    //
    //                             let urlParametersPage = FlowRouter.current().queryParams.page;
    //                             if (urlParametersPage) {
    //                                 this.fnPageChange('last');
    //                             }
    //
    //                         }
    //
    //                     }).on('page', function () {
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                         let draftRecord = templateObject.custdatatablerecords.get();
    //                         templateObject.custdatatablerecords.set(draftRecord);
    //                     }).on('column-reorder', function () {
    //
    //                     }).on('length.dt', function (e, settings, len) {
    //
    //                         let dataLenght = settings._iDisplayLength;
    //                         let employeeSearch = $('#tblEmployeelist_filter input').val();
    //                         splashArrayEmployeeList = [];
    //                         if (dataLenght == -1) {
    //                           if(settings.fnRecordsDisplay() > initialDatatableLoad){
    //                             $('.fullScreenSpin').css('display','none');
    //                           }else{
    //                             if (employeeSearch.replace(/\s/g, '') != '') {
    //                               $('.fullScreenSpin').css('display', 'inline-block');
    //                               sideBarService.getAllEmployeesDataVS1ByName(employeeSearch).then(function (data) {
    //                                   let lineItems = [];
    //                                   let lineItemObj = {};
    //                                   if (data.temployee.length > 0) {
    //                                       for (let i = 0; i < data.temployee.length; i++) {
    //                                           let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
    //                                           let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
    //                                           let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
    //                                           let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
    //                                           let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
    //                                           var dataList = {
    //                                               id: data.temployee[i].fields.ID || '',
    //                                               clientName: data.temployee[i].fields.ClientName || '',
    //                                               company: data.temployee[i].fields.Companyname || '',
    //                                               contactname: data.temployee[i].fields.ContactName || '',
    //                                               phone: data.temployee[i].fields.Phone || '',
    //                                               arbalance: arBalance || 0.00,
    //                                               creditbalance: creditBalance || 0.00,
    //                                               balance: balance || 0.00,
    //                                               creditlimit: creditLimit || 0.00,
    //                                               salesorderbalance: salesOrderBalance || 0.00,
    //                                               email: data.temployee[i].fields.Email || '',
    //                                               job: data.temployee[i].fields.JobName || '',
    //                                               accountno: data.temployee[i].fields.AccountNo || '',
    //                                               clientno: data.temployee[i].fields.ClientNo || '',
    //                                               jobtitle: data.temployee[i].fields.JobTitle || '',
    //                                               notes: data.temployee[i].fields.Notes || '',
    //                                               state: data.temployee[i].fields.State || '',
    //                                               country: data.temployee[i].fields.Country || '',
    //                                               street: data.temployee[i].fields.Street || ' ',
    //                                               street2: data.temployee[i].fields.Street2 || ' ',
    //                                               street3: data.temployee[i].fields.Street3 || ' ',
    //                                               suburb: data.temployee[i].fields.Suburb || ' ',
    //                                               postcode: data.temployee[i].fields.Postcode || ' '
    //                                           };
    //
    //                                           dataTableList.push(dataList);
    //                                           let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
    //                                           var dataListEmployee = [
    //                                               data.temployee[i].fields.EmployeeName || '-',
    //                                               data.temployee[i].fields.FirstName || '',
    //                                               data.temployee[i].fields.LastName || '',
    //                                               data.temployee[i].fields.Phone || '',
    //                                               mobile || '',
    //                                               data.temployee[i].fields.Email || '',
    //                                               data.temployee[i].fields.DefaultClassName || '',
    //                                               data.temployee[i].fields.Country || '',
    //                                               data.temployee[i].fields.State || '',
    //                                               data.temployee[i].fields.Street2 || '',
    //                                               data.temployee[i].fields.Street || '',
    //                                               data.temployee[i].fields.Postcode || '',
    //                                               data.temployee[i].fields.ID || ''
    //                                           ];
    //                                           splashArrayEmployeeList.push(dataListEmployee);
    //                                           //}
    //                                       }
    //                                       var datatable = $('.tblEmployeelist').DataTable();
    //                                       datatable.clear();
    //                                       datatable.rows.add(splashArrayEmployeeList);
    //                                       datatable.draw(false);
    //
    //                                       $('.fullScreenSpin').css('display', 'none');
    //                                   } else {
    //
    //                                       $('.fullScreenSpin').css('display', 'none');
    //                                       $('#employeeListPOPModal').modal('toggle');
    //                                       swal({
    //                                           title: 'Question',
    //                                           text: "Employee does not exist, would you like to create it?",
    //                                           type: 'question',
    //                                           showCancelButton: true,
    //                                           confirmButtonText: 'Yes',
    //                                           cancelButtonText: 'No'
    //                                       }).then((result) => {
    //                                           if (result.value) {
    //                                               $('#addEmployeeModal').modal('toggle');
    //                                               $('#edtEmployeeCompany').val(dataSearchName);
    //                                           } else if (result.dismiss === 'cancel') {
    //                                               $('#employeeListPOPModal').modal('toggle');
    //                                           }
    //                                       });
    //
    //                                   }
    //
    //                               }).catch(function (err) {
    //                                   $('.fullScreenSpin').css('display', 'none');
    //                               });
    //                             }else{
    //                               $('.fullScreenSpin').css('display', 'none');
    //
    //                             }
    //
    //                           }
    //
    //                         } else {
    //                             if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
    //                                 $('.fullScreenSpin').css('display', 'none');
    //                             } else {
    //                                 sideBarService.getAllEmployeesDataVS1(dataLenght, 0).then(function (dataNonBo) {
    //
    //                                     addVS1Data('TEmployee', JSON.stringify(dataNonBo)).then(function (datareturn) {
    //                                         templateObject.resetData(dataNonBo);
    //                                         $('.fullScreenSpin').css('display', 'none');
    //                                     }).catch(function (err) {
    //                                         $('.fullScreenSpin').css('display', 'none');
    //                                     });
    //                                 }).catch(function (err) {
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 });
    //                             }
    //                         }
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                     });
    //
    //                     // $(currenttablename).DataTable().column( 0 ).visible( true );
    //                     //$('.fullScreenSpin').css('display','none');
    //                 }, 0);
    //
    //
    //                 var columns = $(currenttablename + ' th');
    //                 let sTible = "";
    //                 let sWidth = "";
    //                 let sIndex = "";
    //                 let sVisible = "";
    //                 let columVisible = false;
    //                 let sClass = "";
    //                 $.each(columns, function (i, v) {
    //                     if (v.hidden == false) {
    //                         columVisible = true;
    //                     }
    //                     if ((v.className.includes("hiddenColumn"))) {
    //                         columVisible = false;
    //                     }
    //                     sWidth = v.style.width.replace('px', "");
    //                     let datatablerecordObj = {
    //                         sTitle: v.innerText || '',
    //                         sWidth: sWidth || '',
    //                         sIndex: v.cellIndex || 0,
    //                         sVisible: columVisible || false,
    //                         sClass: v.className || ''
    //                     };
    //                     tableHeaderList.push(datatablerecordObj);
    //                 });
    //                 templateObject.tableheaderrecords.set(tableHeaderList);
    //                 $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //
    //
    //             }).catch(function (err) {
    //
    //             });
    //         } else {
    //             let data = JSON.parse(dataObject[0].data);
    //             let useData = data.temployee;
    //
    //             let lineItems = [];
    //             let lineItemObj = {};
    //             for (let i = 0; i < data.temployee.length; i++) {
    //                 let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile)
    //                 var dataListEmployee = [
    //                     data.temployee[i].fields.EmployeeName || '-',
    //                     data.temployee[i].fields.FirstName || '',
    //                     data.temployee[i].fields.LastName || '',
    //                     data.temployee[i].fields.Phone || '',
    //                     mobile || '',
    //                     data.temployee[i].fields.Email || '',
    //                     data.temployee[i].fields.DefaultClassName || '',
    //                     data.temployee[i].fields.Country || '',
    //                     data.temployee[i].fields.State || '',
    //                     data.temployee[i].fields.Street2 || '',
    //                     data.temployee[i].fields.Street || '',
    //                     data.temployee[i].fields.Postcode || '',
    //                     data.temployee[i].fields.ID || ''
    //                 ];
    //
    //                 splashArrayEmployeeList.push(dataListEmployee);
    //                 //}
    //             }
    //
    //             function MakeNegative() {
    //                 $('td').each(function () {
    //                     if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    //                 });
    //             };
    //
    //             templateObject.custdatatablerecords.set(dataTableList);
    //
    //             if (templateObject.custdatatablerecords.get()) {
    //
    //                 Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), currenttablename, function (error, result) {
    //                     if (error) {
    //
    //                     } else {
    //                         if (result) {
    //                             for (let i = 0; i < result.customFields.length; i++) {
    //                                 let customcolumn = result.customFields;
    //                                 let columData = customcolumn[i].label;
    //                                 let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                                 let hiddenColumn = customcolumn[i].hidden;
    //                                 let columnClass = columHeaderUpdate.split('.')[1];
    //                                 let columnWidth = customcolumn[i].width;
    //                                 let columnindex = customcolumn[i].index + 1;
    //
    //                                 if (hiddenColumn == true) {
    //
    //                                     $("." + columnClass + "").addClass('hiddenColumn');
    //                                     $("." + columnClass + "").removeClass('showColumn');
    //                                 } else if (hiddenColumn == false) {
    //                                     $("." + columnClass + "").removeClass('hiddenColumn');
    //                                     $("." + columnClass + "").addClass('showColumn');
    //                                 }
    //
    //                             }
    //                         }
    //
    //                     }
    //                 });
    //
    //
    //                 setTimeout(function () {
    //                     MakeNegative();
    //                 }, 100);
    //             }
    //
    //             //$('.fullScreenSpin').css('display','none');
    //             setTimeout(function () {
    //                 $("#"+currenttablename).DataTable({
    //                     data: splashArrayEmployeeList,
    //                     "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                     columnDefs: [
    //                         {
    //                             className: "colEmployeeName",
    //                             "targets": [0]
    //                         }, {
    //                             className: "colFirstName",
    //                             "targets": [1]
    //                         }, {
    //                             className: "colLastName",
    //                             "targets": [2]
    //                         }, {
    //                             className: "colPhone",
    //                             "targets": [3]
    //                         }, {
    //                             className: "colMobile",
    //                             "targets": [4]
    //                         }, {
    //                             className: "colEmail ",
    //                             "targets": [5]
    //                         }, {
    //                             className: "colDepartment",
    //                             "targets": [6]
    //                         }, {
    //                             className: "colCountry",
    //                             "targets": [7]
    //                         }, {
    //                             className: "colState hiddenColumn",
    //                             "targets": [8]
    //                         }, {
    //                             className: "colCity hiddenColumn",
    //                             "targets": [9]
    //                         }, {
    //                             className: "colStreetAddress hiddenColumn",
    //                             "targets": [10]
    //                         }, {
    //                             className: "colZipCode hiddenColumn",
    //                             "targets": [11]
    //                         }, {
    //                             className: "colID hiddenColumn",
    //                             "targets": [12]
    //                         }
    //                     ],
    //                     select: true,
    //                     destroy: true,
    //                     colReorder: true,
    //                     pageLength: initialDatatableLoad,
    //                     lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
    //                     info: true,
    //                     responsive: true,
    //                     "order": [[0, "asc"]],
    //                     action: function () {
    //                         $("#"+currenttablename).DataTable().ajax.reload();
    //                     },
    //                     "fnDrawCallback": function (oSettings) {
    //                         $('.paginate_button.page-item').removeClass('disabled');
    //                         $('#'+currenttablename+'_ellipsis').addClass('disabled');
    //                         if (oSettings._iDisplayLength == -1) {
    //                             if (oSettings.fnRecordsDisplay() > 150) {
    //
    //                             }
    //                         } else {
    //
    //                         }
    //                         if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
    //                             $('.paginate_button.page-item.next').addClass('disabled');
    //                         }
    //
    //                         $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                             .on('click', function () {
    //                                 $('.fullScreenSpin').css('display', 'inline-block');
    //                                 var splashArrayEmployeeListDupp = new Array();
    //                                 let dataLenght = oSettings._iDisplayLength;
    //                                 let employeeSearch = $('#'+currenttablename+'_filter input').val();
    //
    //                                 sideBarService.getAllEmployeesDataVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
    //
    //                                             for (let j = 0; j < dataObjectnew.temployee.length; j++) {
    //
    //                                                 let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.ARBalance) || 0.00;
    //                                                 let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.CreditBalance) || 0.00;
    //                                                 let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.Balance) || 0.00;
    //                                                 let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.CreditLimit) || 0.00;
    //                                                 let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.SalesOrderBalance) || 0.00;
    //                                                 var dataList = {
    //                                                     id: dataObjectnew.temployee[j].fields.ID || '',
    //                                                     clientName: dataObjectnew.temployee[j].fields.ClientName || '',
    //                                                     company: dataObjectnew.temployee[j].fields.Companyname || '',
    //                                                     contactname: dataObjectnew.temployee[j].fields.ContactName || '',
    //                                                     phone: dataObjectnew.temployee[j].fields.Phone || '',
    //                                                     arbalance: arBalance || 0.00,
    //                                                     creditbalance: creditBalance || 0.00,
    //                                                     balance: balance || 0.00,
    //                                                     creditlimit: creditLimit || 0.00,
    //                                                     salesorderbalance: salesOrderBalance || 0.00,
    //                                                     email: dataObjectnew.temployee[j].fields.Email || '',
    //                                                     job: dataObjectnew.temployee[j].fields.JobName || '',
    //                                                     accountno: dataObjectnew.temployee[j].fields.AccountNo || '',
    //                                                     clientno: dataObjectnew.temployee[j].fields.ClientNo || '',
    //                                                     jobtitle: dataObjectnew.temployee[j].fields.JobTitle || '',
    //                                                     notes: dataObjectnew.temployee[j].fields.Notes || '',
    //                                                     state: dataObjectnew.temployee[j].fields.State || '',
    //                                                     country: dataObjectnew.temployee[j].fields.Country || '',
    //                                                     street: dataObjectnew.temployee[j].fields.Street || ' ',
    //                                                     street2: dataObjectnew.temployee[j].fields.Street2 || ' ',
    //                                                     street3: dataObjectnew.temployee[j].fields.Street3 || ' ',
    //                                                     suburb: dataObjectnew.temployee[j].fields.Suburb || ' ',
    //                                                     postcode: dataObjectnew.temployee[j].fields.Postcode || ' ',
    //                                                     clienttype: dataObjectnew.temployee[j].fields.ClientTypeName || 'Default',
    //                                                     discount: dataObjectnew.temployee[j].fields.Discount || 0
    //                                                 };
    //
    //                                                 dataTableList.push(dataList);
    //
    //                                                 let mobile = contactService.changeMobileFormat(dataObjectnew.temployee[j].fields.Mobile);
    //                                                 var dataListEmployeeDupp = [
    //                                                     dataObjectnew.temployee[j].fields.EmployeeName || '-',
    //                                                     dataObjectnew.temployee[j].fields.FirstName || '',
    //                                                     dataObjectnew.temployee[j].fields.LastName || '',
    //                                                     dataObjectnew.temployee[j].fields.Phone || '',
    //                                                     mobile || '',
    //                                                     dataObjectnew.temployee[j].fields.Email || '',
    //                                                     dataObjectnew.temployee[j].fields.DefaultClassName || '',
    //                                                     dataObjectnew.temployee[j].fields.Country || '',
    //                                                     dataObjectnew.temployee[j].fields.State || '',
    //                                                     dataObjectnew.temployee[j].fields.Street2 || '',
    //                                                     dataObjectnew.temployee[j].fields.Street || '',
    //                                                     dataObjectnew.temployee[j].fields.Postcode || '',
    //                                                     dataObjectnew.temployee[j].fields.ID || ''
    //                                                 ];
    //
    //
    //                                                 splashArrayEmployeeList.push(dataListEmployeeDupp);
    //                                                 //}
    //                                             }
    //
    //                                             let uniqueChars = [...new Set(splashArrayEmployeeList)];
    //                                             var datatable = $("#"+currenttablename).DataTable();
    //                                             datatable.clear();
    //                                             datatable.rows.add(uniqueChars);
    //                                             datatable.draw(false);
    //                                             setTimeout(function () {
    //                                               $("#"+currenttablename).dataTable().fnPageChange('last');
    //                                             }, 400);
    //
    //                                             $('.fullScreenSpin').css('display', 'none');
    //
    //
    //                                 }).catch(function (err) {
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 });
    //
    //                             });
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                     },
    //                     language: { search: "",searchPlaceholder: "Search List..." },
    //                     "fnInitComplete": function (oSettings) {
    //                         $("<button class='btn btn-primary btnAddNewEmployee' data-dismiss='modal' data-toggle='modal' data-target='#addEmployeeModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#"+currenttablename+"_filter");
    //                         $("<button class='btn btn-primary btnRefreshEmployee' type='button' id='btnRefreshEmployee' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#"+currenttablename+"_filter");
    //
    //                         let urlParametersPage = FlowRouter.current().queryParams.page;
    //                         if (urlParametersPage) {
    //                             this.fnPageChange('last');
    //                         }
    //
    //                     }
    //
    //                 }).on('page', function () {
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                     let draftRecord = templateObject.custdatatablerecords.get();
    //                     templateObject.custdatatablerecords.set(draftRecord);
    //                 }).on('column-reorder', function () {
    //
    //                 }).on('length.dt', function (e, settings, len) {
    //
    //                     let dataLenght = settings._iDisplayLength;
    //                     let employeeSearch = $('#'+currenttablename+'_filter input').val();
    //                     splashArrayEmployeeList = [];
    //                     if (dataLenght == -1) {
    //                       if(settings.fnRecordsDisplay() > initialDatatableLoad){
    //                         $('.fullScreenSpin').css('display','none');
    //                       }else{
    //                         if (employeeSearch.replace(/\s/g, '') != '') {
    //                           $('.fullScreenSpin').css('display', 'inline-block');
    //                           sideBarService.getAllEmployeesDataVS1ByName(employeeSearch).then(function (data) {
    //                               let lineItems = [];
    //                               let lineItemObj = {};
    //                               if (data.temployee.length > 0) {
    //                                   for (let i = 0; i < data.temployee.length; i++) {
    //                                       let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
    //                                       let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
    //                                       let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
    //                                       let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
    //                                       let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
    //                                       var dataList = {
    //                                           id: data.temployee[i].fields.ID || '',
    //                                           clientName: data.temployee[i].fields.ClientName || '',
    //                                           company: data.temployee[i].fields.Companyname || '',
    //                                           contactname: data.temployee[i].fields.ContactName || '',
    //                                           phone: data.temployee[i].fields.Phone || '',
    //                                           arbalance: arBalance || 0.00,
    //                                           creditbalance: creditBalance || 0.00,
    //                                           balance: balance || 0.00,
    //                                           creditlimit: creditLimit || 0.00,
    //                                           salesorderbalance: salesOrderBalance || 0.00,
    //                                           email: data.temployee[i].fields.Email || '',
    //                                           job: data.temployee[i].fields.JobName || '',
    //                                           accountno: data.temployee[i].fields.AccountNo || '',
    //                                           clientno: data.temployee[i].fields.ClientNo || '',
    //                                           jobtitle: data.temployee[i].fields.JobTitle || '',
    //                                           notes: data.temployee[i].fields.Notes || '',
    //                                           state: data.temployee[i].fields.State || '',
    //                                           country: data.temployee[i].fields.Country || '',
    //                                           street: data.temployee[i].fields.Street || ' ',
    //                                           street2: data.temployee[i].fields.Street2 || ' ',
    //                                           street3: data.temployee[i].fields.Street3 || ' ',
    //                                           suburb: data.temployee[i].fields.Suburb || ' ',
    //                                           postcode: data.temployee[i].fields.Postcode || ' '
    //                                       };
    //
    //                                       dataTableList.push(dataList);
    //
    //                                       let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
    //                                       var dataListEmployee = [
    //                                           data.temployee[i].fields.EmployeeName || '-',
    //                                           data.temployee[i].fields.FirstName || '',
    //                                           data.temployee[i].fields.LastName || '',
    //                                           data.temployee[i].fields.Phone || '',
    //                                           mobile || '',
    //                                           data.temployee[i].fields.Email || '',
    //                                           data.temployee[i].fields.DefaultClassName || '',
    //                                           data.temployee[i].fields.Country || '',
    //                                           data.temployee[i].fields.State || '',
    //                                           data.temployee[i].fields.Street2 || '',
    //                                           data.temployee[i].fields.Street || '',
    //                                           data.temployee[i].fields.Postcode || '',
    //                                           data.temployee[i].fields.ID || ''
    //                                       ];
    //
    //                                       splashArrayEmployeeList.push(dataListEmployee);
    //                                       //}
    //                                   }
    //                                   var datatable = $("#"+currenttablename).DataTable();
    //                                   datatable.clear();
    //                                   datatable.rows.add(splashArrayEmployeeList);
    //                                   datatable.draw(false);
    //
    //                                   $('.fullScreenSpin').css('display', 'none');
    //                               } else {
    //
    //                                   $('.fullScreenSpin').css('display', 'none');
    //                                   $('#employeeListPOPModal').modal('toggle');
    //                                   swal({
    //                                       title: 'Question',
    //                                       text: "Employee does not exist, would you like to create it?",
    //                                       type: 'question',
    //                                       showCancelButton: true,
    //                                       confirmButtonText: 'Yes',
    //                                       cancelButtonText: 'No'
    //                                   }).then((result) => {
    //                                       if (result.value) {
    //                                           $('#addEmployeeModal').modal('toggle');
    //                                           $('#edtEmployeeCompany').val(dataSearchName);
    //                                       } else if (result.dismiss === 'cancel') {
    //                                           $('#employeeListPOPModal').modal('toggle');
    //                                       }
    //                                   });
    //
    //                               }
    //
    //                           }).catch(function (err) {
    //                               $('.fullScreenSpin').css('display', 'none');
    //                           });
    //                         }else{
    //                           $('.fullScreenSpin').css('display', 'none');
    //
    //                         }
    //
    //                       }
    //
    //                     } else {
    //                         if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
    //                             $('.fullScreenSpin').css('display', 'none');
    //                         } else {
    //                             sideBarService.getAllEmployeesDataVS1(dataLenght, 0).then(function (dataNonBo) {
    //
    //                                 addVS1Data('TEmployee', JSON.stringify(dataNonBo)).then(function (datareturn) {
    //                                     templateObject.resetData(dataNonBo);
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 }).catch(function (err) {
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 });
    //                             }).catch(function (err) {
    //                                 $('.fullScreenSpin').css('display', 'none');
    //                             });
    //                         }
    //                     }
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                 });
    //
    //                 // $(currenttablename).DataTable().column( 0 ).visible( true );
    //                 //$('.fullScreenSpin').css('display','none');
    //             }, 0);
    //
    //             var columns = $('#'+currenttablename+' th');
    //             let sTible = "";
    //             let sWidth = "";
    //             let sIndex = "";
    //             let sVisible = "";
    //             let columVisible = false;
    //             let sClass = "";
    //             $.each(columns, function (i, v) {
    //                 if (v.hidden == false) {
    //                     columVisible = true;
    //                 }
    //                 if ((v.className.includes("hiddenColumn"))) {
    //                     columVisible = false;
    //                 }
    //                 sWidth = v.style.width.replace('px', "");
    //                 let datatablerecordObj = {
    //                     sTitle: v.innerText || '',
    //                     sWidth: sWidth || '',
    //                     sIndex: v.cellIndex || 0,
    //                     sVisible: columVisible || false,
    //                     sClass: v.className || ''
    //                 };
    //                 tableHeaderList.push(datatablerecordObj);
    //             });
    //             templateObject.tableheaderrecords.set(tableHeaderList);
    //             $('div.dataTables_filter input').addClass('form-control form-control-sm');
    //         }
    //     }).catch(function (err) {
    //
    //         sideBarService.getAllEmployeesDataVS1(initialBaseDataLoad, 0).then(function (data) {
    //             addVS1Data('TEmployee', JSON.stringify(data));
    //             let lineItems = [];
    //             let lineItemObj = {};
    //             for (let i = 0; i < data.temployee.length; i++) {
    //                 let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
    //                 let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
    //                 let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
    //                 let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
    //                 let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
    //                 var dataList = {
    //                     id: data.temployee[i].fields.ID || '',
    //                     clientName: data.temployee[i].fields.ClientName || '',
    //                     company: data.temployee[i].fields.Companyname || '',
    //                     contactname: data.temployee[i].fields.ContactName || '',
    //                     phone: data.temployee[i].fields.Phone || '',
    //                     arbalance: arBalance || 0.00,
    //                     creditbalance: creditBalance || 0.00,
    //                     balance: balance || 0.00,
    //                     creditlimit: creditLimit || 0.00,
    //                     salesorderbalance: salesOrderBalance || 0.00,
    //                     email: data.temployee[i].fields.Email || '',
    //                     job: data.temployee[i].fields.JobName || '',
    //                     accountno: data.temployee[i].fields.AccountNo || '',
    //                     clientno: data.temployee[i].fields.ClientNo || '',
    //                     jobtitle: data.temployee[i].fields.JobTitle || '',
    //                     notes: data.temployee[i].fields.Notes || '',
    //                     country: data.temployee[i].fields.Country || '',
    //                     state: data.temployee[i].fields.State || '',
    //                     street: data.temployee[i].fields.Street || ' ',
    //                     street2: data.temployee[i].fields.Street2 || ' ',
    //                     street3: data.temployee[i].fields.Street3 || ' ',
    //                     suburb: data.temployee[i].fields.Suburb || ' ',
    //                     postcode: data.temployee[i].fields.Postcode || ' ',
    //                     clienttype: data.temployee[i].fields.ClientTypeName || 'Default',
    //                     discount: data.temployee[i].fields.Discount || 0
    //                 };
    //
    //                 dataTableList.push(dataList);
    //                 let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
    //                 var dataListEmployee = [
    //                     data.temployee[i].fields.EmployeeName || '-',
    //                     data.temployee[i].fields.FirstName || '',
    //                     data.temployee[i].fields.LastName || '',
    //                     data.temployee[i].fields.Phone || '',
    //                     mobile || '',
    //                     data.temployee[i].fields.Email || '',
    //                     data.temployee[i].fields.DefaultClassName || '',
    //                     data.temployee[i].fields.Country || '',
    //                     data.temployee[i].fields.State || '',
    //                     data.temployee[i].fields.Street2 || '',
    //                     data.temployee[i].fields.Street || '',
    //                     data.temployee[i].fields.Postcode || '',
    //                     data.temployee[i].fields.ID || ''
    //                 ];
    //
    //                 splashArrayEmployeeList.push(dataListEmployee);
    //                 //}
    //             }
    //
    //             function MakeNegative() {
    //                 // TDs = document.getElementsByTagName('td');
    //                 // for (var i=0; i<TDs.length; i++) {
    //                 // var temp = TDs[i];
    //                 // if (temp.firstChild.nodeValue.indexOf('-'+Currency) == 0){
    //                 // temp.className = "text-danger";
    //                 // }
    //                 // }
    //
    //                 $('td').each(function () {
    //                     if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    //                 });
    //             };
    //
    //             templateObject.custdatatablerecords.set(dataTableList);
    //
    //             if (templateObject.custdatatablerecords.get()) {
    //
    //                 Meteor.call('readPrefMethod', localStorage.getItem('mycloudLogonID'), currenttablename, function (error, result) {
    //                     if (error) {
    //
    //                     } else {
    //                         if (result) {
    //                             for (let i = 0; i < result.customFields.length; i++) {
    //                                 let customcolumn = result.customFields;
    //                                 let columData = customcolumn[i].label;
    //                                 let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                                 let hiddenColumn = customcolumn[i].hidden;
    //                                 let columnClass = columHeaderUpdate.split('.')[1];
    //                                 let columnWidth = customcolumn[i].width;
    //                                 let columnindex = customcolumn[i].index + 1;
    //
    //                                 if (hiddenColumn == true) {
    //
    //                                     $("." + columnClass + "").addClass('hiddenColumn');
    //                                     $("." + columnClass + "").removeClass('showColumn');
    //                                 } else if (hiddenColumn == false) {
    //                                     $("." + columnClass + "").removeClass('hiddenColumn');
    //                                     $("." + columnClass + "").addClass('showColumn');
    //                                 }
    //
    //                             }
    //                         }
    //
    //                     }
    //                 });
    //
    //
    //                 setTimeout(function () {
    //                     MakeNegative();
    //                 }, 100);
    //             }
    //
    //             //$('.fullScreenSpin').css('display','none');
    //             setTimeout(function () {
    //                 $("#"+currenttablename).DataTable({
    //                     data: splashArrayEmployeeList,
    //                     "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
    //                     columnDefs: [
    //                         {
    //                             className: "colEmployeeName",
    //                             "targets": [0]
    //                         }, {
    //                             className: "colFirstName",
    //                             "targets": [1]
    //                         }, {
    //                             className: "colLastName",
    //                             "targets": [2]
    //                         }, {
    //                             className: "colPhone",
    //                             "targets": [3]
    //                         }, {
    //                             className: "colMobile",
    //                             "targets": [4]
    //                         }, {
    //                             className: "colEmail ",
    //                             "targets": [5]
    //                         }, {
    //                             className: "colDepartment",
    //                             "targets": [6]
    //                         }, {
    //                             className: "colCountry",
    //                             "targets": [7]
    //                         }, {
    //                             className: "colState hiddenColumn",
    //                             "targets": [8]
    //                         }, {
    //                             className: "colCity hiddenColumn",
    //                             "targets": [9]
    //                         }, {
    //                             className: "colStreetAddress hiddenColumn",
    //                             "targets": [10]
    //                         }, {
    //                             className: "colZipCode hiddenColumn",
    //                             "targets": [11]
    //                         }, {
    //                             className: "colID hiddenColumn",
    //                             "targets": [12]
    //                         }
    //                     ],
    //                     select: true,
    //                     destroy: true,
    //                     colReorder: true,
    //                     pageLength: initialDatatableLoad,
    //                     lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
    //                     info: true,
    //                     responsive: true,
    //                     "order": [[0, "asc"]],
    //                     action: function () {
    //                         $("#"+currenttablename).DataTable().ajax.reload();
    //                     },
    //                     "fnDrawCallback": function (oSettings) {
    //                         $('.paginate_button.page-item').removeClass('disabled');
    //                         $('#'+currenttablename+'_ellipsis').addClass('disabled');
    //                         if (oSettings._iDisplayLength == -1) {
    //                             if (oSettings.fnRecordsDisplay() > 150) {
    //
    //                             }
    //                         } else {
    //
    //                         }
    //                         if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
    //                             $('.paginate_button.page-item.next').addClass('disabled');
    //                         }
    //
    //                         $('.paginate_button.next:not(.disabled)', this.api().table().container())
    //                             .on('click', function () {
    //                                 $('.fullScreenSpin').css('display', 'inline-block');
    //                                 var splashArrayEmployeeListDupp = new Array();
    //                                 let dataLenght = oSettings._iDisplayLength;
    //                                 let employeeSearch = $('#'+currenttablename+'_filter input').val();
    //
    //                                 sideBarService.getAllEmployeesDataVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
    //
    //                                             for (let j = 0; j < dataObjectnew.temployee.length; j++) {
    //
    //                                                 let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.ARBalance) || 0.00;
    //                                                 let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.CreditBalance) || 0.00;
    //                                                 let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.Balance) || 0.00;
    //                                                 let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.CreditLimit) || 0.00;
    //                                                 let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.temployee[j].fields.SalesOrderBalance) || 0.00;
    //                                                 var dataList = {
    //                                                     id: dataObjectnew.temployee[j].fields.ID || '',
    //                                                     clientName: dataObjectnew.temployee[j].fields.ClientName || '',
    //                                                     company: dataObjectnew.temployee[j].fields.Companyname || '',
    //                                                     contactname: dataObjectnew.temployee[j].fields.ContactName || '',
    //                                                     phone: dataObjectnew.temployee[j].fields.Phone || '',
    //                                                     arbalance: arBalance || 0.00,
    //                                                     creditbalance: creditBalance || 0.00,
    //                                                     balance: balance || 0.00,
    //                                                     creditlimit: creditLimit || 0.00,
    //                                                     salesorderbalance: salesOrderBalance || 0.00,
    //                                                     email: dataObjectnew.temployee[j].fields.Email || '',
    //                                                     job: dataObjectnew.temployee[j].fields.JobName || '',
    //                                                     accountno: dataObjectnew.temployee[j].fields.AccountNo || '',
    //                                                     clientno: dataObjectnew.temployee[j].fields.ClientNo || '',
    //                                                     jobtitle: dataObjectnew.temployee[j].fields.JobTitle || '',
    //                                                     notes: dataObjectnew.temployee[j].fields.Notes || '',
    //                                                     state: dataObjectnew.temployee[j].fields.State || '',
    //                                                     country: dataObjectnew.temployee[j].fields.Country || '',
    //                                                     street: dataObjectnew.temployee[j].fields.Street || ' ',
    //                                                     street2: dataObjectnew.temployee[j].fields.Street2 || ' ',
    //                                                     street3: dataObjectnew.temployee[j].fields.Street3 || ' ',
    //                                                     suburb: dataObjectnew.temployee[j].fields.Suburb || ' ',
    //                                                     postcode: dataObjectnew.temployee[j].fields.Postcode || ' ',
    //                                                     clienttype: dataObjectnew.temployee[j].fields.ClientTypeName || 'Default',
    //                                                     discount: dataObjectnew.temployee[j].fields.Discount || 0
    //                                                 };
    //
    //                                                 dataTableList.push(dataList);
    //                                                 let mobile = contactService.changeMobileFormat(dataObjectnew.temployee[j].fields.Mobile);
    //                                                 var dataListEmployeeDupp = [
    //                                                     dataObjectnew.temployee[j].fields.EmployeeName || '-',
    //                                                     dataObjectnew.temployee[j].fields.FirstName || '',
    //                                                     dataObjectnew.temployee[j].fields.LastName || '',
    //                                                     dataObjectnew.temployee[j].fields.Phone || '',
    //                                                     mobile || '',
    //                                                     dataObjectnew.temployee[j].fields.Email || '',
    //                                                     dataObjectnew.temployee[j].fields.DefaultClassName || '',
    //                                                     dataObjectnew.temployee[j].fields.Country || '',
    //                                                     dataObjectnew.temployee[j].fields.State || '',
    //                                                     dataObjectnew.temployee[j].fields.Street2 || '',
    //                                                     dataObjectnew.temployee[j].fields.Street || '',
    //                                                     dataObjectnew.temployee[j].fields.Postcode || '',
    //                                                     dataObjectnew.temployee[j].fields.ID || ''
    //                                                 ];
    //
    //                                                 splashArrayEmployeeList.push(dataListEmployeeDupp);
    //                                                 //}
    //                                             }
    //
    //                                             let uniqueChars = [...new Set(splashArrayEmployeeList)];
    //                                             var datatable = $("#"+currenttablename).DataTable();
    //                                             datatable.clear();
    //                                             datatable.rows.add(uniqueChars);
    //                                             datatable.draw(false);
    //                                             setTimeout(function () {
    //                                               $("#"+currenttablename).dataTable().fnPageChange('last');
    //                                             }, 400);
    //
    //                                             $('.fullScreenSpin').css('display', 'none');
    //
    //
    //                                 }).catch(function (err) {
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 });
    //
    //                             });
    //                         setTimeout(function () {
    //                             MakeNegative();
    //                         }, 100);
    //                     },
    //                     language: { search: "",searchPlaceholder: "Search List..." },
    //                     "fnInitComplete": function (oSettings) {
    //                         $("<button class='btn btn-primary btnAddNewEmployee' data-dismiss='modal' data-toggle='modal' data-target='#addEmployeeModal' type='button' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#"+currenttablename+"_filter");
    //                         $("<button class='btn btn-primary btnRefreshEmployee' type='button' id='btnRefreshEmployee' style='padding: 4px 10px; font-size: 16px; margin-left: 12px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#"+currenttablename+"_filter");
    //
    //                         let urlParametersPage = FlowRouter.current().queryParams.page;
    //                         if (urlParametersPage) {
    //                             this.fnPageChange('last');
    //                         }
    //
    //                     }
    //
    //                 }).on('page', function () {
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                     let draftRecord = templateObject.custdatatablerecords.get();
    //                     templateObject.custdatatablerecords.set(draftRecord);
    //                 }).on('column-reorder', function () {
    //
    //                 }).on('length.dt', function (e, settings, len) {
    //
    //                     let dataLenght = settings._iDisplayLength;
    //                     let employeeSearch = $('#'+currenttablename+'_filter input').val();
    //                     splashArrayEmployeeList = [];
    //                     if (dataLenght == -1) {
    //                       if(settings.fnRecordsDisplay() > initialDatatableLoad){
    //                         $('.fullScreenSpin').css('display','none');
    //                       }else{
    //                         if (employeeSearch.replace(/\s/g, '') != '') {
    //                           $('.fullScreenSpin').css('display', 'inline-block');
    //                           sideBarService.getAllEmployeesDataVS1ByName(employeeSearch).then(function (data) {
    //                               let lineItems = [];
    //                               let lineItemObj = {};
    //                               if (data.temployee.length > 0) {
    //                                   for (let i = 0; i < data.temployee.length; i++) {
    //                                       let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
    //                                       let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
    //                                       let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
    //                                       let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
    //                                       let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
    //                                       var dataList = {
    //                                           id: data.temployee[i].fields.ID || '',
    //                                           clientName: data.temployee[i].fields.ClientName || '',
    //                                           company: data.temployee[i].fields.Companyname || '',
    //                                           contactname: data.temployee[i].fields.ContactName || '',
    //                                           phone: data.temployee[i].fields.Phone || '',
    //                                           arbalance: arBalance || 0.00,
    //                                           creditbalance: creditBalance || 0.00,
    //                                           balance: balance || 0.00,
    //                                           creditlimit: creditLimit || 0.00,
    //                                           salesorderbalance: salesOrderBalance || 0.00,
    //                                           email: data.temployee[i].fields.Email || '',
    //                                           job: data.temployee[i].fields.JobName || '',
    //                                           accountno: data.temployee[i].fields.AccountNo || '',
    //                                           clientno: data.temployee[i].fields.ClientNo || '',
    //                                           jobtitle: data.temployee[i].fields.JobTitle || '',
    //                                           notes: data.temployee[i].fields.Notes || '',
    //                                           state: data.temployee[i].fields.State || '',
    //                                           country: data.temployee[i].fields.Country || '',
    //                                           street: data.temployee[i].fields.Street || ' ',
    //                                           street2: data.temployee[i].fields.Street2 || ' ',
    //                                           street3: data.temployee[i].fields.Street3 || ' ',
    //                                           suburb: data.temployee[i].fields.Suburb || ' ',
    //                                           postcode: data.temployee[i].fields.Postcode || ' '
    //                                       };
    //
    //                                       dataTableList.push(dataList);
    //                                       let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
    //                                       var dataListEmployee = [
    //                                           data.temployee[i].fields.EmployeeName || '-',
    //                                           data.temployee[i].fields.FirstName || '',
    //                                           data.temployee[i].fields.LastName || '',
    //                                           data.temployee[i].fields.Phone || '',
    //                                           mobile || '',
    //                                           data.temployee[i].fields.Email || '',
    //                                           data.temployee[i].fields.DefaultClassName || '',
    //                                           data.temployee[i].fields.Country || '',
    //                                           data.temployee[i].fields.State || '',
    //                                           data.temployee[i].fields.Street2 || '',
    //                                           data.temployee[i].fields.Street || '',
    //                                           data.temployee[i].fields.Postcode || '',
    //                                           data.temployee[i].fields.ID || ''
    //                                       ];
    //                                       splashArrayEmployeeList.push(dataListEmployee);
    //                                       //}
    //                                   }
    //                                   var datatable = $("#"+currenttablename).DataTable();
    //                                   datatable.clear();
    //                                   datatable.rows.add(splashArrayEmployeeList);
    //                                   datatable.draw(false);
    //
    //                                   $('.fullScreenSpin').css('display', 'none');
    //                               } else {
    //
    //                                   $('.fullScreenSpin').css('display', 'none');
    //                                   $('#employeeListPOPModal').modal('toggle');
    //                                   swal({
    //                                       title: 'Question',
    //                                       text: "Employee does not exist, would you like to create it?",
    //                                       type: 'question',
    //                                       showCancelButton: true,
    //                                       confirmButtonText: 'Yes',
    //                                       cancelButtonText: 'No'
    //                                   }).then((result) => {
    //                                       if (result.value) {
    //                                           $('#addEmployeeModal').modal('toggle');
    //                                           $('#edtEmployeeCompany').val(dataSearchName);
    //                                       } else if (result.dismiss === 'cancel') {
    //                                           $('#employeeListPOPModal').modal('toggle');
    //                                       }
    //                                   });
    //
    //                               }
    //
    //                           }).catch(function (err) {
    //                               $('.fullScreenSpin').css('display', 'none');
    //                           });
    //                         }else{
    //                           $('.fullScreenSpin').css('display', 'none');
    //
    //                         }
    //
    //                       }
    //
    //                     } else {
    //                         if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
    //                             $('.fullScreenSpin').css('display', 'none');
    //                         } else {
    //                             sideBarService.getAllEmployeesDataVS1(dataLenght, 0).then(function (dataNonBo) {
    //
    //                                 addVS1Data('TEmployee', JSON.stringify(dataNonBo)).then(function (datareturn) {
    //                                     templateObject.resetData(dataNonBo);
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 }).catch(function (err) {
    //                                     $('.fullScreenSpin').css('display', 'none');
    //                                 });
    //                             }).catch(function (err) {
    //                                 $('.fullScreenSpin').css('display', 'none');
    //                             });
    //                         }
    //                     }
    //                     setTimeout(function () {
    //                         MakeNegative();
    //                     }, 100);
    //                 });
    //
    //                 // $('.tblEmployeelist').DataTable().column( 0 ).visible( true );
    //                 //$('.fullScreenSpin').css('display','none');
    //             }, 0);
    //
    //
    //             var columns = $('#'+currenttablename+' th');
    //             let sTible = "";
    //             let sWidth = "";
    //             let sIndex = "";
    //             let sVisible = "";
    //             let columVisible = false;
    //             let sClass = "";
    //             $.each(columns, function (i, v) {
    //                 if (v.hidden == false) {
    //                     columVisible = true;
    //                 }
    //                 if ((v.className.includes("hiddenColumn"))) {
    //                     columVisible = false;
    //                 }
    //                 sWidth = v.style.width.replace('px', "");
    //                 let datatablerecordObj = {
    //                     sTitle: v.innerText || '',
    //                     sWidth: sWidth || '',
    //                     sIndex: v.cellIndex || 0,
    //                     sVisible: columVisible || false,
    //                     sClass: v.className || ''
    //                 };
    //                 tableHeaderList.push(datatablerecordObj);
    //             });
    //             templateObject.tableheaderrecords.set(tableHeaderList);
    //
    //
    //         }).catch(function (err) {
    //             // Bert.alert('<strong>' + err + '</strong>!', 'danger');
    //             //$('.fullScreenSpin').css('display','none');
    //             // Meteor._reload.reload();
    //         });
    //     });
    //
    //
    // }
    //
    // templateObject.getEmployees();
    //
    // tableResize();
});


Template.employeelistpop.events({
    'click #btnNewEmployee': function (event) {
        FlowRouter.go('/employeescard');
    },
    'click .btnAddNewEmployee': function (event) {
        setTimeout(function () {
          $('#edtEmployeeCompany').focus();
        }, 1000);
    },
    'click .btnCloseEmployeePOPList': function (event) {
        setTimeout(function () {
          $('#'+currenttablename+'_filter .form-control-sm').val('');
        }, 1000);
    },
    'click .btnRefreshEmployee': function (event) {
        let contactService = new ContactService();
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const employeeList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayEmployeeList = new Array();
        const dataTableList = [];
        const tableHeaderList = [];
        let dataSearchName = $('#'+currenttablename+'_filter input').val();

        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getAllEmployeesDataVS1ByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.temployee.length > 0) {
                    for (let i = 0; i < data.temployee.length; i++) {
                        let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
                        let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
                        let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            clientName: data.temployee[i].fields.ClientName || '',
                            company: data.temployee[i].fields.Companyname || '',
                            contactname: data.temployee[i].fields.ContactName || '',
                            phone: data.temployee[i].fields.Phone || '',
                            arbalance: arBalance || 0.00,
                            creditbalance: creditBalance || 0.00,
                            balance: balance || 0.00,
                            creditlimit: creditLimit || 0.00,
                            salesorderbalance: salesOrderBalance || 0.00,
                            email: data.temployee[i].fields.Email || '',
                            job: data.temployee[i].fields.JobName || '',
                            accountno: data.temployee[i].fields.AccountNo || '',
                            clientno: data.temployee[i].fields.ClientNo || '',
                            jobtitle: data.temployee[i].fields.JobTitle || '',
                            notes: data.temployee[i].fields.Notes || '',
                            state: data.temployee[i].fields.State || '',
                            country: data.temployee[i].fields.Country || '',
                            street: data.temployee[i].fields.Street || ' ',
                            street2: data.temployee[i].fields.Street2 || ' ',
                            street3: data.temployee[i].fields.Street3 || ' ',
                            suburb: data.temployee[i].fields.Suburb || ' ',
                            postcode: data.temployee[i].fields.Postcode || ' '
                        };

                        dataTableList.push(dataList);
                        let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
                        var dataListEmployee = [
                            data.temployee[i].fields.EmployeeName || '-',
                            data.temployee[i].fields.FirstName || '',
                            data.temployee[i].fields.LastName || '',
                            data.temployee[i].fields.Phone || '',
                            mobile || '',
                            data.temployee[i].fields.Email || '',
                            data.temployee[i].fields.DefaultClassName || '',
                            data.temployee[i].fields.Country || '',
                            data.temployee[i].fields.State || '',
                            data.temployee[i].fields.Street2 || '',
                            data.temployee[i].fields.Street || '',
                            data.temployee[i].fields.Postcode || '',
                            data.temployee[i].fields.ID || ''
                        ];
                        splashArrayEmployeeList.push(dataListEmployee);
                        //}
                    }
                    var datatable = $("#"+currenttablename).DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayEmployeeList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    $('#employeeListPOPModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Employee does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#addEmployeeModal').modal('toggle');
                            $('#edtEmployeeCompany').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#employeeListPOPModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            sideBarService.getAllEmployeesDataVS1(initialBaseDataLoad, 0).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.temployee.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.temployee[i].fields.SalesOrderBalance) || 0.00;
                    var dataList = {
                        id: data.temployee[i].fields.ID || '',
                        clientName: data.temployee[i].fields.ClientName || '',
                        company: data.temployee[i].fields.Companyname || '',
                        contactname: data.temployee[i].fields.ContactName || '',
                        phone: data.temployee[i].fields.Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: data.temployee[i].fields.Email || '',
                        job: data.temployee[i].fields.JobName || '',
                        accountno: data.temployee[i].fields.AccountNo || '',
                        clientno: data.temployee[i].fields.ClientNo || '',
                        jobtitle: data.temployee[i].fields.JobTitle || '',
                        notes: data.temployee[i].fields.Notes || '',
                        state: data.temployee[i].fields.State || '',
                        country: data.temployee[i].fields.Country || '',
                        street: data.temployee[i].fields.Street || ' ',
                        street2: data.temployee[i].fields.Street2 || ' ',
                        street3: data.temployee[i].fields.Street3 || ' ',
                        suburb: data.temployee[i].fields.Suburb || ' ',
                        postcode: data.temployee[i].fields.Postcode || ' '
                    };

                    dataTableList.push(dataList);
                    let mobile = contactService.changeMobileFormat(data.temployee[i].fields.Mobile);
                    var dataListEmployee = [
                        data.temployee[i].fields.EmployeeName || '-',
                        data.temployee[i].fields.FirstName || '',
                        data.temployee[i].fields.LastName || '',
                        data.temployee[i].fields.Phone || '',
                        mobile || '',
                        data.temployee[i].fields.Email || '',
                        data.temployee[i].fields.DefaultClassName || '',
                        data.temployee[i].fields.Country || '',
                        data.temployee[i].fields.State || '',
                        data.temployee[i].fields.Street2 || '',
                        data.temployee[i].fields.Street || '',
                        data.temployee[i].fields.Postcode || '',
                        data.temployee[i].fields.ID || ''
                    ];
                    splashArrayEmployeeList.push(dataListEmployee);

                    // var employeerecordObj = {
                    //     employeeid: data.temployee[i].fields.ID || ' ',
                    //     firstname: data.temployee[i].fields.FirstName || ' ',
                    //     lastname: data.temployee[i].fields.LastName || ' ',
                    //     employeename: data.temployee[i].fields.ClientName || ' ',
                    //     employeeemail: data.temployee[i].fields.Email || ' ',
                    //     street: data.temployee[i].fields.Street || ' ',
                    //     street2: data.temployee[i].fields.Street2 || ' ',
                    //     street3: data.temployee[i].fields.Street3 || ' ',
                    //     suburb: data.temployee[i].fields.Suburb || ' ',
                    //     statecode: data.temployee[i].fields.State + ' ' + data.temployee[i].fields.Postcode || ' ',
                    //     country: data.temployee[i].fields.Country || ' ',
                    //     termsName: datadata.temployee[i].fields.TermsName || '',
                    //     taxCode: data.temployee[i].fields.TaxCodeName || '',
                    //     clienttypename: data.temployee[i].fields.ClientTypeName || 'Default'
                    // };
                    // clientList.push(employeerecordObj);
                    //}
                }
                var datatable = $("#"+currenttablename).DataTable();
                datatable.clear();
                datatable.rows.add(splashArrayEmployeeList);
                datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');


            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #tblEmployeelist_filter input': function (event) {
      if (event.keyCode == 13) {
         $(".btnRefreshEmployee").trigger("click");
      }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblEmployeelist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function (event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblEmployeelist'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);
        });
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: localStorage.getItem('mycloudLogonID'),
            clouddatabaseID: localStorage.getItem('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'tblEmployeelist'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblEmployeelist',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblEmployeelist',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });
                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('.tblEmployeelist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblEmployeelist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblEmployeelist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");
            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || 0,
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click .exportbtn': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletocsv').click();
        //$('.fullScreenSpin').css('display','none');

    },
    'click .exportbtnExcel': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletoexcel').click();
        //$('.fullScreenSpin').css('display','none');
    },
    'click .printConfirm': function (event) {
        playPrintAudio();
        setTimeout(function(){
        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblEmployeelist_wrapper .dt-buttons .btntabletopdf').click();
        //$('.fullScreenSpin').css('display','none');
    }, delayTimeAfterSound);
    },
    'click .refreshpagelist': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllEmployeesDataVS1(initialBaseDataLoad, 0).then(function (data) {
            addVS1Data('TEmployee', JSON.stringify(data)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function (err) {
            location.reload(true);
        });
    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleEmployee' + '.csv';
        rows[0] = ['Company', 'First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'Skype', 'Street', 'Street2', 'State', 'Post Code', 'Country'];
        rows[1] = ['ABC Company', 'John', 'Smith', '9995551213', '9995551213', 'johnsmith@email.com', 'johnsmith', '123 Main Street', 'Main Street', 'New York', '1234', 'United States'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .btnUploadFile': function (event) {
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault(); //stop the browser from following
        window.location.href = 'sample_imports/SampleEmployee.xlsx';
    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            // Bert.alert('<strong>formats allowed are : '+ validExtensions.join(', ')+'</strong>!', 'danger');
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1
                    });
                    var sCSV = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }

        }



    },
    'click .btnImport': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function (results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "Company") && (results.data[0][1] == "First Name") &&
                        (results.data[0][2] == "Last Name") && (results.data[0][3] == "Phone") &&
                        (results.data[0][4] == "Mobile") && (results.data[0][5] == "Email") &&
                        (results.data[0][6] == "Skype") && (results.data[0][7] == "Street") &&
                        (results.data[0][8] == "Street2") && (results.data[0][9] == "State") &&
                        (results.data[0][10] == "Post Code") && (results.data[0][11] == "Country")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function () {
                            // $('#importModal').modal('toggle');
                            Meteor._reload.reload();
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TEmployee",
                                fields: {
                                    ClientName: results.data[i + 1][0].trim(),
                                    FirstName: results.data[i + 1][1].trim(),
                                    LastName: results.data[i + 1][2],
                                    Phone: results.data[i + 1][3],
                                    Mobile: results.data[i + 1][4],
                                    Email: results.data[i + 1][5],
                                    SkypeName: results.data[i + 1][6],
                                    Street: results.data[i + 1][7],
                                    Street2: results.data[i + 1][8],
                                    State: results.data[i + 1][9],
                                    PostCode: results.data[i + 1][10],
                                    Country: results.data[i + 1][11],

                                    BillStreet: results.data[i + 1][7],
                                    BillStreet2: results.data[i + 1][8],
                                    BillState: results.data[i + 1][9],
                                    BillPostCode: results.data[i + 1][10],
                                    Billcountry: results.data[i + 1][11],
                                    PublishOnVS1: true
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveEmployee(objDetails).then(function (data) {
                                        ////$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        ////$('.fullScreenSpin').css('display','none');
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {

                                            }
                                        });
                                    });
                                }
                            }
                        }

                    } else {
                        //$('.fullScreenSpin').css('display','none');
                        // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                } else {
                    //$('.fullScreenSpin').css('display','none');
                    // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    }

});

Template.employeelistpop.helpers({
    custdatatablerecords: () => {
        return Template.instance().custdatatablerecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: localStorage.getItem('mycloudLogonID'),
            PrefName: 'tblEmployeelist'
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    },
    apiFunction:function() {
        let sideBarService = new SideBarService();
        return sideBarService.getAllTEmployeeList;
    },

    searchAPI: function() {
        return sideBarService.getAllEmployeesDataVS1ByName;
    },

    service: ()=>{
        let sideBarService = new SideBarService();
        return sideBarService;

    },

    datahandler: function () {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    exDataHandler: function() {
        let templateObject = Template.instance();
        return function(data) {
            let dataReturn =  templateObject.getDataTableList(data)
            return dataReturn
        }
    },

    apiParams: function() {
        return ['limitCount', 'limitFrom', 'deleteFilter'];
    },
    tablename: () => {
        let templateObject = Template.instance();
        let selCustID = templateObject.data.custid ? templateObject.data.custid:'';
        return 'tblEmployeelist'+selCustID;
  	}
});
