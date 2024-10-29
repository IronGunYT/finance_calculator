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
            result = bigDecimal.divide(num1, num2, 6);
            break;
    }
    return result;
}

function normalizeResult(result) {
    if ($('#rounding').is(':checked')) {
        result = bigDecimal.round(result, 6, bigDecimal.RoundingModes.HALF_UP);
    }
    result = bigDecimal.getPrettyValue(result, 3, " ");
    console.log('inner result ' + result);
    result = stripTrailingZero(result);
    return result;
}

$(document).ready(function() {
    $('#first_number_input, #second_number_input, input[name="operation"], #rounding').on('input', function() {
        console.log('change');
        let op = $('input[name="operation"]:checked').attr('id');
        console.log(`operation: ${op}`);

        let num1 = $('#first_number_input').val().replace(',', '.');
        let num2 = $('#second_number_input').val().replace(',', '.');
        console.log(`num1: ${num1}, num2: ${num2}`);

        if (!num1 || !num2 || !op) {
            $('#error_message').show();
            $('#result_input').val('');
            return;
        } else {
            $('#error_message').hide();
        }

        let regex = /^-?(\d ?)*\d(\.(\d ?)*\d)?$/;
        if (!regex.test(num1) || !regex.test(num2)) {
            $('#error_message').show();
            $('#result_input').val('');
            return;
        } else {
            $('#error_message').hide();
        }

        num1 = num1.replaceAll(' ', '');
        num2 = num2.replaceAll(' ', '');

        if (op === 'division' && bigDecimal.compareTo(num2, '0') === 0) {
            $('#division_by_zero').show();
            $('#result_input').val('');
            return;
        } else {
            $('#division_by_zero').hide();
        }

        let result = calculate(num1, num2, op);
        console.log(`result: ${result}`);
        result = normalizeResult(result);
        console.log(`normalized result: ${result}`);
        $('#result_input').val(result);
    });
});

// backport from https://github.com/royNiladri/js-big-decimal/blob/master/src/stripTrailingZero.ts
function stripTrailingZero(number) {
    const isNegative = number[0] === '-';
    if (isNegative) {
        number = number.substr(1);
    }
    while (number[0] == '0') {
        number = number.substr(1);
    }
    if (number.indexOf('.') != -1) {
        while (number[number.length - 1] == '0') {
            number = number.substr(0, number.length - 1);
        }
    }
    if (number == "" || number == ".") {
        number = '0';
    } else if (number[number.length - 1] == '.') {
        number = number.substr(0, number.length - 1);
    }
    if (number[0] == '.') {
        number = '0' + number;
    }
    if (isNegative && number != '0') {
        number = '-' + number;
    }
    return number;
}
