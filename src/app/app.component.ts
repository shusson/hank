import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { postcodes } from './au_postcodes';


class Service {
    constructor(public name: string,
                public types: string[],
                public query: string,
                public active: boolean = false) {
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
        new Service("health services", ['hospital', 'doctor'], 'hospital doctor', false),
        new Service("gym services", ['gym'], 'gym', false),
        new Service("park services", ['park'], 'park', false),
        new Service("junk food services", [''], 'Fast Food', true),
        new Service("pool Services", [], 'Pools', false),
        new Service("school services", ['school, university', 'library'], 'school', true),
        new Service("alcohol services", [], 'bottle shop', true),
    ];

    constructor(private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.suburbs = postcodes.slice(0, 10);
        // const s = postcodes.find((p) => p.postcode === 2010);

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
}
