// custom helper functions to extend OOB functionality of Handlebars
module.exports = {
    toUpperCase: str=> {
        return str.toUpperCase();
    },
    ifEquals: (str1,str2,options) => {
        return str1 === str2 ? options.fn(this) : options.inverse(this);
    },
    ifNotEqual: (str1,str2,options)=>{
        return str1 !== str2 ? options.fn(this) : options.inverse(this);
    }
};