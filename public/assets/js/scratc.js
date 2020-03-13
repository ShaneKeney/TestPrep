let Slash = new RegExp('\/', 'g');
let Numerator = new RegExp('[0-9]{1,2}(?=\/)', 'g');
let Denominator = new RegExp('[0-9]{1,2}(?!\/)$', 'g');
let str = '12/4';
let num = Numerator.exec(str);
let denom = Denominator.exec(str);
let numInt = parseInt(num[0]);
let denomInt = parseInt(denom[0]);
let ans = numInt / denomInt
//console.log(Slash.test(str));
//console.log(numInt);
//console.log(denomInt);
//console.log(ans);
//console.log(ans.toFixed(3));       

giArr.forEach(num => {
    if (num.match){}
});


$collectButton.on('click', function (e) {
    e.preventDefault();
    let ansStr = $('.mc-body').find('.mc-answer').text();
    let giRows = $('.mc-body').find('.gi-answer');
    let giArr = [];
    for (i = 0; i < giRows.length; i++) {
        giArr.push(giRows[i].textContent)
    }
    let ansArr = ansStr.split('');
    allAnswersArr = ansArr.concat(giArr);
    //console.log(allAnswersArr);
    let id = $mcTable.data('test-id');
    let section = $mcTable.data('test-section');
    let data = [];
    allAnswersArr.forEach((value, index) => {
        let obj = {
            'StudentId': 1,
            'TestId': id,
            'section': section,
            'question_number': index + 1,
            'answer_response': value,
        };
        data.push(obj);
    });
    //console.log(data);

});

function collectGridInAnswers (rows) {
    let outputArr = []
    for (i = 0; i < giRows.length; i++) {
        outputArr.push(giRows[i].textContent)
    }
    return outputArr;
}  

function fractionToDecimal(array) {
    let outputArr = [];
    array.forEach(num => {

        if (Slash.test(num)) {
            let numerator = Numerator.exec(num);
            let denominator = Denominator.exec(num);
            let numInt = parseInt(numerator[0]);
            let denomInt = parseInt(denominator[0]);
            let ans = numInt / denomInt
            outputArr.push(Math.round(1000*ans)/1000);
        } else {
            outputArr.push(num);
        }        
    });
    return outputArr;
};