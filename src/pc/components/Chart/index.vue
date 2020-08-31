<template>
    <div class="chart-list" :class="[list.length <= 1 ? 'chart-list-1' : 'chart-list-more']">
        <div class="chart-item" :class="[list.length <= 1 ? 'chart-item-1' : 'chart-item-more']" v-for="item in list" :key="item.id">
            <div class="inner">
                <div class="title">30日 | 平均单次使用时长（秒）</div>
                <div class="time">2020-07-26-2020-08-24</div>
                <div class="horizontal" v-show="compose === 'horizontal'">
                    <div class="subtime">8-24</div>
                    <div class="horizontal-compare-sum">
                        <div class="current-box">
                            <div class="current"><span class="val">601.24</span>人</div>
                            <div class="compare">
                                <div class="huanbi">环比<span class="val_red">50%</span></div>
                                <div class="tongbi">同比<span class="val_green">50%</span></div>
                            </div>
                        </div>
                        <div class="sum-average">
                            <div class="sum">合计<span class="val">599.38</span>人</div>
                            <div class="average">均值<span class="val">599.2</span>人</div>
                        </div>
                    </div>
                    <div class="vertical-r">
                        <EchartComponent :option="item.option"/>
                    </div>
                </div>
                <div class="vertical" v-show="compose === 'vertical'">
                    <div class="vertical-l">
                        <div class="subtime">8-24</div>
                        <div class="current"><span class="val">601.24</span>人</div>
                        <div class="compare">
                            <div class="huanbi">环比<span class="val_red">50%</span></div>
                            <div class="tongbi">同比<span class="val_green">50%</span></div>
                        </div>
                        <div class="sum-average">
                            <div class="sum">合计<span class="val">599.38</span>人</div>
                            <div class="average">均值<span class="val">599.2</span>人</div>
                        </div>
                    </div>
                    <div class="vertical-r">
                        <EchartComponent :option="item.option"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EchartComponent from '@/pc/_components/echart'

export default {
    name: 'Chart',
    zhName: '图表组件',
    minSpan: 2,
    components: {
        EchartComponent,
    },
    editorProps() {
        return [
                {
                    title: '图表配置',
                    props: [
                        {
                            label: '数据源',
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            // tips: h => {
                            //     return (
                            //         <div>
                            //         <el-alert
                            //             class="mb-16"
                            //             title="一期只支持自定义数据接口"
                            //             type="info"
                            //             show-icon
                            //             closable={false}
                            //         />
                            //         <InterfaceDoc
                            //             title="表格数据接口文档"
                            //             columns={[
                            //             {
                            //                 label: '字段',
                            //                 prop: 'prop'
                            //             },
                            //             {
                            //                 label: '数据类型',
                            //                 prop: 'type'
                            //             },
                            //             {
                            //                 label: '说明',
                            //                 prop: 'desc'
                            //             }
                            //             ]}
                            //             data={[
                            //             {
                            //                 prop: 'code',
                            //                 type: 'number - 数字',
                            //                 desc: '接口状态值'
                            //             },
                            //             {
                            //                 prop: 'pageSize',
                            //                 type: 'number - 数字',
                            //                 desc: '每次请求返回数据条目'
                            //             },
                            //             {
                            //                 prop: 'page',
                            //                 type: 'number - 数字',
                            //                 desc: '当前页码'
                            //             },
                            //             {
                            //                 prop: 'total',
                            //                 type: 'number - 数字',
                            //                 desc: '数据总量'
                            //             },
                            //             {
                            //                 prop: 'data',
                            //                 type: 'object - 对象',
                            //                 desc: '数据主体',
                            //                 children: [
                            //                 {
                            //                     prop: 'columns',
                            //                     type: 'array - 数组',
                            //                     desc:
                            //                     '表头配置, label，prop必须返回。其他属性也可在页面中进行可视化编辑',
                            //                     children: [
                            //                     {
                            //                         prop: 'label',
                            //                         type: 'string - 字符串',
                            //                         desc: '每列表头标题'
                            //                     },
                            //                     {
                            //                         prop: 'prop',
                            //                         type: 'string - 字符串',
                            //                         desc: '列内容的字段名'
                            //                     },
                            //                     {
                            //                         prop: 'sortable',
                            //                         type: 'boolean - 布尔值',
                            //                         desc:
                            //                         '指定当前字段为排序字段，发送请求时参数为 sort: "prop:ascending"'
                            //                     },
                            //                     {
                            //                         prop: 'defaultSort',
                            //                         type: '"ascending" | "descending"',
                            //                         desc:
                            //                         '如果指定了此属性则会将当前字段作为列表默认排序字段，如果指定多个则只会生效遍历中遇到的第一个。'
                            //                     },
                            //                     {
                            //                         prop: 'align',
                            //                         type: '"left" | "right" ｜ "center"',
                            //                         desc: '列文字对齐方式'
                            //                     },
                            //                     {
                            //                         prop: 'fixed',
                            //                         type: '"left" | "right"',
                            //                         desc: '列是否固定在左侧或者右侧'
                            //                     }
                            //                     ]
                            //                 },
                            //                 {
                            //                     prop: 'data',
                            //                     type: 'array - 数组',
                            //                     desc: '表格主体数据'
                            //                 }
                            //                 ]
                            //             }
                            //             ]}
                            //             code={this.genMockData(true)}
                            //         />
                            //         </div>
                            //     )
                            // },
                            prop: 'url',
                            type: 'dataSource'
                        },
                        {
                            label: '图表类型',
                            prop: 'chartType',
                            type: 'select',
                            options: [
                                {
                                    label: '折线图',
                                    value: 'line',
                                },
                                {
                                    label: '柱状图',
                                    value: 'bar',
                                },
                                {
                                    label: '饼图',
                                    value: 'pie',
                                },
                                // {
                                //     label: '散点（气泡）图',
                                //     value: 'scatter',
                                // },
                                // {
                                //     label: '带有涟漪特效动画的散点（气泡）图',
                                //     value: 'effectScatter'
                                // },
                                // {
                                //     label: '雷达图',
                                //     value: 'radar',
                                // },
                                // {
                                //     label: '树图',
                                //     value: 'tree',
                                // },
                                // {
                                //     label: 'treemap',
                                //     value: 'treemap',
                                // },
                                // {
                                //     label: '旭日图',
                                //     value: 'sunburst',
                                // },
                                // {
                                //     label: 'boxplot',
                                //     value: 'boxplot',
                                // },
                                // {
                                //     label: 'K线图',
                                //     value: 'candlestick',
                                // },
                                // {
                                //     label: '热力图',
                                //     value: 'heatmap',
                                // },
                                // {
                                //     label: '地图',
                                //     value: 'map',
                                // },
                                // {
                                //     label: '平行坐标系',
                                //     value: 'parallel',
                                // },
                                // {
                                //     label: '路径图',
                                //     value: 'lines',
                                // },
                                // {
                                //     label: '关系图',
                                //     value: 'graph',
                                // },
                                // {
                                //     label: '桑基图',
                                //     value: 'sankey',
                                // },
                                // {
                                //     label: '漏斗图',
                                //     value: 'funnel',
                                // },
                                // {
                                //     label: '仪表盘',
                                //     value: 'gauge',
                                // },
                                // {
                                //     label: '象形柱图',
                                //     value: 'pictorialBar',
                                // },
                                // {
                                //     label: '主题河流',
                                //     value: 'themeRiver',
                                // },
                                // {
                                //     label: '自定义系列',
                                //     value: 'custom',
                                // },
                            ]
                        },
                        {
                            label: '排版',
                            prop: 'compose',
                            type: 'radio',
                            options: [
                                {
                                    label: '横排',
                                    value: 'horizontal',
                                    
                                },
                                {
                                    label: '竖排',
                                    value: 'vertical',
                                }
                            ],
                        },
                ]
            }
        ]
    },
    props: {
        chartType: {
            type: String,
            default: 'line'
        },
        url: {
            type: String,
            default: ''
        },
        compose: {
            type: String,
            default: 'horizontal'
        },
    },
    watch: {
        chartType(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.configChange()
            }
        },
        compose(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.configChange()
            }
        }
    },
    data() {
        return {
            list: [{},]
        }
    },
    created() {
        this.list.forEach((item) => {
            item.option = {
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value',
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: this.chartType,
                    areaStyle: {},
                }]
            }
        })
    },
    methods: {
        configChange() {
            this.list.forEach((item) => {
                item.option = {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: this.chartType,
                        areaStyle: {},
                    }]
                }
            })
            this.$forceUpdate()
        },
        fetchData(params = {}) {
            this.$ajax({
                url: this.url,
                method: 'POST',
                params
            }).then(() => {

            }).catch(() => {})
        }
    },
}
</script>

