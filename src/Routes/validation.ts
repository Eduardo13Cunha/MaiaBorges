import Cookies from "js-cookie"

export const isLoggedIn = async () => {
    const isLoggedIn = Cookies.get("IsLoggedIn")
    if (isLoggedIn === "false" || isLoggedIn === undefined) {
        window.location.href = "/"
    }
}

export const AdminOnly = async () => {
    const AdminOnly = Cookies.get("RoleId")
    if (AdminOnly !== "1") {
        window.location.href = "/"
    }
}

export const DiretorProducaoAcess = async () => {
    const DiretorProducaoAcess = Cookies.get("RoleId")
    if (DiretorProducaoAcess === "2" || DiretorProducaoAcess === "1") {
       return true
    }
    window.location.href = "/"
}

export const ComercialAcess = async () => {
    const ComercialAcess = Cookies.get("RoleId")
    if (ComercialAcess === "3" || ComercialAcess === "1" || ComercialAcess === "2") {
       return true
    }
    window.location.href = "/"
}

export const LogisticaAcess = async () => {
    const LogisticaAcess = Cookies.get("RoleId")
    if (LogisticaAcess === "4" || LogisticaAcess === "1" || LogisticaAcess === "2") {
       return true
    }
    window.location.href = "/"
}

export const RecursosHumanosAcess = async () => {
    const RecursosHumanosAcess = Cookies.get("RoleId")
    if (RecursosHumanosAcess === "5" || RecursosHumanosAcess === "1" || RecursosHumanosAcess === "2") {
       return true
    }
    window.location.href = "/"
}

export const ChefeEquipaAcess = async () => {
    const ChefeEquipaAcess = Cookies.get("RoleId")
    if (ChefeEquipaAcess === "6" || ChefeEquipaAcess === "1" || ChefeEquipaAcess === "2") {
       return true
    }
    window.location.href = "/"
}  
