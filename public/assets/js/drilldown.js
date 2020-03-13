let filterTest;
let filterSection;
let filterDiff;
let filterTagCat;
let filterTagGroup;

let queryString = createQueryString(ARGS...);

function createQueryString(test, section, diff, cat, group){
    
    let queryString;
    
    if (test !== undefined){
        queryString += test;
    }

    if (section !== undefined){
        queryString += section
    }

    if (diff !== undefined){
        queryString += diff
    }

    if (cat !== undefined){
        queryString += cat
    }

    if (group !== undefined){
        queryString += group
    }

    return queryString;
}
