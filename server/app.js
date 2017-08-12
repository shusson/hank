const express = require('express');
const app = express();
const fs = require('fs');

const postcodes = require('./postcodes.json');
const services = require('./services.json');

filters = {
    "health": {name: "Health services", type: "['hospital', 'doctor']", query: 'hospital doctor', good:true},
    "fitness": {name: "Fitness services", type: "[]", query: 'gym', good:true},
    "junk": {name: "Junk food services", type: "[]", query: 'fast food', good:true},
    "parks": {name: "Parks services", type: "[]", query: 'park', good:true},
    "schools": {name: "Schools services", type: "['school']", query: 'school', good:true},
    "university": {name: "University services", type: "['university']", query: 'university', good:true},
    "library": {name: "Library services", type: "['library']", query: 'library', good:true},
    "alcohol": {name: "Alcohol services", type: "[]", query: 'bottle shop', good: true}
};

app.get('/suburbs', function (req, res) {
    res.send(JSON.stringify(postcodes));
});

app.get('/suburbs/:id', function (req, res) {
    res.send(JSON.stringify(postcodes.find(function(pc) {
        return pc.postcode == req.params.id;
    })));
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
    //         findPlaces(pc, filters[f], f);
    //     });
    // });

    // function findPlaces(suburb, filter, key) {
    //     const c = [suburb.latitude, suburb.longitude];
    //     const request = {
    //         location: c,
    //         radius: 500,
    //         type: filter.type,
    //         query: filter.query
    //     };
    //
    //     mc.places(request, function (err, r) {
    //         if (err) {
    //             return;
    //         }
    //         if (!places[suburb.postcode]) {
    //             places[suburb.postcode] = {};
    //         }
    //         places[suburb.postcode][key] = r.json.results.map(function(r) {
    //             return {"place_id": r.place_id,
    //                 "rating": r.rating,
    //                 "name": r.name,
    //                 "address": r.formatted_address,
    //                 "geo": r.geometry};
    //         });
    //         fs.writeFile("services.json", JSON.stringify(places), function(err) {
    //             if(err) {
    //                 return console.log(err);
    //             }
    //             console.log("The file was saved!");
    //         });
    //     });
    // }
});
