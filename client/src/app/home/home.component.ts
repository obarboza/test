import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../providers/product.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'price', 'amount', 'iva8', 'iva16', 'ieps', 'total'];
  lstProducts: Product[];
  tableshow = false;
  fileToUpload: File = null;
  fileName = 'test.xlsx';
  data: any[][];
  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getIVA8(prod: Product) {
    return prod.iva8 ? (prod.price * prod.amount * 0.08) : 0;
  }
  getIVA16(prod: Product) {
    return prod.iva16 ? (prod.price * prod.amount * 0.16) : 0;
  }
  getIEPS(prod: Product) {
    return prod.price * prod.amount * prod.ieps;
  }
  getTotal(prod: Product) {
    return (prod.price * prod.amount) +
      this.getIVA16(prod) +
      this.getIVA8(prod) +
      this.getIEPS(prod);
  }
  getTotalProducts() {
    let amount = 0;
    this.lstProducts.forEach(prod => {
      amount += this.getTotal(prod);
    });
    return amount;
  }
  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      data => {
        this.lstProducts = data;
        this.tableshow = true;
      });
  }
  handleFileInput(files: FileList) {
    console.log(files);
    this.fileToUpload = files.item(0);
  }
  upLoadProduct() {
    this.productService.setProducts(this.fileToUpload).subscribe(data => {
      console.log(data);
    });
  }
  convertListProduct() {
    const rows = this.lstProducts.length + 2;
    const colums = 8;
    this.data = [];
    console.log(this.data);
    this.data.push([
      'Nombre',
      'Descripción',
      'Precío',
      'Cantidad',
      'IVA8',
      'IVA16',
      'IEPS',
      'Total']);
    this.lstProducts.forEach(prod => {
      this.data.push([
        prod.name,
        prod.description,
        prod.price,
        prod.amount,
        this.getIVA8(prod),
        this.getIVA16(prod),
        this.getIEPS(prod),
        this.getTotal(prod)]);
    });
    this.data.push([
      '',
      '',
      '',
      '',
      '',
      '',
      'TOTAL:',
      this.getTotalProducts()]);

  }
  export() {
    this.convertListProduct();
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, this.fileName);
  }
  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

}
