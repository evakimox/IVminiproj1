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
    result = Object.keys(result).map(key => result[key]);
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
    let result = data.reduce(
        (result, d) => {
            let countryName = d['recipient'];
            let purposeCode = d['coalesced_purpose_code'];

            let shouldCreateNewEntry = false;
            if(result[countryName] === undefined){
                result[countryName] = [];
                shouldCreateNewEntry = true;
            }
            else {
                if(result[countryName][purposeCode] === undefined){
                    shouldCreateNewEntry = true
                }
            }
            if(shouldCreateNewEntry){
                result[countryName][purposeCode] = {
                    "country": d['recipient'],
                    "amount": parseInt(d['commitment_amount_usd_constant']),
                    "purposeName": d['coalesced_purpose_name'],
                    "purposeCode": d['coalesced_purpose_code'],
                }
            }
            else {
                let currentData = result[countryName][purposeCode];
                let prevAmt = currentData.amount;
                let newAmt = parseInt(d['commitment_amount_usd_constant']);
                let sum = prevAmt + newAmt;
                currentData.amount = sum;
                result[countryName][purposeCode] = currentData;
            }
            return result;
        }, {}
    );
    return result;
}