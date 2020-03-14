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