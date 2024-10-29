function calculate(num1, num2, op) {
    let result = 0;
    switch (op) {
        case 'addition':
            result = bigDecimal.add(num1, num2);
            break;
        case 'subtraction':
            result = bigDecimal.subtract(num1, num2);
            break;
        case 'multiplication':
            result = bigDecimal.multiply(num1, num2);
            break;
        case 'division':
            result = bigDecimal.divide(num1, num2);
            break;
    }
    return result;
}


$(document).ready(function() {
    $('#first_number_input, #second_number_input, input[name="operation"]').on('input', function() {
        console.log('change');
        let op = $('input[name="operation"]:checked').attr('id');
        console.log(`operation: ${op}`);

        let num1 = $('#first_number_input').val().replace(',', '.');
        let num2 = $('#second_number_input').val().replace(',', '.');
        console.log(`num1: ${num1}, num2: ${num2}`);

        if (isNaN(num1) || isNaN(num2) || !op) {
            $('#error_message').show();
            return;
        } else {
            $('#error_message').hide();
        }

        let regex = /^-?\d+(\.\d+)?$/;
        if (!regex.test(num1) || !regex.test(num2)) {
            $('#error_message').show();
            return;
        } else {
            $('#error_message').hide();
        }

        let result = calculate(num1, num2, op);
        console.log(`result: ${result}`);
        $('#result_input').val(result);
    });
});
