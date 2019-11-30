var Categories = [];

// fetch categories from database
function LoadCategory(element) {
    if (Categories.length == 0) {
        // ajax function to fetch data
        $.ajax({
            typ: "GET",
            url: '/home/getProductCategory',
            success: function (data) {
                Categories = data;

                // render categories
                renderCategory(element);
            }
        })
    }
    else {
        // render category to the element
        renderCategory(element);
    }
}

function renderCategory(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select Category'));
    $.each(Categories, function (i, val) {
        $ele.append($('<option/>').val(val.CategoryID).text(val.CategoryName));
    })
}

// fetch products
function LoadProducts(categoryDD) {
    $.ajax({
        type: "GET",
        url: "/home/getProducts",
        data: { 'categoryID': $(categoryDD).val() },
        success: function (data) {
            // render products to appropriate dropdown

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function renderProduct(element, data) {
    // render product
    var $ele = $(element);
    $ele.empty();
    $ele.append('<option/>').val('0').text('Select Product');
    $.each(data, function (i, val) {
        $ele.append($('<option/>').val(val.ProductID).text(val.ProductName);
    });
}

$(document).ready(function () {

    // add button click event
    $('#add').click(function () {
        // validate and add order item
        var isValid = true;

        // product category
        if ($('#productCategory').val() == 0) {
            isValid = false;
            $('#productCategory').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#productCategory').siblings('span.error').css('visibility', 'hidden');
        }

        // product
        if ($('#product').val() == 0) {
            isValid = false;
            $('#product').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#product').siblings('span.error').css('visibility', 'hidden');
        }

        // quantity
        if (!($('#quantity').val().trim() != '' && (parseInt($('#quantity').val()) || 0))) {
            isValid = false;
            $('#quantity').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity').siblings('span.error').css('visibility', 'hidden');
        }

        // rate
        if (!($('#rate').val().trim() != '' && !isNaN($('#rate').val().trim()))) {
            isValid = false;
            $('#rate').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#rate').siblings('span.error').css('visibility', 'hidden');
        }

        // form state
        if (isValid) {
            var $newRow = $('#mainRow').clone().removeAttr('id');
            $('.pc', $newRow).val($('#productCategory').val());
            $('.product', $newRow).val($('#product').val());

            // replace add button with remove
            $('#add', $newRow).addClass('remove').val('Remove').removeClass('btn-success').addClass('btn-danger');

            // remove id from new clone row
            $('#productCategory.#product.#quantity.#rate', $newRow).removeAttr('id');
            $('span.error', $newRow).remove();

            // append clone row
            $('#orderItems').append($newRow);

            // clear select data
            $('#productCategory, #product').val('0');
            $('#quantity, #rate').val('');
            $('#orderItemError').empty();
        }
    });

    // remove button click event
    $('#orderItems').on('click', '.remove', function () {
        $(this).parent('tr').remove();
    });

    $('#submit').click(function () {
        var isValid = true;

        // validate order items
        $('#orderItemError').text('');
        var list = [];
        var errorItemCount = [];
        $('#orderItems tbody tr').each(function (index, ele) {
            if ($('select.product', this).val() == "0" || (parseInt($('.quantity', this).val()) || 0) == 0 ||
                $('#rate', this).val() == "" ||
                isNaN($('#rate', this).va())
            ) {
                errorItemCount++;
                $(this).addClass('error');
            }
            else {
                var orderItems = {
                    ProductID = $('select.product', this).val(),
                    Quantity = parseInt($('.quantity', this).val()),
                    Rate: parseFloat($('.rate', this).val())
                }
                list.push(orderItems);
            }
        });

        if (errorItemCount > 0) {
            $('#orderItemError').text(errorItemCount + "invalid entry in order item list.");
            isValid = false;
        }

        if (list.length == 0) {
            $('#orderItemError').text('At least 1 order item is required.');

        }

        if ($('#orderNo').val().trim() == '') {
            $('#orderNo').siblings('span.error').css('visibility', 'visible');
            isValid = false;
        }
        else {
            $('#orderNo').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#orderDate').val().trim() == '') {
            $('#orderDate').siblings('span.error').css('visibility', 'visible');
            isValid = false;
        }
        else {
            $('#orderDate').siblings('span.error').css('visibility', 'hidden');
        }

        if (isValid) {
            var data = {
                OrderNo: $('#orderNo').val().trim(),
                OrderDateString: $('#orderDate').val().trim(),
                Description: $('#description').val().trim(),
                OrderDetails: list
            }

            $(this).val('Please wait...');
            $.ajax({
                type: 'POST',
                url: '/home/save',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    if (data.status) {
                        alert('Successfully saved');

                        // reset controls
                        list = [];
                        $('#orderNo,#orderDate,#description').val('');
                        $('#orderItems').empty();
                    }
                    else {
                        alert('Error');
                    }
                    $('#submit').text('Save');
                },
                error: function (error) {
                    console.log(error);
                    $('#submit').text('Save');
                }
            });
        }
    });
});

LoadCategory($('#productCategory'));