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
interface companiesObj{
  idcompany: Int16Array;
  company: String;
  idcompany_type: Int16Array;
  is_active: Boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})


export class UsersComponent implements OnInit {
  
  users;
  roles;
  companies: companiesObj[] = [];
  eps: companiesObj[] = [];
  arl: companiesObj[] = [];
  it;
  specialties;
  selectedValue: string;
  element;
  isLoading=false;
  displayedColumns: string[] = ['iduser','first_name','last_name','email','role','is_active','button'];
  dataSource;
  formCreate=false;
  isAdd=false;
  formDelete=false;
  form: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient,private formBuilder: FormBuilder, private snackBar: MatSnackBar,private router: Router) {
  
  }

  ngOnInit(): void {
    this.isLoading=true;
    
    this.http.get('http://'+GlobalConstants.report_server_address+'/users', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.users=response;
      this.UpdateTable();
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/roles', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.roles=response;
    });
    let companies;
    this.http.get('http://'+GlobalConstants.report_server_address+'/companies', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      companies=response;
      for(let obj of companies){
        let a=obj;
        switch(obj.idcompany_type){
          case(1):
            this.companies.push(obj);
            break;
          case(2):
            this.eps.push(obj);
            break;
          case(3):
            this.arl.push(obj);
            break;
        }
      }
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/identifications_types', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.it=response;
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/specialties', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.specialties=response;
    });
    this.buildForm();
    this.setRoleValidators();
    this.isLoading=false;
  }

  UpdateTable(){
    this.dataSource=new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  setRoleValidators(){
    const ididentification_typeControl= this.form.get('ididentification_type');
    const identificationControl= this.form.get('identification');
    const phoneControl=this.form.get('phone');
    const idspecialtyControl=this.form.get('idspecialty');
    const idcompanyControl=this.form.get('idcompany');
    const idepsControl=this.form.get('ideps');
    const idarlControl=this.form.get('idarl');
    const rhControl=this.form.get('rh');
    this.form.get('idrole').valueChanges.subscribe(idrole =>{
      let idrole2=parseInt(idrole);
      if(idrole2 == 3){
        ididentification_typeControl.setValidators([Validators.required]);
        identificationControl.setValidators([Validators.required]);
        phoneControl.setValidators([Validators.required]);
        idspecialtyControl.setValidators([Validators.required]);
        idcompanyControl.setValidators([Validators.required]);
        idepsControl.setValidators([Validators.required]);
        idarlControl.setValidators([Validators.required]);
        rhControl.setValidators([Validators.required]);
      }else{
        ididentification_typeControl.setValidators(null);
        identificationControl.setValidators(null);
        phoneControl.setValidators(null);
        idspecialtyControl.setValidators(null);
        idcompanyControl.setValidators(null);
        idepsControl.setValidators(null);
        idarlControl.setValidators(null);
        rhControl.setValidators(null);
      }

      ididentification_typeControl.updateValueAndValidity();
      identificationControl.updateValueAndValidity();
      phoneControl.updateValueAndValidity();
      idspecialtyControl.updateValueAndValidity();
      idcompanyControl.updateValueAndValidity();
      idepsControl.updateValueAndValidity();
      idarlControl.updateValueAndValidity();
      rhControl.updateValueAndValidity();
    })
  }



  buildForm(){
    this.form = this.formBuilder.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [this.isAdd ? Validators.required: Validators.nullValidator]],
      idrole: [null, [Validators.required]],
      ididentification_type: [null, null],
      identification: [null, null],
      phone: [null, null],
      idspecialty:[null, null],
      idcompany:[null, null],
      ideps:[null, null],
      idarl:[null, null],
      rh: [null,null]
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  EditUser(element){
    if(this.formCreate){
      this.toggleCreate();
    }
    this.toggleCreate();
    this.isAdd=false;
    this.element=element;
    this.selectedValue=element.idrole.toString();
    if(element.idrole==3){
      this.http.get('http://'+GlobalConstants.report_server_address+'/users_info/GetById', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'})
      ,
      params: new HttpParams().set("id",element.iduser)
      }).subscribe(response => {
        let obj: any = response;
        this.form.setValue({
          first_name : element.first_name,
          last_name : element.last_name,
          email : element.email,
          password : 'JIONEKDIOELFGJAH',
          idrole : element.idrole.toString(),
          ididentification_type: obj.ididentification_type.toString(),
          identification: obj.identification,
          phone: obj.phone,
          idspecialty: obj.idspecialty.toString(),
          idcompany:obj.idcompany.toString(),
          ideps:obj.ideps.toString(),
          idarl:obj.idarl.toString(),
          rh: obj.rh
        });
      });
    }else{
      this.form.setValue({
        first_name : element.first_name,
        last_name : element.last_name,
        email : element.email,
        password : 'JIONEKDIOELFGJAH',
        idrole : element.idrole.toString(),
        ididentification_type: null,
        identification: null,
        phone: null,
        idspecialty: null,
        idcompany:null,
        ideps:null,
        idarl:null,
        rh: ''
      });
    }
  }

  DeleteUser(user): void{
    let u=user;
    let index: number = this.users.indexOf(u);
    let delet;
    if(index !== -1){
      delet=this.users[index];
    }
    this.http.get('http://'+GlobalConstants.report_server_address+'/users/delete', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'})
      ,
      params: new HttpParams().set("id",delet.iduser)
    }).subscribe(response => {
      let u=response;
      this.users[index].is_active=false;
      this.UpdateTable();
      this.isLoading = false;
      this.openSnackBar('Se ha eliminado el registro de forma satisfactoria!','success');
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


  onSubmit(event) {
    event.preventDefault();
    let info=this.form.value;
    info.idrole=parseInt(info.idrole);
    if(this.form.valid){
      if (this.isAdd) {
        info['is_active']=true;
        this.http.post('http://'+GlobalConstants.report_server_address+'/users', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'json'
        }).subscribe(response => {
          let value : any = response;
          value.password_hash="";
          value.password_salt="";
          value.password="";
          value['role']=this.searchRole(value.idrole);
          this.users.push(value);
          this.UpdateTable();
          this.openSnackBar('Se ha creado el usuario de forma correcta!','success');
          if(info.idrole === 3){
            info.iduser = value.iduser;
            info.phone = info.phone.toString();
            info.identification = info.identification.toString();
            info.ididentification_type = parseInt(info.ididentification_type);
            info.idspecialty = parseInt(info.idspecialty);
            info.idcompany= parseInt(info.idcompany);
            info.idarl = parseInt(info.idarl);
            info.ideps = parseInt(info.ideps);
            this.http.post('http://'+GlobalConstants.report_server_address+'/users_info', info,{
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            responseType: 'text' as 'json'
            }).subscribe(response => {
              let a = response;
            });
          }
          this.clearMe();
        });
      }else{
        info.is_active=this.element.is_active;
        let u=this.findUser(this.element.iduser);
        let index: number = this.users.indexOf(u);
        info['iduser']=this.element.iduser;
        this.http.put('http://'+GlobalConstants.report_server_address+'/users', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
          }).subscribe(response => {
            this.users[index].first_name=info.first_name;
            this.users[index].last_name=info.last_name;
            this.users[index].idrole=info.idrole.toString();
            this.openSnackBar('Se ha modificado el usuario de forma correcta!','success');
            this.UpdateTable();
            if(info.idrole === 3){
              info.phone = info.phone.toString();
              info.identification = info.identification.toString();
              info.ididentification_type = parseInt(info.ididentification_type);
              info.idspecialty = parseInt(info.idspecialty);
              info.idcompany= parseInt(info.idcompany);
              info.idarl = parseInt(info.idarl);
              info.ideps = parseInt(info.ideps);
              this.http.put('http://'+GlobalConstants.report_server_address+'/users_info', info,{
              headers: new HttpHeaders({
                'Content-Type': 'application/json'
              }),
              responseType: 'text' as 'json'
              }).subscribe(response => {
                let a = response;
              });
            }
          });
        this.clearMe();
      }
    }else{
      this.openSnackBar('El formulario esta incompleto','error');
    }
  }



  clearMe(): void {
    this.form.reset();
    Object.keys(this.form.controls).forEach(key =>{
       this.form.controls[key].setErrors(null)
    });
  }

  findUser(iduser): any{
    let a=null;
    this.users.forEach(element => {
      if(element.iduser == iduser){
        a=element;
      }
    });
    return a;
  }

  searchRole(idrole){
    let a;
    this.roles.forEach(element => {
      if(element.idrole==idrole){
        a=element.role;
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


