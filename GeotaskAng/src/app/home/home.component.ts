import { Component, OnInit , EventEmitter, AfterViewInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Icon, Text } from 'ol/style';
import Map from 'ol/Map';
import { proj, View } from 'ol';
import OlFeature from 'ol/Feature';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OlPoint from 'ol/geom/Point';
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
  isLoading = false;
  token;
  vectorSource;
  vectorLayer;
  companies;
  telefonica = [];
  marker;
  marker2;
  marker3;
  markersArray = [];
  markerStyle;
  alerts = [];
  SNACKBAR_DURATION = 5;
  private subscription: Subscription;
  public message;
  connection: boolean;
  controlVariable = 0;
  searchMenu = false;
  disableOption = false;
  redirectSearch = new EventEmitter();
  searchValue;
  listalert = [];  

  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
  }

}
