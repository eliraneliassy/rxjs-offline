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
    this.apiService.getAddress()
      .subscribe((address: Address) => {
        if (address) {
          this.addressForm.patchValue(address);
        }
      });

    this.addressForm.valueChanges.subscribe((form) => {
      this.apiService.saveAddress(form).subscribe();
    });

  }

  onSubmit() {
    alert('Thanks!');
  }

}
