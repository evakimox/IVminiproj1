// check if a string is null or empty
function isEmpty(string) {
    if (string === null || string === undefined) {
        return true;
    }
    return string.trim() === "";
}


// aggregate data by sum number together
function groupByCountry(data, asWho) {
    let result = data.reduce(
        (result, d) => {
            let role = 'donor';
            if (asWho === 'd') {
                // aggregate as donor
            }
            if (asWho === 'r') {
                // aggregate as receiver
                role = 'recipient';
            }

            if (result[d[role]] === undefined) {
                result[d[role]] = {
                    "country": d[role],
                    "amount": parseInt(d.commitment_amount_usd_constant)
                }
            } else {
                let currentData = result[d[role]];
                let prevAmt = currentData.amount;
                let newAmt = parseInt(d.commitment_amount_usd_constant);
                let sum = prevAmt + newAmt;
                currentData.amount = sum;
                result[d[role]] = currentData;
            }
            return result;
        }, {}
    );
    return result;
}


function groupByCountryMapped(data, asWho) {
    let result = data.reduce(
        (result, d) => {
            let role = 'donor';
            if (asWho === 'd') {
                // aggregate as donor
            }
            if (asWho === 'r') {
                // aggregate as receiver
                role = 'recipient';
            }

            if (result[d[role]] === undefined) {
                result[d[role]] = {
                    "country": d[role],
                    "amount": parseInt(d.commitment_amount_usd_constant)
                }
            } else {
                let currentData = result[d[role]];
                let prevAmt = currentData.amount;
                let newAmt = parseInt(d.commitment_amount_usd_constant);
                let sum = prevAmt + newAmt;
                currentData.amount = sum;
                result[d[role]] = currentData;
            }
            return result;
        }, {}
    );
    return result;
}

function groupByPurpose(data) {
    let resultMap = new Map();
    for(let i = 0; i < data.length; i++){
        let current = data[i];
        let purpose = current.coalesced_purpose_code;
        let amount = current.commitment_amount_usd_constant;
        if(resultMap[purpose] === undefined){
            resultMap[purpose] = parseInt(amount);
        }
        else {
            let currentRes = resultMap[purpose] + parseInt(amount);
            resultMap[purpose] = currentRes;
        }
    }
    let result = [];
    for(let currentKey in resultMap){
        let singleton = new Map();
        singleton['purpose'] = currentKey;
        singleton['value'] = resultMap[currentKey];
        result.push(singleton);
    }
    result.sort(function (a, b) {
        let keyA = a.value;
        let keyB = b.value;
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
    })

    return result;
}

function extractPurpose(data, purposeCode){
    let filteredData = new Map();
    for(let i = 0; i < data.length; i++){
        if(data[i]['coalesced_purpose_code'] === purposeCode){
            let countryName = data[i]['recipient'];
            let amount = parseInt(data[i]['commitment_amount_usd_constant']);
            let purposeName = data[i]['coalesced_purpose_name'];
            if(filteredData[countryName] === undefined){
                filteredData["purposeName"] = purposeName;
                filteredData[countryName] = {
                    "country": countryName,
                    "amount":amount,
                    "purposeName":purposeName
                }
            }
            else {
                let current = filteredData[countryName];
                current.amount = filteredData[countryName].amount + amount;
                filteredData[countryName] = current;
            }
        }
    }
    return filteredData;
}
