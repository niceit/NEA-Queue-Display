export const API_PATH = {
    GET_COMPANY_LIST: 'GetCompanyList',
    GET_OUTLET_LIST: (companyId) => `GetOutletList?CompanyId=${companyId}`,
    CALL_ORDER_LIST: (outletId, orderDate) => {
        return `CallOrderList?outletId=${outletId}&orderDate=${orderDate}&status=View,Ready,Collected`
    }
}

export const PATH = {
    LOGIN: '/login',
    FOOD: '/food'
}
