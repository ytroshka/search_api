import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";

@Injectable()
export class SearchService {

  constructor(private http: Http) {
  }

  getItems(term: string, options: any) {
    let url = 'http://relaunch-search.mtv.com/solr/mtv/select/';
    let params = new URLSearchParams();
    params.set('q', term);
    params.set('wt', 'json');
    params.set('fl', 'title_t,url_s,imageUrl_s,duration_s,title_t,labelName_s,contentDate_dt');
    params.set('defType', 'edismax');
    params.set('facet', 'on');
    params.set('facet.field', 'bucketName_s');
    params.set('facet.mincount', '1');
    for (let key in options) {
      params.set(key, options[key]);
    }
    return this.http.get(url, {search: params});
  }
}
