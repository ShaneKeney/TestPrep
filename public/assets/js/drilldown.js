let filterTest;
const sectionArr = [];
let filterSection;
const difficultyArr = [];
let filterDiff;
let filterTagCat;
let filterTagGroup;

$('#exam-filter').on('input', e => {
    e.preventDefault();
    filterTest = parseInt($('#exam-filter :selected').attr('data-filter'));
    filterTest = 'TestId=' + filterTest;
    let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
    $('#filter').attr('href', queryFix);
    // console.log(queryString);
})

$('#section-filter input').click(function (e) {
    let newSection = $(this).attr('id');
    if ($(this).is(':checked')) {
        if (sectionArr.indexOf(newSection) === -1) {
            sectionArr.push(newSection)
        }
        ;
    } else {
        sectionArr.splice(sectionArr.indexOf(newSection), 1);
    }
    if (sectionArr.length > 0) {
        filterSection = "section=" + JSON.stringify(sectionArr);
    } else {
        filterSection = '';
    }
    let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
    $('#filter').attr('href', queryFix);
    // console.log(queryString);
})

$('#difficulty-filter input').click(function (e) {
    let newDiff = $(this).attr('id');
    if ($(this).is(':checked')) {
        difficultyArr.push(newDiff);
    } else {
        difficultyArr.splice(difficultyArr.indexOf(newDiff), 1);
    }
    if (difficultyArr.length > 0) {
        filterDiff = "difficulty=" + JSON.stringify(difficultyArr);
    } else {
        filterDiff = '';
    }
    let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
    $('#filter').attr('href', queryFix);
    // console.log(queryString);
})

$('#tag-category-filter').on('input', e => {
    e.preventDefault();
    filterTagCat = "tag_category="
    filterTagCat += $('#tag-category-filter :selected').text();
    let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
    $('#filter').attr('href', queryFix);
    // console.log(queryString);
})

$('#tag-group-filter').on('input', e => {
    e.preventDefault();
    filterTagGroup = "tag_group="
    filterTagGroup += $('#tag-group-filter :selected').text();
    let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
    $('#filter').attr('href', queryFix);
    // console.log(queryString);
})

function createQueryString(test, section, diff, cat, group) {
    let query = '/database/?';
    if (test !== undefined) { query += test + '&'; }
    if (section !== undefined) { query += section + '&'; }
    if (diff !== undefined) { query += diff + '&'; }
    if (cat !== undefined) { query += cat + '&'; }
    if (group !== undefined) { query += group + '&'; }
    queryFix = query.slice(0, query.length - 1);
    return queryFix;
}
