import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ParkService } from 'app/services/park.service';
import { IColumnObject } from 'app/shared/components/table-template/table-object';
import { takeWhile } from 'rxjs/operators';
import { ParkTableRowComponent } from './park-table-row/park-table-row.component';

@Component({
  selector: 'app-park-list',
  templateUrl: './park-list.component.html',
  styleUrls: ['./park-list.component.scss']
})
export class ParkListComponent implements OnInit, OnDestroy {
  private alive = true;
  // Component
  public loading = true;
  public data = [];
  public totalListItems = 0;
  public options = {
    showHeader: true,
    showPagination: true,
    showPageSizePicker: false,
    showPageCountDisplay: false,
    disableRowHighlight: false,
    showTopControls: true,
    rowSpacing: 0
  };

  public tableRowComponent = ParkTableRowComponent;

  // Table
  public tableColumns: IColumnObject[] = [
    {
      name: 'Name',
      value: 'name',
      width: 'col-6',
      nosort: true
    },
    {
      name: 'Status',
      value: 'status',
      width: 'col-5',
      nosort: true
    },
    {
      name: '',
      value: '',
      width: 'col-1',
      nosort: true
    }
  ];

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private parkService: ParkService
  ) { }

  ngOnInit() {
    this.parkService.getListValue()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res) => {
        if (res) {
          this.data = res.map(item => {
            return { rowData: item };
          });
          this.totalListItems = this.data.length;
          this.loading = false;
          this._changeDetectionRef.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
