function append_pitch_static_data(data) {

    if (typeof DynamicPitch_SetStringAndWrite == 'function') {
        data = DynamicPitch_SetStringAndWrite(data);
    }

    append_pitch_custom_data(data);
    var static_data = {

    };
    $.extend(true, data, static_data); //merge static object
    //console.log(static_data);
    //return static_data;
}

function append_pitch_custom_data(data) {
    var dataToFilterName = null;
    var customData = {};
    $("*[filterfield]").each(function () {
        var filterfieldAttributeValue = $(this).attr("filterfield");
        var dataAttributeValue = $(this).attr("data");
        var removeFilter = dataAttributeValue.search("_" + filterfieldAttributeValue);

        if ((filterfieldAttributeValue == null) || (dataAttributeValue == null) || (removeFilter == null)) {
            return null;
        }

        dataToFilterName = dataAttributeValue.substring(0, removeFilter);
        //If we extend below, and the following 2 lines, then we need to set the original data to null.  Or we can simply set the Data value to the GetFilteredData
        data[dataAttributeValue] = null;
        customData[dataAttributeValue] = GetFilteredData(dataToFilterName, data, filterfieldAttributeValue);
    });

    //We can choose to extend, or simply set the original data object and skip this step.
    $.extend(true, data, customData); //merge dataobjects

    //console.log("customData=", customData);
    //console.log("data=", data);
}

function GetFilteredData(dataToFilterName, data, filterByPropertyName) {
    var filteredDate = null;
    var dataToFilter = eval_with_this(dataToFilterName, data);

    if (dataToFilter == null || !$.isArray(dataToFilter)) {
        return null;
    }

    var unqData = uniqueBy(dataToFilter, function (x) { return x[filterByPropertyName] });
    filteredDate = unqData.map(function (x) {

        if (x[filterByPropertyName] == null) {
            return null;
        }

        var unq = new Object();
        unq.Value = x[filterByPropertyName];
        unq.Display = x[filterByPropertyName];
        return unq;
    });

    return filteredDate;
}

function uniqueBy(arr, fn) {
    var unique = {};
    var distinct = [];
    arr.forEach(function (x) {
        var key = fn(x);
        if (!unique[key]) {
            distinct.push(x);
            unique[key] = 1;
        }
    });
    return distinct;
}
