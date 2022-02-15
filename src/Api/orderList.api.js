import Api from './api'
import { API_PATH } from './const'

const OrderListAPI = {
    getCompanyList () {
        return Api.get(API_PATH.GET_COMPANY_LIST)
    },
    getOutletList (companyId) {
        return Api.get(API_PATH.GET_OUTLET_LIST(companyId))
    },
    getListOrder (outletId, orderDate) {
        return Api.get(API_PATH.CALL_ORDER_LIST(outletId, orderDate))
    }
}
export default OrderListAPI
