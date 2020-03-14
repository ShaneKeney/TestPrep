let $examFilter = $('#exam-filter');
let $catFilter = $('#tag-category-filter');
let $groupFilter = $('#tag-group-filter');
let $filter = $('#filter');


$filter.on('click', function(e) {
    e.preventDefault();
    let filterTest = $examFilter.val()
    let filterSection = getChecked('section');
    let filterDiff = getChecked('difficulty');
    let filterTagCat = $catFilter.val();
    let filterTagGroup = $groupFilter.val();

    let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);

    document.location.href = queryString;
})

function getChecked(id) {
    let valArr = [];
    let $sectionFilter = $(`#${id}-filter :checked`);
    $sectionFilter.each(function() {
        valArr.push($(this).val());
    });
    return valArr;
}


function createQueryString(test, section, diff, cat, group){
    let query = '/database?';

    if (test !== "All Tests") {
        query += 'exam=' + test + '&';
    }
    if (cat !== 'All Categories') {
        query += 'tag_category=' + cat + '&';
    }
    if (group !== 'All Groups') {
        query += 'tag_group=' + group + '&';
    }
    if (section.length !== 0) {
        query += arrayToQuery('section', section);
    }
    if (diff.length !== 0) {
        query += arrayToQuery('difficulty', diff);
    }

    queryFix = query.slice(0, query.length -1);
    return queryFix;
}

function arrayToQuery(queryParam, arr) {
    let query = '';
    arr.forEach(item => {
        query += queryParam + '=' + item + '&';
    })
    return query;
}

// let filterTest;
// const sectionArr = [];
// let filterSection;
// const difficultyArr = [];
// let filterDiff;
// let filterTagCat;
// let filterTagGroup;

// $('#exam-filter').on('input', e => {
//     e.preventDefault();
//     filterTest = parseInt($('#exam-filter :selected').attr('data-filter'));
//     filterTest = 'TestId=' + filterTest;
//     let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
//     $('#filter').attr('href', queryFix);
//     // console.log(queryString);
// })

// $('#section-filter input').click(function (e) {
//     let newSection = $(this).attr('id');
//     if ($(this).is(':checked')) {
//         if (sectionArr.indexOf(newSection) === -1) {
//             sectionArr.push(newSection)
//         }
//         ;
//     } else {
//         sectionArr.splice(sectionArr.indexOf(newSection), 1);
//     }
//     if (sectionArr.length > 0) {
//         filterSection = "section=" + JSON.stringify(sectionArr);
//     } else {
//         filterSection = '';
//     }
//     let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
//     $('#filter').attr('href', queryFix);
//     // console.log(queryString);
// })

// $('#difficulty-filter input').click(function (e) {
//     let newDiff = $(this).attr('id');
//     if ($(this).is(':checked')) {
//         difficultyArr.push(newDiff);
//     } else {
//         difficultyArr.splice(difficultyArr.indexOf(newDiff), 1);
//     }
//     if (difficultyArr.length > 0) {
//         filterDiff = "difficulty=" + JSON.stringify(difficultyArr);
//     } else {
//         filterDiff = '';
//     }
//     let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
//     $('#filter').attr('href', queryFix);
//     // console.log(queryString);
// })

// $('#tag-category-filter').on('input', e => {
//     e.preventDefault();
//     filterTagCat = "tag_category="
//     filterTagCat += $('#tag-category-filter :selected').text();
//     let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
//     $('#filter').attr('href', queryFix);
//     // console.log(queryString);
// })

// $('#tag-group-filter').on('input', e => {
//     e.preventDefault();
//     filterTagGroup = "tag_group="
//     filterTagGroup += $('#tag-group-filter :selected').text();
//     let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
//     $('#filter').attr('href', queryFix);
//     // console.log(queryString);
// })

// function createQueryString(test, section, diff, cat, group) {
//     let query = '/database/?';
//     if (test !== undefined) { query += test + '&'; }
//     if (section !== undefined) { query += section + '&'; }
//     if (diff !== undefined) { query += diff + '&'; }
//     if (cat !== undefined) { query += cat + '&'; }
//     if (group !== undefined) { query += group + '&'; }
//     queryFix = query.slice(0, query.length - 1);
//     return queryFix;
// }