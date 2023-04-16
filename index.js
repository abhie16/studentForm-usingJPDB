var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIML = '/api/iml';
var jpdbIRL = '/api/irl';
var stDBName = 'SCHOOL-DB';
var stRelationName = "STUDENT-TABLE";
var connToken = '90932805|-31949279036971385|90948121';

$('#stid').focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}


function getStIdAsJsonObj(){
    var stid = $('#stid').val();
    var jsonStr = {
        id: stid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);

    var record = JSON.parse(jsonObj.data).record;
    

    $('#stname').val(record.name);
    $('#stclass').val(record.class);
    $('#dob').val(record.dob);
    $('#add').val(record.address);
    $('#stenrl').val(record.enrollment);

}

function getst(){
    var stIdJsonObj = getStIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stDBName, stRelationName, stIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});

    if(resJsonObj.status === 400){
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stname').focus();
    }
    else if(resJsonObj.status === 200){
        $('#stid').prop('disabled', true);
        fillData(resJsonObj);

        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stname').focus();

    }
}

function resetForm(){
    $('#stid').val("");
    $('#stname').val("");
    $('#stclass').val("");
    $('#dob').val("");
    $('#add').val("");
    $('#stenrl').val("");
    $('#stid').prop("disabled",false);
    $('#save').prop("disabled",true);
    $('#change').prop("disabled",true);
    $('#reset').prop("disabled",true);
    $('#stid').focus();
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === "") {
        return "";
    }

    var putRequest = createPUTRequest(connToken, jsonStrObj, stDBName, stRelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    resetForm();
    $('#stid').focus();

}

function changeData(){
    $('#change').prop('disabled',true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,stDBName,stRelationName,localStorage.getItem('recno'));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $('#stid').focus();
}

function validateData() {  
    var stid, stname, stclass, dob, add, stenrl;
    stid = $('#stid').val();
    stname = $('#stname').val();
    stclass = $('#stclass').val();
    dob = $('#dob').val();
    add = $('#add').val();
    stenrl = $('#stenrl').val();

    if(stid === ''){
        alert("Student roll no missing")
        $('#stid').focus();
        return "";
    }
    if(stname === ''){
        alert("Student Name missing")
        $('#stname').focus();
        return "";
    }
    if(stclass === ''){
        alert("Student class missing")
        $('#stclass').focus();
        return "";
    }
    if(dob === ''){
        alert("DOB missing")
        $('#dob').focus();
        return "";
    }
    if(add === ''){
        alert("Address missing")
        $('#add').focus();
        return "";
    }
    if(stenrl === ''){
        alert("Enrollment date missing")
        $('#stenrl').focus();
        return "";
    }

    var jsonStrObj = {
        id: stid,
        name: stname,
        class: stclass,
        dob: dob,
        address:add,
        enrollment: stenrl

    };

    return JSON.stringify(jsonStrObj);
}

