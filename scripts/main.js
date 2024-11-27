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
            result = bigDecimal.divide(num1, num2, 10);
            break;
    }
    result = bigDecimal.round(result, 10, bigDecimal.RoundingModes.HALF_UP);
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

function setIntResult(result) {
    let round_mode = $('input[name="roundingMode"]:checked').attr('id');
    if (round_mode === "roundingMode1") {  // математическое
        result = bigDecimal.round(result, 0, bigDecimal.RoundingModes.HALF_UP);
    } else if (round_mode === "roundingMode2") {  // банковское
        result = bigDecimal.round(result, 0, bigDecimal.RoundingModes.HALF_EVEN);
    } else {  // усечение
        result = bigDecimal.round(result, 0, bigDecimal.RoundingModes.DOWN);
    }
    result = bigDecimal.getPrettyValue(result, 3, " ");
    console.log('inner result integer ' + result);
    result = stripTrailingZero(result);
    return result;
}

function checkDivision(op, to_num) {
    if (op === 'division' && bigDecimal.compareTo(to_num, '0') === 0) {
        $('#division_by_zero').show();
        $('#result_input').val('');
        return true;
    } else {
        $('#division_by_zero').hide();
        return false
    }
}

$(document).ready(function() {
    $('#first_number_input, #second_number_input, #third_number_input, #fourth_number_input, ' +
            'input[name="operation1"], input[name="operation2"], input[name="operation3"], input[name="roundingMode"], #rounding').on('input',  function() {
        console.log('change');
        let op1 = $('input[name="operation1"]:checked').attr('id').slice(0, -1);
        let op2 = $('input[name="operation2"]:checked').attr('id').slice(0, -1);
        let op3 = $('input[name="operation3"]:checked').attr('id').slice(0, -1);
        console.log(`operation 1: ${op1}`);
        console.log(`operation 2: ${op2}`);
        console.log(`operation 3: ${op3}`);

        let num1 = $('#first_number_input').val().replace(',', '.');
        let num2 = $('#second_number_input').val().replace(',', '.');
        let num3 = $('#third_number_input').val().replace(',', '.');
        let num4 = $('#fourth_number_input').val().replace(',', '.');
        console.log(`num1: ${num1}, num2: ${num2}, num3: ${num3}, num4: ${num4}`);

        if (!num1 || !num2 || !num3 || !num4 || !op1 || !op2 || !op3) {
            $('#error_message').show();
            $('#result_input').val('');
            return;
        } else {
            $('#error_message').hide();
        }

        let regex = /^-?(\d ?)*\d(\.(\d ?)*\d)?$/;
        if (!regex.test(num1) || !regex.test(num2) || !regex.test(num3) || !regex.test(num4)) {
            $('#error_message').show();
            $('#result_input').val('');
            return;
        } else {
            $('#error_message').hide();
        }

        num1 = num1.replaceAll(' ', '');
        num2 = num2.replaceAll(' ', '');
        num3 = num3.replaceAll(' ', '');
        num4 = num4.replaceAll(' ', '');

        if (checkDivision(op2, num2)) return;

        let result = calculate(num2, num3, op2);
        if ((op3 === 'multiplication' || op3 === 'division')
            &&(op1 === 'addition' || op1 === 'subtraction')) {
            result = calculate(result, num4, op3);
            if (checkDivision(op3, num4)) return;
            result = calculate(num1, result, op1);
            if (checkDivision(op1, result)) return;
        } else {
            result = calculate(num1, result, op1);
            if (checkDivision(op1, result)) return;
            result = calculate(result, num4, op3);
            if (checkDivision(op3, num4)) return;
        }
        console.log(`result: ${result}`);
        let result_norm = normalizeResult(result);
        console.log(`normalized result: ${result_norm}`);
        $('#result_input').val(result_norm);

        let result_int = setIntResult(result);
        console.log(`int result: ${result_int}`);
        $('#result_int_input').val(result_int);
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
