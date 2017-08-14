const mc = require('@google/maps').createClient({
    key: 'AIzaSyBxJSyDiNKrSjxXNAVX2UEk1cAWb9KB_tc'
});

const location = [-33.878101, 151.220386]; // Darlinghurst, AU
const r = 1000;
const request = {
    location: location,
    radius: r,
    type: 'hospital',
    keyword: 'hospital'
};

mc.placesNearby(request, function (err, res) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(JSON.stringify(res.json.results.length));
    console.log(JSON.stringify(res.json.results.map(function (v) {
        return v.name;
    })));
});

