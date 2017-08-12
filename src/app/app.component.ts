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

    constructor(private cd: ChangeDetectorRef,
                private ds: DataService) {

    }

    ngOnInit() {
        this.ds.getSuburbs().subscribe(v => {
            this.suburbs = v;
            this.suburbs.forEach(s => {
                this.ds.getSuburbServices(s.postcode).subscribe(ss => {
                    Object.keys(ss).forEach((key) => {
                        s[key] = ss[key];
                    });
                    this.cd.detectChanges();
                });
            });
        });

        this.ds.getServices().subscribe(v => {
            this.services = v;
        });
    }
}