<style lang="scss" scoped>
.flex{
    display: flex;
}
.chart-list{
    background-color: #f7f9fa;
    .chart-item{
        padding: 10px;
        .inner{
            padding: 20px;
            border: 2px solid transparent;
            background-color: #ffffff;
            border-radius: 3px;
            &:hover{
                border: 2px solid #3AD1C5;
                border-radius: 3px;
            }
            .title{
                color: #5F6E82;
                font-weight: 400;
                font-size: 14px;
                &:hover{
                    color: #559FF0;
                }
            }
            .time{
                font-size: 12px;
                color: #8492A6;
            }
            .subtime{
                font-size: 13px;
                color: #8492A6;
                margin-top: 8px;
            }
            .current{
                .val{
                    font-size: 40px;
                    color: #475669;
                }
            }
            .compare{
                margin-top: 7px;
                margin-left: 10px;
                .val_red{
                    color: #FC6772;
                    &::before{
                        content: "";
                        display: inline-block;
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-top: 5px solid #FC6772;
                        border-right: 5px solid transparent;
                    }
                }
                .val_green{
                    color: #2DCA93;
                    &::before{
                        content: "";
                        display: inline-block;
                        width: 0;
                        height: 0;
                        border-left: 5px solid transparent;
                        border-top: 5px solid #2DCA93;
                        border-right: 5px solid transparent;
                    }
                }
            }
        }
        .sum-average{
            padding: 12px 0 12px 11px;
            border-left: 1px solid #E9F0F7;
            .val{
                font-size: 18px;
                color: #475669;
            }
        }
        .horizontal-compare-sum{
            display: flex;
            align-items: center;
            .current-box{
                display: flex;
                align-items: center;
                width: 67%;
            }
        }
        .vertical{
            display: flex;
            .vertical-l{
                width: 20%;
            }
            .vertical-r{
                flex: 1;
            }
            .sum-average{
                border-left: none;
                border-top: 1px solid #E9F0F7;
                padding: 28px 0 0;
                margin-top: 28px;
            }
        }
    }
}
.chart-list-1{
    .chart-item-1{

    }
}
.chart-list-more{
    display: flex;
    flex-wrap: wrap;
    .chart-item-more{
        width: 50%;
    }
}
</style>
