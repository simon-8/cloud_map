var workMarker;
var polygonArray = []
houseMarkerArray = [];
var showTraffic = false; //显示实时路况
var city = decodeURI('%E6%9D%AD%E5%B7%9E%E5%B8%82'); // %E5%AE%89%E5%BA%86%E5%B8%82

var map = new AMap.Map('container', {
    resizeEnable: true,
    zoom:11,
});
// 添加标尺
var scale = new AMap.Scale();
map.addControl(scale);

// 输入提示
var auto = new AMap.Autocomplete({
    input: 'work-location'
});
AMap.event.addListener(auto, "select", function(e) {
    // value设置会延迟, 此处提前设置
    document.getElementById('work-location').value = e.poi.name;
    loadWorkLocation();
});

//实时路况图层
var trafficLayer = new AMap.TileLayer.Traffic({
    zIndex: 10
});
trafficLayer.setMap(map);
showTraffic ? trafficLayer.show() : trafficLayer.hide();

// 定位
function myPosition() {
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            buttonOffset: new AMap.Pixel(10, 20),
            // zoomToAccuracy: true,
            // buttonPosition:'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', function(data) {});
        AMap.event.addListener(geolocation, 'error', function(data) {});
    }); 
}

// 选择出行方式
function takeBus(radio) {
    loadWorkLocation();
}

// 定位工作地点 并设置marker
function loadWorkLocation() {
    var address = document.getElementById('work-location').value;
    var takeTypeArr = document.getElementsByName('takeType');
    var takeType;
    for (var i in takeTypeArr) {
        if (takeTypeArr[i].checked) {
            takeType = takeTypeArr[i].value;
        }
    }
    var takeTime = parseInt(document.getElementById('takeTime').value);
    // 正向地理编码
    var geocoder = new AMap.Geocoder({
        city: city,
        radius: 1000
    });

    geocoder.getLocation(address, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            let geocode = result.geocodes[0];
            loadWorkMarker(geocode);
            // console.log(geocode.addressComponent.district);
            loadWorkRange(geocode, takeType, takeTime);
            // loadCustomData();
            // map.setFitView();
            map.setZoomAndCenter(12, [geocode.location.getLng(), geocode.location.getLat()]);
        }
    });
}

/**
 * 设置marker
 * @param {object} d 
 */
function loadWorkMarker(d) {
    clearMarker();
    workMarker = new AMap.Marker({
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        map: map,
        position: [ d.location.getLng(),  d.location.getLat()]
    });
    workMarker.setAnimation('AMAP_ANIMATION_BOUNCE');
    var infoWindow = new AMap.InfoWindow({
        content: d.formattedAddress,
        offset: {x: 0, y: -30}
    });
    infoWindow.open(map, workMarker.getPosition());
    workMarker.on("mouseover", function(e) {
        infoWindow.open(map, workMarker.getPosition());
    });
}

/**
 * 设置公交到达圈
 * @param {object} geocode 
 * @param {string} takeType 
 * @param {int} takeTime 
 */
function loadWorkRange(geocode, takeType, takeTime) {
    
    var x = geocode.location.getLng();
    var y = geocode.location.getLat();
    var t = takeTime;
    var arrivalRange = new AMap.ArrivalRange();

    arrivalRange.search([x,y],t, function(status,result){
        clearPolygon();
        if(result.bounds){
            for(var i=0;i<result.bounds.length;i++){
               var polygon = new AMap.Polygon({
                    map:map,
                    fillColor:"#3366FF",
                    fillOpacity:"0.4",
                    strokeColor:"#00FF00",
                    strokeOpacity:"0.5",
                    strokeWeight:1
                });
                polygon.setPath(result.bounds[i]);
                polygonArray.push(polygon);
            }
            map.setFitView();
        }
    },{
        policy: takeType
    });
}

/**
 * 根据地址创建标记点
 * @param {object} data 
 */
