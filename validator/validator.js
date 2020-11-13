var clearCpf = require("./functions/clearCpf");
var cpfCountDigit = require("./functions/cpfCountDigit");
var cpfVerifyDigits = require("./functions/cpfVerifyDigits");
var cpfVerifyFirstDigit = require("./functions/cpfVerifyFirstDigit");
var cpfVerifySecondDigit = require("./functions/cpfVerifySecondDigit");

function Validator (cpfParams) {
    var cpf = cpfParams;
    var containerCpfGeneric = ["00000000000", "11111111111", "22222222222", "33333333333", "44444444444", "55555555555", "66666666666", "77777777777", "88888888888", "99999999999"];
    var cpfGeneric = false;
    var error = false;
    var validation = false;

    var cpfClean = clearCpf(cpf);

    if(cpfCountDigit(cpfClean) != 11){
        error = true;
    }

    cpfClean = cpf;

    if(cpfVerifyDigits(cpfClean) != true){
        error = true;
    }

    cpfClean = clearCpf(cpf);

    var fisrtDigit = (cpfVerifyFirstDigit(cpfClean) * 10) % 11;
    var secondDigit = (cpfVerifySecondDigit(cpfClean) * 10) % 11;

    for(let i = 0; i < containerCpfGeneric.length; i++){
        if(cpfClean === containerCpfGeneric[i]){
            cpfGeneric = true;
        }
    }

    if(cpfGeneric === false){
        if(fisrtDigit === parseInt(cpfClean[9])){
            if(secondDigit === parseInt(cpfClean[10])){
                validation = true;

                var response =  {"error": error, "validation": validation};
                return response;
            }else{
                var response =  {"error": error, "validation": validation};
                return response;
            }
        }else{var response =  {"error": error, "validation": validation};
            return response;
        }
    }else{
        var response =  {"error": error, "validation": validation};
        return response;
    }
}

module.exports = Validator;