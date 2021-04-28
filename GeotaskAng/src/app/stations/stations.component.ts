import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import{ GlobalConstants } from '../global-constants';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackbarComponent } from 'src/app/home/error-snackbar/error-snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {
  displayedColumns: string[] = ['idstation','station','identification','address','latitude','longitude','city','phone','is_active','button'];
  dataSource;
  form: FormGroup;
  stations;
  cities;
  isAdd=true;
  isLoading=false;
  formCreate=false;
  element;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient,private formBuilder: FormBuilder, private snackBar: MatSnackBar,private router: Router) {
  
  }

  ngOnInit(): void {
    this.isLoading=true;
    
    this.http.get('http://'+GlobalConstants.report_server_address+'/stations', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.stations=response;
      this.UpdateTable();
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/cities', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.cities=response;
    });
    
    this.buildForm();
    this.isLoading=false;
  }


  UpdateTable(){
    this.dataSource=new MatTableDataSource(this.stations);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buildForm(){
    this.form = this.formBuilder.group({
      station: [null, [Validators.required]],
      identification: [null, [Validators.required]],
      address: [null,[Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      idcity: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearMe(): void {
    this.form.reset();
    Object.keys(this.form.controls).forEach(key =>{
       this.form.controls[key].setErrors(null)
    });
  }

  toggleCreate(){
    if (this.formCreate) {
      this.formCreate = false;
      this.isAdd = false;
    } else {
      this.formCreate = true;
      this.isAdd= true;
      this.element=null;
    }
    this.clearMe();
  }
 
  findStation(idstation): any{
    let a=null;
    this.stations.forEach(element => {
      if(element.idstation == idstation){
        a=element;
      }
    });
    return a;
  }
  
  onSubmit(event) {
    event.preventDefault();
    let info=this.form.value;
    info.phone=info.phone.toString();
    info.idcity=parseInt(info.idcity);
    if(this.form.valid){
      if (this.isAdd) {
        info['is_active']=true;
        this.http.post('http://'+GlobalConstants.report_server_address+'/stations', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'json'
        }).subscribe(response => {
          let value : any = response;
          value['city']=this.searchCity(value.idcity);
          this.stations.push(value);
          this.UpdateTable();
          this.clearMe();
          this.openSnackBar('Se ha creado la sede de forma exitosa!','success');
        });
      }else{
        info.is_active=this.element.is_active;
        let s=this.findStation(this.element.idstation);
        let index: number = this.stations.indexOf(s);
        info['idstation']=this.element.idstation;
        this.http.put('http://'+GlobalConstants.report_server_address+'/stations', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
          }).subscribe(response => {
            this.stations[index].station=info.station;
            this.stations[index].identification=info.identification;
            this.stations[index].address=info.address;
            this.stations[index].latitude=info.latitude;
            this.stations[index].longitude=info.longitude;
            this.stations[index].idcity=info.idcity.toString();
            this.stations[index].city=this.searchCity(info.idcity);
            this.stations[index].phone=info.phone;
            this.UpdateTable();
            this.openSnackBar('Se ha modificado la sede de forma exitosa!','success');
          });
        this.clearMe();
      }
    }else{
      this.openSnackBar('El formulario se encuentra incompleto!','error');
    }
  }


  DeleteStation(station): void{
    let index: number = this.stations.indexOf(station);
    let delet;
    if(index !== -1){
      delet=this.stations[index];
    }
    this.http.get('http://'+GlobalConstants.report_server_address+'/stations/delete', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'})
      ,
      params: new HttpParams().set("id",delet.idstation)
    }).subscribe(response => {
      let u=response;
      this.stations[index].is_active=false;
      this.UpdateTable();
      this.isLoading = false;
      this.openSnackBar('Se ha eliminado el registro de forma exitosa!','success');
    });
  }

  EditStation(element){
    if(this.formCreate){
      this.toggleCreate();
    }
    this.toggleCreate();
    this.isAdd=false;
    this.element=element;
    this.form.setValue({
      station: element.station,
      identification: element.identification,
      address: element.address,
      latitude: element.latitude,
      longitude: element.longitude,
      idcity: element.idcity.toString(),
      phone: element.phone
    });
  }

  searchCity(idcity){  
    let a;
    this.cities.forEach(element => {
      if(element.idcity==idcity){
        a=element.city;
      }
    });
    return a;
  }

  openSnackBar(Message: string,option: string) {
    this.snackBar.openFromComponent(ErrorSnackbarComponent, {
      duration: 5* 1000,
      data: Message,
      panelClass : [option]
    });
  }

  goBack(){
    this.router.navigate(['/config']);
  }
}
