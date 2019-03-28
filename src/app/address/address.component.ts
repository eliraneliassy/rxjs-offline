import {of} from 'rxjs';
import {skip} from 'rxjs/operators';
import { Address } from './../address.interface';
import { ApiService } from './../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { states } from './states';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  STORAGE_KEY = '__addressForm__';

  states = states;
  hasUnitNumber = false;

  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    address2: null,
    city: [null, Validators.required],
    state: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    ],
    shipping: ['free', Validators.required]
  }, { updateOn: 'blur' });


  constructor(private fb: FormBuilder, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadFormData().subscribe((address: Address) => {
      if (address) {
        this.addressForm.patchValue(address);
      }
    });

    this.addressForm.valueChanges.subscribe((formData) => {
      this.saveFormData(formData);
    });

  }

  loadFormData() {
    const formData = localStorage.getItem(this.STORAGE_KEY);
    if (formData) {
      return of(JSON.parse(formData));
    }
    return this.apiService.getAddress();
  }

  saveFormData(formData) {
    this.apiService.saveAddress(formData).subscribe();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formData));
  }

  onSubmit() {
    alert('Thanks!');
  }

}
