import { MenuItem } from '@material-ui/core'

export const optionsHelper = { 
    
    CUSTOM_OPTION: "CUSTOM_OPTION",

    optsCourses: {
        "BCC":     "Ciências da Computação",
        "BSI":     "Sistemas de Informação",
        "ENGCOMP": "Engenharia da Computação",
        "NENHUM":  "Nenhum",
        "CUSTOM_OPTION": "Outro curso",
    },

    optsInstitutions: {
        "USP/ICMC": "USP - ICMC",
        "USP/EESC": "USP - EESC",
        "USP/IFSC": "USP - IFSC",
        "USP/IQSC": "USP - IQSC",
        "UFSCAR":   "UFSCAR",
        "NENHUMA":  "Nenhuma",
        "CUSTOM_OPTION": "Outra instituição",
    },
    
    getDefaultOption: (options) => Object.keys(options)[0],

    isPredefinedOption: (value, options) => Object.keys(options).find((key) => key === value),

    isCustomOption: (value) => value === "CUSTOM_OPTION",

    renderOptions: (options) => Object.keys(options).map((key,index) => <MenuItem key={key} value={key}>{options[key]}</MenuItem>)
}
