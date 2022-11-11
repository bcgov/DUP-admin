import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FacilityService } from 'src/app/services/facility.service';
import { FormService } from 'src/app/services/form.service';
import { LoadingService } from 'src/app/services/loading.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';

@Component({
  selector: 'app-facility-edit-form',
  templateUrl: './facility-edit-form.component.html',
  styleUrls: ['./facility-edit-form.component.scss'],
})
export class FacilityEditFormComponent extends BaseFormComponent {
  public facility;
  public park;

  public bookingDaysFormArray;
  public bookingOpeningHourFormGroup;
  public isEditMode = new BehaviorSubject<boolean>(true);
  public facilityBookingDaysArray: any[] = [];

  public defaultBookingDaysRichText =
    '<p>You don&rsquo;t need a day-use pass for this date and pass type. Passes may be required on other days and at other parks.</p>';

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected formService: FormService,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    private facilityService: FacilityService,
    private route: ActivatedRoute
  ) {
    super(
      formBuilder,
      formService,
      router,
      dataService,
      loadingService,
      changeDetector
    );
    this.subscriptions.add(
      this.dataService
        .watchItem(Constants.dataIds.CURRENT_FACILITY)
        .subscribe((res) => {
          if (res && res[0]) {
            this.facility = res[0];
            this.data = this.facility;
            this.setForm();
          } else {
            this.isEditMode.next(false);
          }
        })
    );
    this.subscriptions.add(
      dataService.watchItem(Constants.dataIds.CURRENT_PARK).subscribe((res) => {
        if (res && res[0]) {
          this.park = res[0];
        }
      })
    );
    this.intializeForm();
  }

  getPassesRequired() {
    if (this.data?.bookingDays) {
      for (const day in this.data.bookingDays) {
        if (!this.data.bookingDays[day]) {
          return true;
        }
      }
    }
    return false;
  }

  isFormValid() {
    return super.validate();
  }

  intializeForm() {
    // First pass of form initialization, establish disabledRules (if any)
    this.setForm();
    // add special field disabling rules
    super.addDisabledRule(this.fields.facilityName, this.isEditMode, [true]);
    super.addDisabledRule(this.fields.facilityType, this.isEditMode, [true]);
    super.addDisabledRule(
      this.fields.facilityClosureReason,
      this.fields.facilityStatus.valueChanges,
      [true]
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.capacityAM,
      this.fields.facilityBookingTimes.AM.valueChanges,
      [false, null]
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.capacityPM,
      this.fields.facilityBookingTimes.PM.valueChanges,
      [false, null]
    );
    super.addDisabledRule(
      this.fields.facilityBookingTimes.capacityDAY,
      this.fields.facilityBookingTimes.DAY.valueChanges,
      [false, null]
    );
  }

  setForm() {
    // Create booking days subform:
    let bookableDaysFormGroup = new UntypedFormGroup({
      Monday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['1'] : true
      ),
      Tuesday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['2'] : true
      ),
      Wednesday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['3'] : true
      ),
      Thursday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['4'] : true
      ),
      Friday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['5'] : true
      ),
      Saturday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['6'] : true
      ),
      Sunday: new UntypedFormControl(
        this.data.bookingDays ? this.data.bookingDays['7'] : true
      ),
    });
    // Create booking time capacities subform
    let bookingTimesFormGroup = new UntypedFormGroup({
      AM: new UntypedFormControl(this.data.bookingTimes?.AM ? true : false),
      PM: new UntypedFormControl(this.data.bookingTimes?.PM ? true : false),
      DAY: new UntypedFormControl(this.data.bookingTimes?.DAY ? true : false),
      capacityAM: new UntypedFormControl(
        this.data.bookingTimes?.AM?.max || null
      ),
      capacityPM: new UntypedFormControl(
        this.data.bookingTimes?.PM?.max || null
      ),
      capacityDAY: new UntypedFormControl(
        this.data.bookingTimes?.DAY?.max || null
      ),
    });
    // Create base form
    this.form = new UntypedFormGroup({
      facilityStatus: new UntypedFormControl(
        this.data.status?.state === 'open' ? true : false
      ),
      facilityClosureReason: new UntypedFormControl(
        this.data.status?.stateReason || null
      ),
      facilityVisibility: new UntypedFormControl(this.data.visible),
      facilityName: new UntypedFormControl(this.data.name, Validators.required),
      facilityType: new UntypedFormControl(this.data.type, Validators.required),
      facilityBookingOpeningHour: new UntypedFormControl({
        hour: this.data.bookingOpeningHour || 7,
        minute: 0,
        second: 0,
      } as NgbTimeStruct),
      facilityBookingDaysAhead: new UntypedFormControl(
        this.data.bookingDaysAhead
      ),
      facilityBookingDaysRichText: new UntypedFormControl(
        this.data
          ? this.data.bookingDaysRichText
          : this.defaultBookingDaysRichText
      ),
      facilityBookingDays: bookableDaysFormGroup,
      facilityBookingTimes: bookingTimesFormGroup,
      facilityPassesRequired: new UntypedFormControl(this.getPassesRequired()),
    });
    super.setFields();
  }

  async onSubmit() {
    let res = await super.submit();
    if (res.invalidControls.length === 0) {
      const postObj = this.formatFormResults(res.fields);
      if (this.isEditMode.value === true) {
        this.facilityService.putFacility(postObj, this.park.sk);
      } else {
        this.facilityService.postFacility(postObj, this.park.sk);
      }
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  // format form fields for API submission
  formatFormResults(results) {
    // create bookingTimes subObject
    let resultTimes = {};
    if (
      results.facilityBookingTimes?.AM &&
      results.facilityBookingTimes?.capacityAM
    ) {
      resultTimes['AM'] = {
        max: results.facilityBookingTimes.capacityAM,
      };
    }
    if (
      results.facilityBookingTimes?.PM &&
      results.facilityBookingTimes?.capacityPM
    ) {
      resultTimes['PM'] = {
        max: results.facilityBookingTimes.capacityPM,
      };
    }
    if (
      results.facilityBookingTimes?.DAY &&
      results.facilityBookingTimes?.capacityDAY
    ) {
      resultTimes['DAY'] = {
        max: results.facilityBookingTimes.capacityDAY,
      };
    }
    // create API submission object
    const postObj = {
      name: results.facilityName,
      status: {
        state: results.facilityStatus ? 'open' : 'closed',
        stateReason: results.facilityClosureReason,
      },
      type: results.facilityType,
      visible: results.facilityVisibility,
      bookingTimes: resultTimes,
      bookingOpeningHour: results.facilityBookingOpeningHour?.hour,
      bookingDaysAhead: results.facilityBookingDaysAhead,
      bookingDays: {
        1: results.facilityBookingDays.Monday,
        2: results.facilityBookingDays.Tuesday,
        3: results.facilityBookingDays.Wednesday,
        4: results.facilityBookingDays.Thursday,
        5: results.facilityBookingDays.Friday,
        6: results.facilityBookingDays.Saturday,
        7: results.facilityBookingDays.Sunday,
      },
      bookingDaysRichText: results.facilityBookingDaysRichText || '',
      bookableHolidays: [],
    };
    return postObj;
  }
}
