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
