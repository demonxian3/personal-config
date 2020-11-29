(function($, Vue){
    let scheduleTable = {
        template:$('#scheduleTable').html(),
        props: {
            month: {
                type: Number,
                default: new Date().getMonth() + 1,
            },
            year: {
                type: Number,
                default: new Date().getFullYear(),
            },
            data: {
                type: Array,
                default: ()=>{return []},
            },
            fieldDeveloper: {
                type: String,
                default: 'developer',
            },
            fieldService:{
                type: String,
                default: 'serviceName',
            },
            startDate: {
                type: String,
                required: true,
            },
            endDate: {
                type: String,
                required: true,
            }
        },
        data(){
            return {
                xAxis: [],
                xDateLines: [],
                yAxis: [],
                maxDayCount: 0,
                tmpObject: {},
                nowDay: 0,
                scheduleInfoList: [],
            }
        },
        created(){
            let now = new Date();
            // this.maxDayCount = this.getMonthMaxDay(this.year, this.month);
            // // this.xAxis = this.range(1, this.maxDayCount+1);
            //

            //显示当前日期
            if (this.month == (now.getMonth() + 1) && this.year == (now.getFullYear())) {
                this.nowDay = now.getDate();
            } else {
                this.nowDay = 0;
            }

            //会自动渲染？
            // this.render();
        },
        watch:{
            data(){
                this.render();
            },
            startDate(){
                this.render();
            },
            endDate(){
                this.render();
            }
        },
        methods:{
            render(){
                this.calcxAxis();
                this.calcContent();
            },
            calcContent(){
                this.scheduleInfoList = [];
                for (let item of this.data){
                    let schedule = this.interDate(item['startDate'], item['endDate'], this.startDate, this.endDate);
                    schedule.developer = item[this.fieldDeveloper];
                    schedule.service = item[this.fieldService];
                    this.scheduleInfoList.push(schedule);
                }
                console.log(this.data);
                console.log(this.scheduleInfoList);
            },
            calcxAxis(){
                let startDate = new Date(this.startDate);
                let endDate = new Date(this.endDate);
                let y = startDate.getFullYear();
                let m = startDate.getMonth() + 1;
                let ey = endDate.getFullYear();
                let em = endDate.getMonth() + 1;

                this.xAxis = [];
                this.xDateLines = [];

                //第一个月数据
                let sDate = startDate.getDate();
                let eDate = this.getMonthMaxDay(y, m);
                this.xAxis.push({
                    startDate: sDate,
                    endDate: eDate,
                    label: `${y}-${m < 10 ? '0'+m : m}`,
                    colspan: eDate - sDate + 2,
                });

                //跳过只有一条数据的极端情况
                if (m != em || y != ey){
                    this.xDateLines = this.xDateLines.concat(this.range(sDate, eDate));
                }
                while (true) {
                    ++m;
                    if ((y == ey && m > em) || y > ey) {break;}
                    if (m > 12) {
                        y++;
                        m = 1;
                    }
                    let lastDate = this.getMonthMaxDay(y, m);
                    this.xAxis.push({
                        startDate: 1,
                        endDate:  lastDate,
                        label: `${y}-${m < 10 ? '0'+m : m}`,
                        colspan: lastDate,
                    });
                    if (y != ey || m != em) {
                        this.xDateLines = this.xDateLines.concat(this.range(1,lastDate))
                    }
                }

                //修正最后一个月结束日期相关数据
                let lastIdx = this.xAxis.length - 1;
                let lastxAxis = this.xAxis[lastIdx];
                lastxAxis.endDate = endDate.getDate();
                if (this.xAxis.length == 1){
                    lastxAxis.colspan = endDate.getDate() - lastxAxis.startDate + 2; //跨过开发人员列
                } else {
                    lastxAxis.colspan = endDate.getDate() - lastxAxis.startDate + 1;
                }
                this.xDateLines = this.xDateLines.concat(this.range(lastxAxis.startDate, lastxAxis.endDate));
                console.log(this.xDateLines);
                console.log(this.xAxis);
            },
            getBgColor(date, item){
                let toMonth = new Date().getMonth() + 1;
                let day = new Date(this.year, this.month-1, date).getDay();
                if (item === 'work') {
                    //标记排期颜色
                    return {'background-color': '#ffff91'};
                } else if (this.nowDay && date == this.nowDay && this.month === toMonth) {
                    //标记当天颜色
                    return {'background-color': '#bddaf6'}
                } else if ( day == 6 ||  day == 0) {
                    //标记周末颜色
                    return {'background-color': '#daf0c4'}
                }
            },
            range(start, end){
                return  new Array(end - start + 1).fill(start).map((el, i) => start + i);
            },
            //获取某个月最大天数即最后一天
            getMonthMaxDay(year, month){
                return new Date(year, month, 0).getDate();
            },
            //获取两个日期的天差
            diffDate(dateA, dateB) {
                console.log(this.getDateString(dateA) , this.getDateString(dateB), parseInt((Date.parse(dateA) - Date.parse(dateB)) / (24*60*60*1000)) + 1);
                return parseInt((Date.parse(dateA) - Date.parse(dateB)) / (24*60*60*1000)) + 1;
            },
            //获取两个日期的月差
            diffMonth(dateA, dateB){
                dateA = dateA.split("-");
                dateB = dateB.split("-");
                let year1 = parseInt(dateA[0]);
                let year2 = parseInt(dateB[0]);
                let month1 = parseInt(dateA[1]);
                let month2 = parseInt(dateB[1]);
                return (year2 - year1) * 12 + (month2 - month1) + 1;
            },

            //获取日期字符串
            getDateString(date){
                return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
            },

            //获取本月与排期日期范围交集，返回对象，{startIdx: 1, colspan: 3}，如果startIdx索引返回为0，则表示本月无排期
            interDate(startDate, endDate, firstDate, lastDate){
                if (typeof startDate === 'string') {
                    startDate = new Date(startDate + ' 00:00:00');
                }

                if (typeof endDate === 'string') {
                    endDate = new Date(endDate  + ' 00:00:00');
                }

                // let firstDate = new Date(this.year, this.month-1, 1);
                // let lastDate = new Date(this.year, this.month, 0);
                firstDate = new Date(firstDate);
                lastDate = new Date(lastDate);

                let leftBoundary = this.diffDate(startDate, firstDate);
                let rightBoundary =  this.diffDate(endDate, lastDate);

                //剔除无交集情况
                if (this.diffDate(startDate, lastDate) >0 || this.diffDate(endDate, firstDate) < 0){
                    return {startIdx: 0, colspan: 0};
                }

                //子集 包含全集情况
                if ( leftBoundary >= 0 && rightBoundary <= 0){
                    return {startIdx: startDate.getDate() ,colspan:this.diffDate(endDate, startDate)};
                }

                //左交
                if ( leftBoundary >= 0 && rightBoundary >= 0) {
                    return {startIdx:  startDate.getDate(),colspan: this.diffDate(lastDate, startDate)};
                }

                //右交
                if ( leftBoundary <= 0 && rightBoundary <= 0) {
                    console.log(startDate, endDate, firstDate, lastDate);
                    return {startIdx: 1 ,colspan: this.diffDate(endDate, firstDate)};
                    return
                }

                //补集
                if (leftBoundary <= 0 && rightBoundary >=0 ) {
                    return {startIdx: 1, colspan: this.diffDate(lastDate, firstDate)};
                }

                //空集
                return {startIdx: 0, colspan: 0};
            }
        }

    };

    let vm = new Vue({
        el: '#app',
        data: {
            scheduleTable: {
                startDay: 1,
                startMonth: 11,
                startYear: 2020,
                endDay: 30,
                endMonth: 11,
                endYear: 2020,
            },
            pageData: {
                page: 1,
                perPage: 10,
                dataCount: 0,
            },
            uploadFilesList: [],
            filter: {
                sServiceName: '',
                sDeveloperRtx: '',
                dtCreateStartTime: '',
                dtCreateEndTime: '',
                iAccessStatus: '',
            },
            recentMonths:[],
            recentYears:[],
            scheduleModalData: { },
            manageModalData: {},
            sdkAccessList: [
                {id: 10005, sServiceName: '健身环大冒险', sServiceName: 'jshdmx', sApplicant: 'Khazix', sApplyTime:'2020-02-02 11:22', sFinishTime: '2020-10-11 12:22', sAccessStatus: 0, sSDKDeveloper: '', sBackendDeveloper: '', },
                {id: 10005, sServiceName: '健身环大冒险', sServiceName: 'jshdmx', sApplicant: 'Khazix', sApplyTime:'2020-02-02 11:22', sFinishTime: '2020-10-11 12:22', sAccessStatus: 1, sSDKDeveloper: '', sBackendDeveloper: '', },
                {id: 10005, sServiceName: '健身环大冒险', sServiceName: 'jshdmx', sApplicant: 'Khazix', sApplyTime:'2020-02-02 11:22', sFinishTime: '2020-10-11 12:22', sAccessStatus: 2, sSDKDeveloper: 'xxxx', sBackendDeveloper: 'xxxx', },
                {id: 10005, sServiceName: '健身环大冒险', sServiceName: 'jshdmx', sApplicant: 'Khazix', sApplyTime:'2020-02-02 11:22', sFinishTime: '2020-10-11 12:22', sAccessStatus: 3, sSDKDeveloper: 'xxxx', sBackendDeveloper: 'xxxx', },
                {id: 10005, sServiceName: '健身环大冒险', sServiceName: 'jshdmx', sApplicant: 'Khazix', sApplyTime:'2020-02-02 11:22', sFinishTime: '2020-10-11 12:22', sAccessStatus: 4, sSDKDeveloper: 'xxxx', sBackendDeveloper: 'xxxx', },
                {id: 10005, sServiceName: '健身环大冒险', sServiceName: 'jshdmx', sApplicant: 'Khazix', sApplyTime:'2020-02-02 11:22', sFinishTime: '2020-10-11 12:22', sAccessStatus: 5, sSDKDeveloper: 'xxxx', sBackendDeveloper: 'xxxx', },
            ],
            accessStatusCode: {
                apply: 0,       //申请
                schedule: 1,    //排期
                develop: 2,     //开发
                report: 3,      //报告
                test: 4,        //测试
                finish: 5,      //完成
            },
            accessStatusMap: {
                0: '申请中',
                1: '排期中',
                2: '开发中',
                3: '测试中',
                4: '已完成',
            },
            developStatusMap: {
                0: '待分配',
                1: '开发中',
                2: '已完成',
            },

            scheduleList: [
                {developer: 'khazix', startDate: '2020-11-01', endDate: '2020-11-20', sServiceName: '光环：致远星'},
                {developer: 'ferry', startDate: '2020-11-15', endDate: '2020-11-25', sServiceName: '健身环大冒险'},
                {developer: 'tim', startDate: '2020-11-03', endDate: '2020-11-5', sServiceName: '如龙7'},
                {developer: 'tommy', startDate: '2020-11-30', endDate: '2020-12-10', sServiceName: '神秘海域4'},
                {developer: 'jeferry', startDate: '2020-11-29', endDate: '2020-12-01', sServiceName: '王者荣耀'},
                {developer: 'jack', startDate: '2020-12-01', endDate: '2020-12-20', sServiceName: '王者荣耀'},
            ]
        },
        beforeCreate(){
            AppUtil.showLoading();
        },
        created(){
            this.sdkAccessList = this.getSdkAccessList();
            setTimeout(function(){
                AppUtil.findAllRTX(); //预加载RTX列表
            },1);
        },
        mounted(){
            let dateRangeOption = {
                timePicker24Hour: true,
                timePickerSeconds: false,
                applyClass : 'btn-sm btn-success',
                cancelClass : 'btn-sm btn-default',
                timePickerIncrement: 1,
                locale: {
                    applyLabel: '确定',
                    cancelLabel: '取消',
                    format: 'YYYY/MM/DD',
                }
            };


            $('#dateRangeSchedule').daterangepicker(dateRangeOption);
            dateRangeOption.singleDatePicker = true;
            $('#dateRangeSearch2').daterangepicker(dateRangeOption);
            dateRangeOption.timePicker = true;
            dateRangeOption.singleDatePicker = false;
            dateRangeOption.locale.format = 'YYYY/MM/DD hh:mm';
            $('#dateRangeSearch').daterangepicker(dateRangeOption);
            $('#dateRangeSearch').on('cancel.daterangepicker', function(ev, picker) {
                $(this).val('');
            });
            $('#dateRangeSearch').val('');
            $('#dateRangeSchedule').val('');


            //加载RTX选择列表
            AppUtil.RTXSelector('sDeveloperRtxSearch', 'sDeveloperRtxSearch', 100, 'sDeveloperRtxSearch', true);
            AppUtil.RTXSelector('sDeveloperRtxSelect', 'sDeveloperRtxSelect', 100, 'sDeveloperRtxSelect', true);
            AppUtil.hideLoading();

        },
        components: {'schedule-table': scheduleTable},
        computed:{
            getFormatDate(){
                if (!this.date) {
                    let date = new Date();
                    this.date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                }

                return this.date;
            },
            startDate(){
                return `${this.scheduleTable.startYear}-${this.scheduleTable.startMonth}-${this.scheduleTable.startDay}`;
            },
            endDate(){
                return `${this.scheduleTable.endYear}-${this.scheduleTable.endMonth}-${this.scheduleTable.endDay}`;
            },
        },
        methods: {
            showShortName(cosUrls){
                if (!cosUrls) return '';
                let result = '';
                let urls = cosUrls.split('; ');
                for (let url of urls) {
                    if (url){
                        //截取不带md5的文件名
                        let fileParts = url.substr(url.lastIndexOf('/')+1);
                        result += fileParts.substr(fileParts.indexOf('.') + 1) + '; ';
                    }
                }
                return result;
            },
            parseDateRange(daterange, split='-'){
                if (typeof daterange === 'string' && daterange) {
                    let parts  = daterange.split(split);
                    return [parts[0].trim(), parts[1].trim()];
                }
                return [];
            },
            search(){
                if (daterange = $('#dateRangeSearch').val()){
                    let range = this.parseDateRange(daterange, '-');
                    this.filter.dtCreateStartTime = range[0];
                    this.filter.dtCreateEndTime = range[1];
                }
                this.filter.sDeveloperRtx = $('#sDeveloperRtxSearch').val();
                this.getSdkAccessList();
            },
            searchScheduleTable(){
                let date = $('#dateRangeSearch2').val();
                let parts = date.split('/');
                if (parts && parts.length === 3){
                    this.selectMonth = parseInt(parts[1]);
                    this.selectYear = parseInt(parts[0]);
                }
            },
            async getSdkAccessList(){
                let url = 'http://pandora-dev.ied.com/sdkinfo/getSdkAccessList';
                let filter = this.filter;
                this.filter.page = this.pageData.page;
                this.filter.perPage = this.pageData.perPage;
                let reply = await this.promiseJqueryAjax(url, 'get', this.filter);

                if (reply.ext.ret == 0) {
                    this.sdkAccessList = reply.ext.data.rowset;
                    this.pageData.dataCount = parseInt(reply.ext.data.count);
                    this.renderScheduleList();
                } else {
                    CommonUtil.showError('数据拉取失败');
                }

                $('#app').show();
            },
            toApplyPage(item, action){
                let confirm = true;
                if (ace.cookie.get('ams_service_type').toLowerCase() != item.sServiceName.toLowerCase()) {
                    confirm = window.confirm('是否将业务切换到' + item.sServiceNameCN + '?');
                }
                if (confirm) {
                    window.toggleServiceType(item.sServiceName.toLowerCase());
                    //页面复用修改和只读
                    if (action == 'write') {
                        window.location.href = '/sdkinfo/apply?write=1';
                    } else if (action == 'readonly') {
                        window.location.href = '/sdkinfo/apply?readonly=1';
                    }
                }
            },
            renderScheduleList(){
                this.scheduleList.length = 0;
                for (let k in this.sdkAccessList) {
                    let item = this.sdkAccessList[k];
                    if (item['sdk']['sDeveloperRtx']) {
                        this.scheduleList.push({
                            sServiceName: item['sServiceNameCN'],
                            developer: item['sdk']['sDeveloperRtx'],
                            startDate: item['sdk']['dtPredictStartTime'],
                            endDate: item['sdk']['dtPredictFinishTime'],
                        });
                    }
                }
            },
            showScheduleModal(data, item){
                this.scheduleModalData = data;
                this.scheduleModalData.item = item;

                item = item.toLowerCase();
                let schedule = data[item];
                $('#sDeveloperRtxSelect').val(schedule['sDeveloperRtx'])
                let startTime = schedule['dtPredictStartTime'].replace(" 00:00:00",'');
                let finishTime = schedule['dtPredictFinishTime'].replace(" 00:00:00",'');
                $('#dateRangeSchedule').val(`${startTime} - ${finishTime}`);
                this.$forceUpdate();
                $("#scheduleModal").modal("show");
            },

            //首次调用弹出模态框，二次调用选中sdk或后端作为内容，默认为sdk
            showManageModal(data){
                if (typeof data === 'object') {
                    this.manageModalData = data;
                    this.manageModalData.item = 'sdk';
                    $("#manageModal").modal("show");
                } else if (typeof data === 'string') {
                    this.manageModalData.item = data;
                    this.$forceUpdate();
                }
            },

            checkIsEmpty(target, ...checkItem){
                for (let key of  checkItem){
                    if (key[0] === 's') {
                        if ( target[key].trim() === '' ) return false;
                    }

                    else if (key[0] === 'd' && key[1] === 't') {
                        if ( target[key].trim() === '' || target[key] === '0000-00-00 00:00:00') return false;
                    }
                }
                return true;
            },

            //弹出选择文件
            showFileSelectPanel(key){
                try{
                    this.$refs[key][0].click();
                } catch(e) {
                    console.log(e);
                }
            },

            //多文件上传处理
            async multiFileUpload(e, item){
                let data = new FormData();
                for (let file of e.target.files) {
                    data.append('Filedata[]', file);
                }
                let url = 'http://pandora-dev.ied.com/sdkinfo/upload';
                let reply = await this.uploadFileAjax(url, 'post', data);
                if (reply.code == 0) {
                    if (reply.ext.ret != 0) {
                        CommonUtil.showError(reply.ext.msg);
                        return;
                    } else {
                        item.value = '';
                        for (let file of reply.ext.data){
                            item.value += `${file.cosUrl}; `;
                            item.time = this.getFormatDate;
                        }
                    }
                }
            },

            async changeStatus(item){
                let confirm = window.confirm('确定要流转至下一阶段吗？');
                if (!confirm) {
                    return false;
                }

                if (item.iAccessStatus == 1) {
                    //检查是否分配好开发人员
                    let ready = this.checkIsEmpty(item.backend, 'sDeveloperRtx', 'dtPredictStartTime', 'dtPredictFinishTime') &&
                        this.checkIsEmpty(item.sdk, 'sDeveloperRtx', 'dtPredictStartTime', 'dtPredictFinishTime');
                    if (!ready) {
                        CommonUtil.showError('请先分配好开发人员，再流转至下一流程');
                        return;
                    }
                }

                if (item.iAccessStatus == 2) {
                    //检查子任务是否都为完成状态，根据时间进行判断
                    let ready = true;



                    for (let key in item.sdk.sTaskDetail) {
                        if ( item.sdk.sTaskDetail[key].time == '' || item.sdk.sTaskDetail[key].time == '0000-00-00 00:00:00') {
                            ready = false;
                            break;
                        }
                    }

                    if (ready){
                        for (let key in item.backend.sTaskDetail) {
                            if  (item.backend.sTaskDetail[key].time == '' || item.backend.sTaskDetail[key].time == '0000-00-00 00:00:00') {
                                ready = false;
                                break;
                            }
                        }
                    }

                    if (!ready) {
                        CommonUtil.showError('请先完成开发任务，再流转至下一流程');
                        return;
                    }
                }

                let url = 'http://pandora-dev.ied.com/sdkinfo/nextStatus';
                let reply = await this.promiseJqueryAjax(url, 'post', {id: item.id, status: item.iAccessStatus, service_type:item.sServiceName});
                if (reply.ext.ret == 1) {
                    this.getSdkAccessList();
                } else {
                    CommonUtil.showError('流转失败');
                }

            },

            async deleteSDKAccess(item){
                let confirm = window.confirm('确定要驳回SDK接入申请吗，该操作无法回滚');
                if (!confirm) return;
                let url = 'http://pandora-dev.ied.com/sdkinfo/delete';
                let reply = await this.promiseJqueryAjax(url, 'post', {id: item.id});
                if (reply.ext.ret != 0) {
                    CommonUtil.showSuccess('删除成功');
                    this.getSdkAccessList();
                } else {
                    CommonUtil.showError('删除失败');
                }
            },

            async commitSchedule(){
                // 分配任务分为 后台(backend)开发 和 SDK开发
                let sDeveloperRtx = $('#sDeveloperRtxSelect').val();
                let sDevelopTime = $('#dateRangeSchedule').val();
                let range = this.parseDateRange(sDevelopTime, '-');

                if (sDeveloperRtx == '' || sDevelopTime == '' || sDevelopTime.indexOf('00') >= 0) {
                    CommonUtil.showError('分配人员或日期不能为空');
                    return;
                }

                //TODO: 日期校验
                let data = {
                    iSdkAccessId: this.scheduleModalData.id,
                    sTaskItem: this.scheduleModalData.item, //backend or SDK
                    sServiceName: this.scheduleModalData.sServiceName,
                    sDeveloperRtx: sDeveloperRtx,
                    dtPredictStartTime: range[0],
                    dtPredictFinishTime: range[1],
                }

                let url = 'http://pandora-dev.ied.com/sdkinfo/saveSchedule';
                let reply = await this.promiseJqueryAjax(url, 'post', data);
                $("#scheduleModal").modal("hide");
                if (reply.ext.ret == 0) {
                    this.getSdkAccessList();
                    CommonUtil.showSuccess('分配成功');
                } else {
                    CommonUtil.showError('分配失败');
                }
            },

            //勾选sdk完成项目
            checkSdkDetail(item){
                item.time = item.time === '' ? this.getFormatDate : '';
            },

            //提交具体任务配置
            async commitTaskDetail(item){
                let data = {
                    id: item.id,
                    item: item.item.toLowerCase(),
                    sTaskDetail: item[item.item.toLowerCase()].sTaskDetail,
                    sServiceName: item.sServiceName.toLowerCase(),
                };

                //backend 自动填充時間
                if (item.item.toLowerCase() == 'backend') {
                    for (let key in data.sTaskDetail ) {
                        let task = data.sTaskDetail[key];
                        if (task.value != '' && task.time == '') {
                            task.time = this.getFormatDate;
                        }
                    }
                }

                let url = 'http://pandora-dev.ied.com/sdkinfo/saveTaskDetail';
                let reply = await this.promiseJqueryAjax(url, 'post', data);
                $("#manageModal").modal("hide");
                if (reply.ext.ret != 0) {
                    CommonUtil.showSuccess('配置成功');
                    this.getSdkAccessList();
                } else {
                    CommonUtil.showError('配置失败');
                }
            }
        },
    });


})(jQuery, Vue);
