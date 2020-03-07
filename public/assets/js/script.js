const numArr = [0, '.', '/', 1, 2, 3, 4, 5, 6, 7, 8, 9];

$(() => {
    const numChoices = $('.number-choices');

    for (let i = 0; i < 4; i++) {
        const colEl = $('<div class="col-auto">');
        const selEl = $('<select class="form-control">');
        
        numArr.forEach(item => {
            const optionEl = $('<option>');
            $(optionEl).text(item);
            $(selEl).append(optionEl);
        });

        $(colEl).append(selEl);
        $(numChoices).append(colEl);
    }
});