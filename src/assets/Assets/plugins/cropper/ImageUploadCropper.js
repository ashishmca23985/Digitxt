$('#jcrop_target').cropper({   
    aspectRatio: 1 / 1,
    minContainerWidth: 100,
    minContainerHeight: 100,
    //minwidth:365,
    zoomOnWheel: false,
    crop: function (e) {
        // Output the result data for cropping image.
        //console.log(e.x);
        //console.log(e.y);
        //console.log(e.width);
        //console.log(e.height);
        //console.log(e.rotate);
        //console.log(e.scaleX);
        //console.log(e.scaleY);

        $('#hdn_x').val(e.x);
        $('#hdn_y').val(e.y);
        $('#hdn_x2').val(e.scaleX);
        $('#hdn_y2').val(e.scaleY);
        $('#hdn_w').val(e.width);
        $('#hdn_h').val(e.height);
    }    
});

function ImageUpload(ImageFieldID) {
    //alert(ImageFieldID);
    // validation...
    var formdata = new FormData(); //FormData object
    var fileInput = document.getElementById(ImageFieldID);

    if (parseInt((fileInput.files[0].size / 1024 / 1024)) > 5) {
        alert("Maximum file Size can be not more than 5 MB.");
        return false;
    }

    var fileExt = getFileExtension(fileInput.files[0].name);
    fileExt = fileExt.toLowerCase();
    if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'png' || fileExt == 'gif') {
        //Iterating through each files selected in fileInput
        for (i = 0; i < fileInput.files.length; i++) {
            //Appending each file to FormData object
            formdata.append(fileInput.files[i].name, fileInput.files[i]);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/fileUpload/ImageUpload');
        xhr.send(formdata);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // alert(xhr.data);

                $('#jcrop_target').cropper('replace', xhr.responseText.replace('"', '').replace('"', ''));
            }
        }
    } else {
        $('#' + ImageFieldID).val("");
        alert("Invalid Image! Please upload jpg, jpeg, png or gif image.");
    }

    return false;
}

function cropImage() {

    var imageCropWidth = parseInt(Math.ceil($("#hdn_w").val()));
    var imageCropHeight = parseInt(Math.ceil($("#hdn_h").val()));
    var cropPointX = parseInt(Math.ceil($("#hdn_x").val()));
    var cropPointY = parseInt(Math.ceil($("#hdn_y").val()));
    //alert(imageCropWidth);
    if (imageCropWidth <= 100) {
        //alert("Small image size! Please select big cropping area.");
        $("#MsgImageUpload").text("Small Image size! Please select big cropping area.");
        $("#MsgImageUpload").addClass("alert-danger");
        $("#MsgImageUpload").removeClass("alert-success");        
        return;
    }

    //var imageCropWidth = 0;
    //var imageCropHeight = 0;
    //var cropPointX = 0;
    //var cropPointY = 0;

    $.ajax({
        url: '/fileUpload/CropImage',
        type: 'POST',
        async: false,
        data: {
            imagePath: $("#jcrop_target").attr("src"),
            cropPointX: cropPointX,
            cropPointY: cropPointY,
            imageCropWidth: imageCropWidth,
            imageCropHeight: imageCropHeight
        },
        success: function (Imagedata) {
            //alert(Imagedata);
            //alert(Imagedata.image_url);
            // Save Image starts..
            $.ajax({
                url: '/ajax/UpdateClientImage',
                type: 'POST',
                data: {
                    ImageURL: Imagedata.filename
                },
                success: function (ImagedataSave) {
                    //alert(ImagedataSave);
                    if (ImagedataSave == true) {
                        //alert(Imagedata.image_url);
                        $("#imgProfilePic").attr("src", "/upload/" + Imagedata.filename);
                        $("#jcrop_target").attr("src", "/upload/" + Imagedata.filename);                        
                        $("#MsgImageUpload").text("Image uploaded successfully!");
                        $("#MsgImageUpload").addClass("alert-success");
                        $("#MsgImageUpload").removeClass("alert-danger");                        
                    }
                    else {
                        $("#MsgImageUpload").text("Error occured in Image uploading.");
                        $("#MsgImageUpload").addClass("alert-danger");
                        $("#MsgImageUpload").removeClass("alert-success");
                    }
                },
                error: function (ImagedataSave) {
                    $("#MsgImageUpload").text("Error occured in Image uploading.");
                    $("#MsgImageUpload").addClass("alert-danger");
                    $("#MsgImageUpload").removeClass("alert-success");
                }
            });
            // Save Image ends..
        },
        error: function (data) { }
    });    
}

function getFileExtension(filename) {
    return filename.split('.').pop();
}