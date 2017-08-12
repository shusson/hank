import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [DataService]
})
export class AppComponent implements OnInit {
    suburbs = [];
    services = [];
    redraw = false;

    constructor(private cd: ChangeDetectorRef,
                private ds: DataService) {

    }

    ngOnInit() {
        window.setTimeout(() => {
            this.sortSuburbs();
        }, 1500);
        this.ds.getSuburbs().subscribe(v => {
            this.suburbs = v;
            this.suburbs.forEach(s => {
                this.ds.getSuburbServices(s.postcode).subscribe(ss => {
                    Object.keys(ss).forEach((key) => {
                        s[key+'O'] = ss[key];
                        s[key] = ss[key].length;
                    });
                    this.score(s);
                    this.cd.detectChanges();
                });
            });
        });

        this.ds.getServices().subscribe(v => {
            this.services = v;
        });
    }

    score(suburb) {
        let score = 0;
        this.services.filter(v => v.active).forEach((s) => {
            let serviceScore = suburb[s.id];
            let nServiceScore = serviceScore / suburb.population;
            if (s.good) {
                score += nServiceScore;
            } else {
                score -= nServiceScore;
            }
        });
        suburb.score = Math.round(score * 1000);
    }

    updateActive(active, hs) {
        hs.active = active;
        this.suburbs.forEach((s) => {
           this.score(s);
        });
        this.sortSuburbs();
        this.redraw = true;
        this.cd.detectChanges();
        this.redraw = false;
    }

    sortSuburbs() {
        this.suburbs.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            }
            if (a.score < b.score) {
                return 1;
            }
            return 0;
        });
    }
}
