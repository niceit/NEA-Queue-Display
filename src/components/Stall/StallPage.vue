<template>
    <div>
    <h1 class="px-2 pt-2">Queue Order</h1>
    <div class="table-queue">
        <div class="table-title"></div>
        <div class="text-center">
            <img
            width="180px"
            alt=""
            aria-hidden="true"
            />
            <h2 class="ant-typography" style="font-size: 35px; margin-top: 10px">
                ORDERING KIOSK
            </h2>
        </div>
        <div class="d-flex w-100">
            <div class="w-50 text-center header-stall">
                <h1>Stall Number</h1>
            </div>
            <div class="w-50 text-center header-stall right-element">
                <h1>Collection Ready</h1>
            </div>
        </div>
        <div class="w-100" v-for="perFinalItemOutlet in finalListItemOutlet" :key="perFinalItemOutlet.id">
            <div v-for="(perItem, index) in perFinalItemOutlet.data" :key="index"  class="d-flex w-100 align-items-center">
                <div class="d-flex w-50 px-2 pt-2">
                    <img class="img-data" :src="perFinalItemOutlet.image"/>
                    <p class="px-2 mb-0">{{perItem.QueueNumber}}</p>
                </div>
                <div class="w-50 px-2 pt-2 right-element">
                    <img v-if="perItem.Status === 'Ready'" :src="checkboxImg" alt="png">
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import OrderListAPI from '@/Api/orderList.api.js'
import Application from '@/utils/application.js'
import checkboxImg from '@/images/checkbox.png'
export default {
    data () {
        return {
            checkboxImg,
            listCompanyToSelect: [],
            listOutlet: [],
            finalListItemOutlet: []
        }
    },
    methods: {
        getCompanyList () {
            this.listCompanyToSelect = []
            this.listOutlet = []
            this.finalListItemOutlet = []
            this.$store.dispatch('application/setShowLoader', true)
            OrderListAPI.getCompanyList().then(res => {
                if (Application.isApiResponseSuccess(res.data)) {
                    const companyList = res.data.Data
                    this.listCompanyToSelect = companyList.map(el => {
                        return {
                            id: el.Id,
                            label: el.Name
                        }
                    })
                    this.getOutletList()
                }
            })
        },
        async getOutletList () {
            const promises = this.listCompanyToSelect.map(async (company) => {
                const dataResponse = await OrderListAPI.getOutletList(company.id)
                return dataResponse.data.Data
            })
            const dataOutlet = await Promise.all(promises)
            dataOutlet.map(listOutletPerCompany => {
                if (listOutletPerCompany && listOutletPerCompany.length) {
                    listOutletPerCompany.map(eachOutlet => {
                        this.listOutlet.push({
                            id: eachOutlet.Id,
                            image: eachOutlet.ImageUrl
                        })
                    })
                }
            })
            this.findFinalListOutletToRender()
        },
        async findFinalListOutletToRender () {
            const today = new Date().toJSON().slice(0, 10).replace(/-/g, '/')
            const promises = this.listOutlet.map(async eachOutlet => {
                const dataResponse = await OrderListAPI.getListOrder(eachOutlet.id, today)
                return {
                    id: eachOutlet.id,
                    image: eachOutlet.image,
                    data: dataResponse.data.Data ?? []
                }
            })
            this.finalListItemOutlet = await Promise.all(promises)
            this.$store.dispatch('application/setShowLoader', false)
            setTimeout(() => {
                this.getCompanyList()
            }, 15000)
        }
    },
    mounted () {
        this.getCompanyList()
    },
    components: {}
}
</script>

<style lang="scss" scoped>
    .table-queue {
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 60%;
        margin: auto;
    }
    .header-stall {
        margin-top: 10px;
        background: #eee;
        h1 {
            margin-top: 15px !important;
        }
    }
    .pl-2 {
        padding-left: 2px;
    }
    .right-element {
        border-left: 1px solid #ddd;
    }
    .img-data {
        width: 30px;
        height: 30px;
    }
</style>
