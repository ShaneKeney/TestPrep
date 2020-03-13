let filterTest;
let filterSection = 'section=reading';
let filterDiff;
let filterTagCat = 'tag_category=Heart of Algebra';
let filterTagGroup;

let queryString = createQueryString(filterTest, filterSection, filterDiff, filterTagCat, filterTagGroup);
console.log(queryString);

function createQueryString(test, section, diff, cat, group){
    let query = '/?';
    if ( test !== undefined )       { query += test + '&'; }
    if ( section !== undefined )    { query += section + '&'; }
    if ( diff !== undefined )       { query += diff + '&'; }
    if ( cat !== undefined )        { query += cat + '&'; }
    if ( group !== undefined )      { query += group + '&'; }
    queryFix = query.slice(0, query.length -1);
    return queryFix;
}