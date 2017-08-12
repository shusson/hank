import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { postcodes } from './au_postcodes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    suburbs = [];

    constructor(private cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.suburbs = postcodes.slice(0, 10);
        // const s = postcodes.find((p) => p.postcode === 2010);

        this.suburbs.forEach((s, index: number) => {
            window.setTimeout(() => {
                this.gmap(s, ['hospital', 'doctor'], 'hospital doctor', "healthServices");
                this.gmap(s, ['gym'], 'gym', "gymServices");
                this.gmap(s, ['park'], 'park', "parkServices");
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
            radius: '1000',
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
