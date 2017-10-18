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
            loadWorkRange(geocode, takeType, takeTime);
            loadCustomData();
            // map.setFitView();
            map.setZoomAndCenter(12, [geocode.location.getLng(), geocode.location.getLat()]);
        }
    });
}

// 设置marker
function loadWorkMarker(d) {
    clearMarker();
    workMarker = new AMap.Marker({
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

// 设置公交到达圈
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

// 获取数据
function loadCustomData() {
    
    $.get('/spider/getData', function(data) {
        for(var i in data) {
            addMarkerByAddress({
                address: data[i], 
                linkurl: i
            });
        }
    }, 'json');
}

function addMarkerByAddress(data) {
    var geocoder = new AMap.Geocoder({
        city: city,
        radius: 1000
    });
    var address = data.address.split(' | ');
    // console.log();
    // return false;
    geocoder.getLocation(address[1], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            let geocode = result.geocodes[0];
            
            let houseMarker = new AMap.Marker({
                map: map,
                position: [ geocode.location.getLng(),  geocode.location.getLat()]
            });
            houseMarkerArray.push(houseMarker);
            var infoWindow = new AMap.InfoWindow({
                content: data.address,
                offset: {x: 0, y: -30}
            });
            // infoWindow.open(map, houseMarker.getPosition());
            houseMarker.on("click", function(e) {
                infoWindow.open(map, houseMarker.getPosition());
            });

        }
    });
    AMap.event.addListener(geocoder, 'error', function(data) {
        console.log('兑换信息时出错');
    });
}

// 显示/关闭实时路况
function toggleTraffic() {
    if (showTraffic) {
        trafficLayer.hide();
        showTraffic = false;
    } else {
        trafficLayer.show();
        showTraffic = true;
    }
}

// 清除标记
function clearMarker() {
    if (workMarker) map.remove(workMarker);
}

// 清除圈子
function clearPolygon() {
    if (polygonArray) map.remove(polygonArray);
    polygonArray = [];
}

// 清除房源标记
function clearHouseMarker() {
    if (houseMarkerArray) map.remove(houseMarkerArray);
    houseMarkerArray = [];
}

// loadWorkLocation();

// DEBUG FUNC
function loadCustomData1() {
    
    $.get('/spider/getData', function(data) {
        // for(var i in data) {
            // addMarkerByAddress({
            //     address: data[i], 
            //     linkurl: i
            // });
        // }
        getPage(data);
    }, 'json');
}

function getPage(data) {

    console.log(data.length);
}

loadCustomData1();