const express = require('express');
const app = express();
const fs = require('fs');

const postcodes = require('./postcodes.json');
const services = require('./services.json');

filters = {
    "hospitals": {id: "hospitals", name: "Hospitals", type: "hospital", query: 'hospital', good: true, active: true},
    "doctors": {id: "doctors", name: "Doctors", type: "doctor", query: 'doctor', good: true, active: true},
    "dentist": {id: "dentist", name: "Dentists", type: "dentist", query: 'dentist', good: true, active: true},
    "pharmacy": {id: "pharmacy", name: "Pharmacies", type: "pharmacy", query: 'pharmacy', good: true, active: true},
    "physiotherapist": {id: "physiotherapist", name: "Physiotherapists", type: "physiotherapist", query: 'physiotherapist', good: true, active: true},
    "fitness": {id: "fitness", name: "Gymns", type: "gym", query: 'gym', good: true, active: true},
    "parks": {id: "parks", name: "Parks", type: "park", query: 'park', good: true, active: true},
    "schools": {id: "schools", name: "Schools", type: "school", query: 'school', good: true, active: true},
    "university": {id: "university", name: "Universities", type: "university", query: 'university', good: true, active: true},
    "library": {id: "library", name: "Libraries", type: "library", query: 'library', good: true, active: true},
    "train_station": {id: "train_station", name: "Train stations", type: "train_station", query: 'train', good: true, active: true},
    "alcohol": {id: "alcohol", name: "Liquor stores", type: "liquor_store", query: 'bottle', good: false, active: true},
    "mcd": {id: "mcd", name: "McDonald stores", type: "restaurant", query: 'mcdonalds', good: false, active: true},
    "kfc": {id: "kfc", name: "KFC stores", type: "restaurant", query: 'kfc', good: false, active: true},
    "meal_takeaway": {id: "meal_takeaway", name: "Takeaway restaurants", type: "meal_takeaway", query: '', good: false, active: true},
    "gas_station": {id: "gas_station", name: "Petrol stations", type: "gas_station", query: 'petrol', good: false, active: true},
    "dominos": {id: "dominos", name: "Dominos stores", type: "restaurant", query: 'dominos', good: false, active: true}
};

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/suburbs', function (req, res) {
    res.send(JSON.stringify(postcodes));
});

app.get('/suburbs/:id', function (req, res) {
    res.send(JSON.stringify(postcodes.find(function(pc) {
        return pc.postcode == req.params.id;
    })));
});

app.get('/services', function (req, res) {
    var s = [];
    Object.keys(filters).map(function(v) {
       s.push(filters[v]);
    });
    res.send(JSON.stringify(s));
});

app.get('/suburbs/:id/services', function (req, res) {
    res.send(JSON.stringify(services[req.params.id]));
});

app.get('/suburbs/:id/services/:s_id', function (req, res) {
    res.send(JSON.stringify(services[req.params.id][req.params.s_id]));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')

    var mc = require('@google/maps').createClient({
        key: 'AIzaSyCehdGYzFIE4G9IuGJruh7A1zqFYFbIXZ4'
    });

    // var places = {};
    //
    // postcodes.forEach(function(pc) {
    //     Object.keys(filters).forEach(function(f) {
    //         findPlaces(pc, filters[f], f, null);
    //     });
    // });

    function findPlaces(suburb, filter, key, pagetoken) {
        const c = [suburb.latitude, suburb.longitude];
        const request = {
            location: c,
            radius: 1000,
            type: filter.type,
            keyword: filter.query,
            pagetoken: pagetoken
        };

        mc.placesNearby(request, function (err, r) {
            if (err) {
                console.log(err);
                return;
            }
            if (r.json.next_page_token !== undefined) {
                findPlaces(suburb, filter, key, r.json.next_page_token)
            }
            if (!places[suburb.postcode]) {
                places[suburb.postcode] = {};
            }

            if (places[suburb.postcode][key]) {
                places[suburb.postcode][key] = places[suburb.postcode][key].concat(r.json.results.map(function(r) {
                    return {"place_id": r.place_id,
                        "rating": r.rating,
                        "name": r.name,
                        "address": r.formatted_address,
                        "geo": r.geometry};
                }));
            } else {
                places[suburb.postcode][key] = r.json.results.map(function(r) {
                    return {"place_id": r.place_id,
                        "rating": r.rating,
                        "name": r.name,
                        "address": r.formatted_address,
                        "geo": r.geometry};
                });
            }

            fs.writeFile("services.json", JSON.stringify(places), function(err) {
                if(err) {
                    console.log(err);
                    return;
                }
                console.log('w');
            });
        });
    }
});
