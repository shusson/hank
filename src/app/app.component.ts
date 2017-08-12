import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { postcodes } from './au_postcodes';


class Service {
    constructor(public name: string,
                public types: string[],
                public query: string,
                public active: boolean = false,
                public icon: string = "check") {
    }

    score(s) {
        if (!s[this.name]) {
            return 0;
        }
        if (this.icon === "check") {
            return -s[this.name].length;
        } else {
            return s[this.name].length;
        }
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    suburbs = [];
    services = [
        new Service("Health services", ['hospital', 'doctor'], 'hospital doctor', true),
        new Service("Fitness services", [], 'fitness', true),
        new Service("Junk food restaurants", [''], 'Fast Food', true, "close"),
        new Service("Parks", ['park'], 'park', false),
        new Service("Education services", ['school, university', 'library'], 'school', false),
        new Service("Alcohol services", [], 'bottle shop', false, "close"),
    ];

    constructor(private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.suburbs = postcodes.slice(0, 3);
        // const s = postcodes.find((p) => p.postcode === 2010);
        this.updateBurbs();

    }

    updateBurbs() {
        this.suburbs.forEach((s, index: number) => {
            window.setTimeout(() => {
                this.services.forEach((hs) => {
                    if (hs.active) {
                        this.gmap(s, hs.types, hs.query, hs.name);
                    }
                });
            }, 1500 * index);
        });
    }

    gmap(suburb, type, query, prop) {

        const c = new google.maps.LatLng(suburb.latitude, suburb.longitude);
        const map = new google.maps.Map(document.getElementById('map'), {
            center: c,
            zoom: 15
        });

        const request = {
            location: c,
            radius: '500',
            type: type,
            query: query,
        };

        const service = new google.maps.places.PlacesService(map);
        service.textSearch(request, (r, s) => {
            if (r) {
                const highRated = r.filter((res) => res.rating && res.rating > 1);
                suburb[prop] = highRated;
                this.cd.detectChanges();
            }
            console.log(s);
        });
    }

    updateServices(hs) {
        hs.active = !hs.active;
        this.updateBurbs();
    }

    sortSuburbs() {
        this.suburbs.sort((a, b) => {
            let aScore = 0;
            this.services.forEach(hs => {
               aScore += hs.score(a);
            });

            let bScore = 0;
            this.services.forEach(hs => {
                bScore += hs.score(a);
            });

            return aScore < bScore ? 1 : 0;
        });
        this.cd.detectChanges();
    }
}