function addMarkerByAddress(data) {
    var geocoder = new AMap.Geocoder({
        city: city,
        radius: 1000
    });

    geocoder.getLocation(data.area + data.xiaoqu, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            let geocode = result.geocodes[0];
            
            let houseMarker = new AMap.Marker({
                map: map,
                position: [ geocode.location.getLng(),  geocode.location.getLat()]
            });
            houseMarkerArray.push(houseMarker);
            let content = 
            `<div class="info-window">
                <h3 class="poi-title">${data.title}</h3>
                <div class="poi-imgbox">
                    <img src="${data.thumb}" alt="" width="100%">
                </div>
                <div class="poi-rightbox">
                    
                    <div class="poi-info">
                        <p class="poi-addr">小区: ${data.area} - ${data.xiaoqu}</p>
                        <p class="poi-style">装修: ${data.style}</p>
                        <p class="poi-room">房间: ${data.room}</p>
                        <p class="poi-price">价格: <span class="price">${data.price}</span> ${data.paymentType}</p>
                    </div>
                </div>
                <div class="clear">&nbsp;</div>
            </div>`;
            var infoWindow = new AMap.InfoWindow({
                content: content,
                offset: {x: 0, y: -30}
            });

            houseMarker.on("click", function(e) {
                infoWindow.open(map, houseMarker.getPosition());
            });

        }
    });
    AMap.event.addListener(geocoder, 'error', function(data) {
        console.log('查询信息时出错');
    });
}

/**
 * 显示/关闭实时路况
 */
function toggleTraffic() {
    if (showTraffic) {
        trafficLayer.hide();
        showTraffic = false;
    } else {
        trafficLayer.show();
        showTraffic = true;
    }
}

/**
 * 清除标记
 */
function clearMarker() {
    if (workMarker) map.remove(workMarker);
}

/**
 * 清除圈子
 */
function clearPolygon() {
    if (polygonArray) map.remove(polygonArray);
    polygonArray = [];
}

/**
 * 清除房源标记
 */
function clearHouseMarker() {
    if (houseMarkerArray) map.remove(houseMarkerArray);
    houseMarkerArray = [];
}

/**
 * 清空所有数据
 */
function clearMap() {
    map.clearInfoWindow();
    clearMarker();
    clearPolygon();
    clearHouseMarker();
}

/**
 * 读取自定义数据
 * @param {int} page 
 */
function loadCustomData(page) {
    $.get('/spider/getData/' + page, function(res) {
        getData(res);
    }, 'json');
}

/**
 * 生成数据html
 * @param {object} res 
 */
function getData(res) {
    let data = res.data;
    if (data.length) {
        let li = '';
        clearHouseMarker();
        map.clearInfoWindow();
        for (idx in data) {
            let id = (page - 1) * pagesize + parseInt(idx) + 1;
            let info = data[idx];
            info.title = info.title.replace(/\(单间出租\)|\(个人\)/g,'');
            li += 
            `<li>
                <h3 class="poi-title">${info.title}</h3>
                <div class="poi-imgbox">
                    <img src="${info.thumb}" alt="" width="100%">
                </div>
                <div class="poi-rightbox">
                    
                    <div class="poi-info">
                        <p class="poi-addr">小区: ${info.area} - ${info.xiaoqu}</p>
                        <p class="poi-style">装修: ${info.style}</p>
                        <p class="poi-room">房间: ${info.room}</p>
                        <p class="poi-price">价格: <span class="price">${info.price}</span> ${info.paymentType}</p>
                    </div>
                </div>
                <div class="clear">&nbsp;</div>
            </li>`;
            addMarkerByAddress(info);
        }
        $('#houseList').html(li);
        getPage(res.count);
    } else {
        $('#houseList').html('暂无数据');
    }
}

/**
 * 生成page html
 * @param {int} count 
 */
function getPage(count) {
    let pages = '';
    let totalPage = Math.round(count/pagesize),
        roolpage = Math.floor(5/2),
        startPage = page - 2,
        endPage = page + 2;
    // 防止前置溢出
    if (startPage < 1) {
        endPage += (1 - startPage);
        startPage = 1;
    }
    // 防止后置溢出
    if (endPage > totalPage) {
        startPage -= (endPage - totalPage);
        startPage = startPage < 1 ? 1 : startPage;
        endPage = totalPage;
    }

    for (let i = startPage; i <= endPage; i++) {
        if (i == page) {
            pages += `<li class='current'><a>${i}</a></li>`;
        } else {
            pages += `<li><a onclick="$.pages(${i})">${i}</a></li>`;
        }
    }
    if (startPage > 1) {
        pages = `<li><a onclick="$.pages()">首页</a></li>` + pages;
    }
    if (endPage < totalPage) {
        pages += `<li><a onclick="$.pages(${totalPage})">尾页</a></li>`;
    }
    pages += `<li><a>共${totalPage}页</a></li>`;
    $('#pages').html(pages);
    // if (page < totalPage) {
        
    // } else {
    //     pages = '<li>已显示全部结果</li>';
    // }
}