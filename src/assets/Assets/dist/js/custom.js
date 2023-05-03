$(document).ready(function () {
    "use strict"; // Start of use strict
    // DateTime Picker start...

    // Create start date
    var start = new Date();
    var startHours = start.getHours();
    var startMinutes = start.getMinutes();


    $('#AppointmentDate, #Appointment_AppointmentDate').datepicker({
        timepicker: true,
        language: 'en',
        startDate: start,
        minDate: new Date(),
        dateFormat: 'yyyy-mm-dd',
        timeFormat: 'hh:ii:00',
        minHours: startHours,
        onSelect: function (fd, d, picker) {
            // Do nothing if selection was cleared            

            // If chosen day is Saturday or Sunday when set
            // hour value for weekends, else restore defaults

        }
    })

    $('#DOB').datepicker({
        language: 'en',
        dateFormat: 'yyyy-mm-dd',
        onSelect: function (fd, d, picker) {
            //alert(fd);
            //alert(d);
            //alert(picker);
            var splitdate = fd.split('-');
            //alert(splitdate);

            var DOB = new Date(splitdate[0], splitdate[1], splitdate[2]);
            $("#Age").val(Date.yearBetween(DOB, start));

        }
    })
    Date.yearBetween = function (date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        //alert(Math.round((difference_ms / one_day))/365);
        // Convert back to days and return
        //$("#Age").val(Math.floor((difference_ms / one_day) / 365));
        return Math.floor((difference_ms / one_day) / 365);

    }
    // DateTime Picker Ends..


    //back to top
    $('body').append('<div id="toTop" class="btn back-top"><span class="ti-arrow-up"></span></div>');
    $(window).on("scroll", function () {
        if ($(this).scrollTop() !== 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    var formAddContent = $("#formAddContent, #formEditContent");
    formAddContent.submit(function (event) {
        if (formAddContent.valid()) {
            var dataString;
            event.preventDefault();
            event.stopImmediatePropagation();
            var action = formAddContent.attr("action");
            // Setting.
            dataString = new FormData(formAddContent.get(0));
            var contentType = false;
            var processData = false;
            $("#btnSave").html('<span class="btn-label"><i class="fa fa-refresh fa-spin"></i></span>Saving...');
            $("#btnSave").attr("disabled", "disabled");
            $.ajax({
                type: "POST",
                url: action,
                data: dataString,
                dataType: "json",
                contentType: contentType,
                processData: processData,
                success: function (result) {
                    // Result.
                    onAjaxRequestSuccess(result);
                },
                complete: function () {                    
                    $("#btnSave").html('<span class="btn-label"><i class="glyphicon glyphicon-ok"></i></span>Save');
                    $("#btnSave").removeAttr("disabled");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //do your own thing
                    $("#message").html('<div class="alert alert-sm alert-danger alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span></button> <i class="fa fa-exclamation-circle"></i>' +
                        '<strong>Error!</strong> ' + result.Message + '</div>');
                }
            });
        }
        //else {
        //    alert("in valid");
        //}
        return false;
    }); //end .submit()

    $("#RoleID").change(function () {
        window.location = "/role/right/" + $(this).val();
    });
    $("#UserID").change(function () {
        window.location = "/Hospital/Branch/AssignBranch/" + $(this).val();
    });

    $(".module-right-list").click(function () {
        var modules = [];
        $.each($("input[name='ModuleID']:checked"), function () {
            modules.push($(this).val());
        });
        $("#ModuleIDList").val(modules.join(","));
        //alert("My favourite sports are: " + favorite.join(","));

       // return false;
    });

    $(".branch-right-list").click(function () {
        var branches = [];
        $.each($("input[name='BranchID']:checked"), function () {
            branches.push($(this).val());
        });
        $("#BranchIDList").val(branches.join(","));
        //alert("My favourite sports are: " + favorite.join(","));

        // return false;
    });
    $("#btnPatientSearch").click(function () {
        $.ajax({
            url: "/hospital/invoice/GetPatientList?search_text=" + $("#search_patient").val().trim(),                       
            //contentType: "application/json;charset=utf-8",            
            success: function (result) {
                var tblHeader = "<thead><tr><th>Select</th><th>Patient Name</th><th>Mobile / Email</th><th>Address</th></tr></thead>";
                var tblRows = "";
                jQuery.each(result, function (i, val) {
                    tblRows += "<tr><td><input type='radio' name='PatientID' value=" + result[i].PatientID + "></td><td>" + result[i].PatientName + "</td><td> (+" + result[i].DialCode + ") " + result[i].Mobile + " <br> " + result[i].EmailID + "</td><td>" + result[i].Address + ", " + result[i].City + " " + result[i].State + " " + result[i].Pincode + "</td>";                    
                    //alert(result[i].PatientName);
                });

                $("#tblinvoicePatient").html(tblHeader + "<tbody>" + tblRows + "</tbody>");
                //alert(JSON.stringify(result));
                //alert(result[0].PatientName);
                //console.log(JSON.stringify(result));
                //$.each(result, function (key, value) {
                //    alert(result.PatientName);
                //    alert(key + ": " + value);
                //});
                //alert(result);
                return false;                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#tblinvoicePatient").html("No Record found");
            }
        });

        return false;
    });

    $("#btnProductSearch").click(function () {
        $.ajax({
            url: "/hospital/invoice/GetProductList?search_text=" + $("#search_product").val().trim(),
            //contentType: "application/json;charset=utf-8",            
            success: function (result) {
                var tblHeader = "<thead><tr><th>Product Name</th><th>Barcode</th><th>Unit Weight</th><th>Unit Price</th><th>Quantity</th></tr></thead>";
                var tblRows = "";
                

                jQuery.each(result, function (i, val) {
                    var QuantityDropDown = "<select name='quantity' class='form-control' style='display:inline;width:60px;' id='product-id-" + result[i].ProductID +"'>";
                    var j;
                    for (j = 1; j <= result[i].Quantity; j++) {
                        QuantityDropDown += "<option value='"+j+"'>"+j+"</option>";
                    }
                    QuantityDropDown += "</select>";
                    tblRows += "<tr><td>" + result[i].ProductName + "</td><td>" + result[i].BarCode + "</td><td>" + result[i].Weight + "</td><td>" + result[i].UnitPrice + "</td><td>" + QuantityDropDown + " <button class='btn btn-labeled btn-success m-b-5' onclick='InvoiceAddProduct(" + result[i].ProductID+")'><span class='btn-label'><i class='glyphicon glyphicon-plus'></i></span></button></td>";

                    //alert(result[i].PatientName);
                });

                $("#tblinvoiceProduct").html(tblHeader + "<tbody>" + tblRows + "</tbody>");
                //alert(JSON.stringify(result));
                //alert(result[0].PatientName);
                //console.log(JSON.stringify(result));
                //$.each(result, function (key, value) {
                //    alert(result.PatientName);
                //    alert(key + ": " + value);
                //});
                //alert(result);
                return false;
                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("#tblinvoiceProduct").html("No Record found");
            }
        });

    });

});

var onAjaxRequestSuccess = function (result) {
    //alert(result.Message);
    if (result.IsSuccess == 1) {
        $("#message").html('<div class="alert alert-sm alert-success alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span></button> <i class="fa fa-check"></i>' +
            '<strong>Saved!</strong> ' + result.Message + '</div>');
        if ($('#formAddContent').length) {
            $('#formAddContent').get(0).reset();
        }        
        if (result.RedirectURL != null) {
            if (result.RedirectURL.trim().length > 0) {
                window.location = result.RedirectURL;
            }
        }
    }
    else {
        $("#message").html('<div class="alert alert-sm alert-danger alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span></button> <i class="fa fa-exclamation-circle"></i>' +
            '<strong>Error!</strong> ' + result.Message + '</div>');
    }

    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
}

function AssignRight(module_id) {
    var role_id = $("#RoleID").val();
    //alert(module_id + '--' + role_id);
    var ModuleRights =
    {
        RoleID: $("#RoleID").val(),
        ModuleID: module_id,
        IsActive: 1
    }

    $.ajax({
        url: "/Ajax/UpdateRoleModule",
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(ModuleRights),
        success: function (result) {
            if (result.IsSuccess == 1) {
                $("#message").html('<div class="alert alert-sm alert-success alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span></button> <i class="fa fa-check"></i>' +
                    '<strong>Saved!</strong> ' + result.Message + '</div>');
                $('#formAddContent').get(0).reset();
            }
            else {
                $("#message").html('<div class="alert alert-sm alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span></button> <i class="fa fa-exclamation-circle"></i>' +
                    '<strong>Error!</strong> ' + result.Message + '</div>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#message").html('<div class="alert alert-sm alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button> <i class="fa fa-exclamation-circle"></i>' +
                '<strong>Error!</strong> ' + result.Message + '</div>');
        }
    });

}

function InvoiceAddProduct(ProductID) {
    
    var InvoiceModel =
    {
        InvoiceID: $("#InvoiceID").val(),
        BranchID: $("#BranchID").val(),
        PatientID: 0,
        Action: "ADDPRODUCT",
        ProductID: ProductID,
        Quantity: $("#product-id-" + ProductID).val(),
        ID: 0,
        PaymentMode: {
            ModeID: 0
        }
    }

    UpdateInvoice(InvoiceModel);

}

function InvoiceUpdateProduct(ID) {

    var InvoiceModel =
    {
        InvoiceID: $("#InvoiceID").val(),
        BranchID: $("#BranchID").val(),
        PatientID: 0,
        Action: "UPDATEPRODUCT",
        ProductID: 0,
        Quantity: $("#update-id-" + ID).val(),
        ID: ID,
        PaymentMode: {
            ModeID: 0
        }
    }

    UpdateInvoice(InvoiceModel);

}

function InvoiceDeleteProduct(ID) {

    var InvoiceModel =
    {
        InvoiceID: $("#InvoiceID").val(),
        BranchID: $("#BranchID").val(),
        PatientID: 0,
        Action: "DELETEPRODUCT",
        ProductID: 0,
        Quantity: $("#update-id-" + ID).val(),
        ID: ID,
        PaymentMode: {
            ModeID: 0
        }
    }
    if (confirm("Are you sure, you want to delete this product!") == true) {
        UpdateInvoice(InvoiceModel);
    }

}

function InvoiceUpdatePatient(PatientID) {

    var InvoiceModel =
    {
        InvoiceID: $("#InvoiceID").val(),
        BranchID: $("#BranchID").val(),
        PatientID: PatientID,
        Action: "UPDATEPATIENT",
        ProductID: 0,
        Quantity: 0,
        ID: ID,
        PaymentMode: {
            ModeID: 0
        }
    }

    UpdateInvoice(InvoiceModel);

}
function InvoicePayment() {

    var InvoiceModel =
    {
        InvoiceID: $("#InvoiceID").val(),
        BranchID: $("#BranchID").val(),
        PatientID: 0,
        Action: "MAKEPAYMENT",
        ProductID: 0,
        Quantity: 0,
        ID: 0,
        Remarks: $("#Remarks").val(),
        PaymentMode: {
            ModeID: $("#PaymentMode_ModeID").val()
        }

    }
    if (confirm("Once the invoice is generated, then it cannot be updated again!") == true) {
        UpdateInvoice(InvoiceModel);
    }
}
function UpdateInvoice(InvoiceModel) {

    $.ajax({
        url: "/hospital/invoice/edit",
        type: 'POST',
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(InvoiceModel),
        success: function (result) {
            if (result.IsSuccess == 1) {
                $("#message").html('<div class="alert alert-sm alert-success alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span></button> <i class="fa fa-check"></i>' +
                    '<strong>Saved!</strong> ' + result.Message + '</div>');
                if (result.RedirectURL.trim().length > 0) {
                    window.location = result.RedirectURL;
                }
            }
            else {
                $("#message").html('<div class="alert alert-sm alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span></button> <i class="fa fa-exclamation-circle"></i>' +
                    '<strong>Error!</strong> ' + result.Message + '</div>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $("#message").html('<div class="alert alert-sm alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button> <i class="fa fa-exclamation-circle"></i>' +
                '<strong>Error!</strong> ' + result.Message + '</div>');
        }
    });

}

