import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import{ GlobalConstants } from '../global-constants';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  displayedColumns: string[] = ['idcompany','company','company_type','is_active','button'];
  dataSource;
  form: FormGroup;
  companies;
  companies_types;
  isAdd=true;
  isLoading=false;
  formCreate=false;
  element;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient,private formBuilder: FormBuilder) {
  
  }
  ngOnInit(): void {
    this.isLoading=false;
    this.http.get('http://'+GlobalConstants.report_server_address+'/companies', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.companies=response;
      this.UpdateTable();
    });
    this.http.get('http://'+GlobalConstants.report_server_address+'/companies_types', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(response => {
      this.companies_types=response;
    });
    this.buildForm();
    this.isLoading=false;
  }

  UpdateTable(){
    this.dataSource=new MatTableDataSource(this.companies);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buildForm(){
    this.form = this.formBuilder.group({
      company: [null, [Validators.required]],
      idcompany_type: [null, [Validators.required]]
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

  findCompany(idcompany): any{
    let a=null;
    this.companies.forEach(element => {
      if(element.idcompany == idcompany){
        a=element;
      }
    });
    return a;
  }

  onSubmit(event) {
    event.preventDefault();
    let info=this.form.value;
    info.idcompany_type=parseInt(info.idcompany_type);
    if(this.form.valid){
      if (this.isAdd) {
        info['is_active']=true;
        this.http.post('http://'+GlobalConstants.report_server_address+'/companies', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'json'
        }).subscribe(response => {
          let value : any = response;
          value['company_type']=this.searchCompanyType(value.idcompany_type);
          this.companies.push(value);
          this.UpdateTable();
          this.clearMe();
        });
      }else{
        info.is_active=this.element.is_active;
        let s=this.findCompany(this.element.idcompany);
        let index: number = this.companies.indexOf(s);
        info['idcompany']=this.element.idcompany;
        this.http.put('http://'+GlobalConstants.report_server_address+'/companies', info,{
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          }),
          responseType: 'text' as 'json'
          }).subscribe(response => {
            this.companies[index].company=info.company;
            this.companies[index].idcompany_type=info.idcompany_type.toString();
            this.companies[index].city=this.searchCompanyType(info.idcompany_type);
            this.UpdateTable();
          });
        this.clearMe();
      }
    }
  }

  DeleteCompany(company): void{
    let index: number = this.companies.indexOf(company);
    let delet;
    if(index !== -1){
      delet=this.companies[index];
    }
    this.http.get('http://'+GlobalConstants.report_server_address+'/companies/delete', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'})
      ,
      params: new HttpParams().set("id",delet.idcompany)
    }).subscribe(response => {
      let u=response;
      this.companies[index].is_active=false;
      this.UpdateTable();
      this.isLoading = false;
    });
  }

  EditCompany(element){
    if(this.formCreate){
      this.toggleCreate();
    }
    this.toggleCreate();
    this.isAdd=false;
    this.element=element;
    this.form.setValue({
      company: element.company,
      idcompany_type: element.idcompany_type.toString()
    });
  }

  searchCompanyType(idcompany_type){  
    let a;
    this.companies_types.forEach(element => {
      if(element.idcompany_type==idcompany_type){
        a=element.company_type;
      }
    });
    return a;
  }
}
