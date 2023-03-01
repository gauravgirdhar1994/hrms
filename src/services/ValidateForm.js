export function ValidateForm(fields, valuesArray) {
        let returnData = {};
        returnData.validations = [];
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let isFormValid = true;
            
        fields.map((data, key) => {
            if(data !== null && data.required){
                if (
                    valuesArray[data.fieldName] == "" ||
                    typeof valuesArray[data.fieldName] == "undefined"
                  ) {
                    returnData.validations[data.fieldName] = "Please enter "+data.fieldTitle;
                    returnData.isFormValid = false;
                  }
            }
        })
        
        return returnData;
}