import {Component} from '@angular/core';
import {SearchService} from "./search.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchService]
})

export class SearchComponent {
  items: any = [];
  categories: any = [];
  selectedCategory: string;
  defOptions: any = {
    'rows': '15',
    'start': '0'
  };
  numFound: number = 0;
  defOptionsRows = this.defOptions.rows;

  constructor(private searchService: SearchService) {}

  getPageCount() {
    return Math.ceil(this.numFound / this.defOptions.rows);
  }

  searchByCategory(term: string, category: string) {
    this.defOptions.start = '0';
    this.selectedCategory = category;
    if (category != 'All') {
      this.defOptions['fq'] = 'bucketName_s:' + category;
    } else {
      delete this.defOptions['fq'];
    }
    this.getItemsWithOptions(term);
  }

  searchAll(term: string) {
    this.defOptions.start = '0';
    this.selectedCategory = 'All';
    this.loadCategories(term);
    this.getItemsWithOptions(term);
  }

  loadCategories(term: string) {
    delete this.defOptions['fq'];
    this.searchService.getItems(term, this.defOptions).subscribe(data => {
      let res = data.json();
      let bucketName = res.facet_counts.facet_fields.bucketName_s;
      this.numFound = res.response.numFound;
      this.categories = [{
        'item': 'All',
        'count': this.numFound
      }];
      for (let i = 0; i < bucketName.length; i += 2) {
        let obj = {};
        obj['item'] = bucketName[i];
        obj['count'] = bucketName[i + 1];
        this.categories.push(obj);
      }
    });
  }

  getItemsWithOptions(term: string) {
    this.searchService.getItems(term, this.defOptions).subscribe(data => {
      let res = data.json();
      this.items = res.response.docs;
      this.numFound = res.response.numFound;
    });
  }

  navigateToPrevious(term: string) {
    if (this.defOptions.start != 0) {
      this.defOptions.start -= this.defOptions.rows;
      this.getItemsWithOptions(term);
    }
  }

  navigateToNext(term: string) {
    if (this.defOptions.start < this.numFound - this.defOptions.rows) {
      this.defOptions.start = +this.defOptions.start + +this.defOptions.rows;
      this.getItemsWithOptions(term);
    }
  }

  showItems(term: string, amount: string) {
    this.defOptions.rows = amount;
    this.getItemsWithOptions(term);
  }
}
