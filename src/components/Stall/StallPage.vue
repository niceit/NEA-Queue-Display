<template>
    <div class="pt-5">
    <div class="table-queue">
        <div class="table-title"></div>
        <div class="text-center pt-3">
            <img
                src="@/assets/images/samsung-logo.png"
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
            <div v-for="(perItem, index) in perFinalItemOutlet.data" :key="index"  class="d-flex w-100 align-items-center mt-4 mb-4">
                <div class="d-flex w-50 px-2" style="margin-left: 20px">
                    <img class="img-data" :src="perFinalItemOutlet.image"/>
                    <p class="px-2 mb-0"><strong class="queue-number">{{perItem.QueueNumber}}</strong></p>
                </div>
                <div class="w-50 px-2 right-element text-center">
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
            isApiRequesting: false,
            checkboxImg,
            listCompanyToSelect: [],
            listOutlet: [],
            finalListItemOutlet: []
        }
    },
    methods: {
        getCompanyList (reset = true) {
            if (this.isApiRequesting) {
                return
            }

            this.isApiRequesting = true
            if (reset) {
                this.listCompanyToSelect = []
                this.listOutlet = []
                this.finalListItemOutlet = []
            }

            if (reset) {
                this.$store.dispatch('application/setShowLoader', true)
            }
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
                    const listOutlet = []
                    listOutletPerCompany.map(eachOutlet => {
                        listOutlet.push({
                            id: eachOutlet.Id,
                            image: eachOutlet.ImageUrl
                        })
                    })

                    this.listOutlet = listOutlet
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
            this.isApiRequesting = false
        }
    },
    mounted () {
        this.getCompanyList()
        setInterval(() => {
            this.getCompanyList(false)
        }, 15000)
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
        font-family: Montserrat,sans-serif;
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
    .queue-number {
        font-size: 28px;
        font-family: 'Montserrat' ,'sans-serif' !important;
    }
</style>
