import { Component, Input, OnInit } from '@angular/core';
import * as dc from 'dc';
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';
import * as reductio from 'reductio';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
    @Input() data: any[];

    constructor() {
    }

    ngOnInit() {
        window.setTimeout(() => {
            this.drawCharts();
        }, 1600);
    }

    drawCharts() {
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Suburb Scores'
            },
            xAxis: {
                categories: this.data.map(v => v.place_name)
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Score',
                data: this.data.map(v => v.score)
            }]
        });

        Highcharts.chart('scatter', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Score Vs Unhealthy'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Score'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Unhealthy'
                }
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                }
            },
            series: [{
                name: 'Data',
                color: 'rgba(223, 83, 83, .5)',
                data: this.data.map(v => [v.score, v.poor_health])

            }]
        });

        Highcharts.chart('obese', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: 'Score Vs Obesity'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Score'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Obesity'
                }
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                }
            },
            series: [{
                name: 'Data',
                color: 'rgba(223, 83, 83, .5)',
                data: this.data.map(v => [v.score, v.obese])

            }]
        });
    }
}
