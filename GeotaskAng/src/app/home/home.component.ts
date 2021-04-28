import { Component, OnInit , EventEmitter, AfterViewInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import{ GlobalConstants } from '../global-constants';

import { Router } from '@angular/router';
import { MarkerDialogComponent } from './marker-dialog/marker-dialog.component';
import { ConfigurationComponent } from '../configuration/configuration.component';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, transform } from 'ol/proj';

import { StatusService } from '../start/status.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from 'src/app/home/error-snackbar/error-snackbar.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  map: Map;
  companies;
  isLoading=false;
  markersArray = [];
  vectorSource;
  vectorLayer;
  SNACKBAR_DURATION = 5;

  constructor(private http: HttpClient,private markerDialog:MatDialog, private snackBar: MatSnackBar,private router: Router){

  }

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    this.isLoading=true;
    this.http.get('http://'+GlobalConstants.report_server_address+'/stations', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.companies=response;
      this.companies.forEach(comp => {
        const marker= new OlFeature({
          geometry: new OlPoint(fromLonLat([comp.longitude, comp.latitude])),
            id: comp.idstation,
            data: comp
        });
        marker.setStyle(new Style({
          image: new Icon(({
            anchorOrigin: 'top-right',
            crossOrigin: 'anonymous',
            scale: 1,
            opacity: 0.8,
            // size: '50px',
            src: '../../assets/industryMarker.svg'
          }))
        }));
        this.markersArray.push(marker);
      });
  
      this.vectorSource = new OlVectorSource({
        features: this.markersArray
      });
  
      this.vectorLayer = new OlVectorLayer({
        source: this.vectorSource
      });
  
      this.map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
          }),
          this.vectorLayer
        ],
        view: new View({
          center: fromLonLat([-74.0817500, 4.6097100]),
          maxZoom: 19,
          zoom: 15
        })
      });
  
      this.map.on('click', (event) => {
        const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
          this.openMarkerDialog(feature);
         
        });
      });
  
      this.isLoading=false;
    });
    
  }

  openSnackBar(Message: string,option: string) {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      duration: this.SNACKBAR_DURATION * 1000,
      data: Message,
      panelClass : [option]
    });
  }

  openMarkerDialog(feature){
    const dialogRef = this.markerDialog.getDialogById(feature.values_.id);
    if(dialogRef){
      this.openSnackBar('La ventana de la sede '+feature.values_.data.identification+' ya esta abierta.','error');
    }else{
      this.markerDialog.open(MarkerDialogComponent ,{
        id:feature.values_.id,
        width: '700px',
        disableClose: true,
        hasBackdrop: false,
        data: feature.values_
      });
    }
  }

  openSettings(){
    this.router.navigate(['/config']);
  }

  logOut(): void {
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
    this.isLoading = false;
  }
}
