$(document).ready(function () {
    "use strict"; // Start of use strict                
    $("#RoleID").change(function () {
        window.location = "/role/right/" + $(this).val();
    });

    $("#Appointment_Role_RoleID").change(function () {
        $.ajax({
            url: "/hospital/patient/GetRoleUsers/" + $(this).val(),
            type: 'GET',
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            success: function (userlist) {
                //alert(userlist);
                $("#Appointment_AssignedUserID option").remove();
                $.each(userlist, function (index, value) {
                    $("#Appointment_AssignedUserID").append('<option value=' + value.UserID + '>' + value.Name + '</option>');
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //$("#message").html('<i class="fa fa-check-circle"></i> ' + result.Message);
                //$("#message").addClass("success-0");
            }
        });

    });

    $("#Role_RoleID").change(function () {
        $.ajax({
            url: "/hospital/patient/GetRoleUsers/" + $(this).val(),
            type: 'GET',
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            success: function (userlist) {
                //alert(userlist);
                $("#AssignedUserID option").remove();
                $.each(userlist, function (index, value) {
                    $("#AssignedUserID").append('<option value=' + value.UserID + '>' + value.Name + '</option>');
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //$("#message").html('<i class="fa fa-check-circle"></i> ' + result.Message);
                //$("#message").addClass("success-0");
            }
        });

    });

    $("#btnAssignBranch").click(function () {
        // alert("Submitted");
        var branch_list ="";
        $("#branchCheckBox").find('.chkBranch').each(function () {
            if ($(this).is(':checked')) {
                branch_list += $(this).val() + ",";                
            }                            
        });
        branch_list = branch_list.replace(/,\s*$/, "");
        //alert(BranchList);
       // return false;
        var BranchModel =
        {
            UserID: $("#hdnuserid").val(),
            BranchList: branch_list
        }

        $.ajax({
            url: "/hospital/branch/AjaxAssignBranchToUser",
            type: 'POST',
            dataType: "JSON",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(BranchModel),
            success: function (result) {
                if (result.IsSuccess == 1) {
                    $("#message").html('<div class="alert alert-sm alert-success alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span></button> <i class="fa fa-check"></i>' +
                        '<strong>Saved!</strong> ' + result.Message + '</div>');     

                    $("#branchCheckBox").find('input[type=checkbox]').each(function () {
                        //$(this).removeAttr('checked');
                        $(this).prop('checked', false);
                    });
                    $('.md-close').trigger('click');
                        //$('#ModalAssignBranch').modal('toggle');
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

        return false;
    });
});



function CheckAll(classname) {

    if ($("." + classname).is(':checked')) {        
        $("#" + classname).find('.chkBranch').each(function () {
            jQuery(this).attr('checked', 'checked');
        });
    }
    else {
        $("#" + classname).find('.chkBranch').each(function () {
            jQuery(this).removeAttr('checked');

        });
    }

}

function btnOpenModelBranch(user_name, user_id) {
    $("#hdnuserid").val(user_id);
    $("#spanusername").text(user_name);
}