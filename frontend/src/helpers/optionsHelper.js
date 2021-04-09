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

    optsRoles: { 
        "0":  "Root",
        "11": "Coordenador Geral",
        "12": "Vice Coordenador Geral",
        "23": "Coordenador de Estudos",
        "21": "Coordenador de Recursos Humanos",
        "22": "Secretário",
        "60": "Membro",
        "80": "Colaborador",
        "100": "Ingressante",
        "120": "Aprovação Pendente",
    },
    
    getDefaultOption: (options) => Object.keys(options)[0],

    isPredefinedOption: (value, options) => Object.keys(options).find((key) => key === value),

    isCustomOption: (value) => value === "CUSTOM_OPTION",

    renderOptions: (options) => Object.keys(options).map((key,index) => <MenuItem key={key} value={key}>{options[key]}</MenuItem>)
}