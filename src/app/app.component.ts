import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { SelectItemGroup } from 'primeng/api';
import { FilterService } from 'primeng/api';
import { CountryService } from './countryservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [CountryService, FilterService],
})
export class AppComponent {
  selectedCountry: any;

  countries: any[];

  filteredCountries: any[];

  selectedCountries: any[];

  selectedCountryAdvanced: any[];

  filteredBrands: any[];

  groupedCities: SelectItemGroup[];

  filteredGroups: any[];

  constructor(
    private countryService: CountryService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.countryService.getCountries().then((countries) => {
      this.countries = countries;
    });

    this.ConvertSerialNumber('0146A23040032020KX6E 6049 A47B4');

    this.groupedCities = [
      {
        label: 'Germany',
        value: 'de',
        items: [
          { label: 'Berlin', value: 'Berlin' },
          { label: 'Frankfurt', value: 'Frankfurt' },
          { label: 'Hamburg', value: 'Hamburg' },
          { label: 'Munich', value: 'Munich' },
        ],
      },
      {
        label: 'USA',
        value: 'us',
        items: [
          { label: 'Chicago', value: 'Chicago' },
          { label: 'Los Angeles', value: 'Los Angeles' },
          { label: 'New York', value: 'New York' },
          { label: 'San Francisco', value: 'San Francisco' },
        ],
      },
      {
        label: 'Japan',
        value: 'jp',
        items: [
          { label: 'Kyoto', value: 'Kyoto' },
          { label: 'Osaka', value: 'Osaka' },
          { label: 'Tokyo', value: 'Tokyo' },
          { label: 'Yokohama', value: 'Yokohama' },
        ],
      },
    ];
  }

  public ConvertSerialNumber(numeroPieza: string): string {
    const sn: string = numeroPieza;
    let newSn: string = numeroPieza;
    const position15: string = sn.substring(15, 16);

    console.log('len' + sn.length);
    console.log(position15);

    if (sn.length === 22 && position15 == '4') {
      newSn = sn.substring(0, 21).replace('0146A', '1');
    }

    if (sn.length === 30 || sn.length === 31) {
      if (position15 == '0') {
        newSn = sn.substring(0, 16).replace('0146A', '8');
      }
      if (position15 == '8') {
        if (
          sn.includes('AG9E') ||
          sn.includes('EJ7E') ||
          sn.includes('FB5E') ||
          sn.includes('LR3E')
        ) {
          newSn = sn.substring(0, 28);
        }
      }
    }

    console.log('New serial number: ' + newSn);

    return newSn;
  }

  filterCountry(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.countries.length; i++) {
      let country = this.countries[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  filterGroupedCity(event) {
    let query = event.query;
    let filteredGroups = [];

    for (let optgroup of this.groupedCities) {
      let filteredSubOptions = this.filterService.filter(
        optgroup.items,
        ['label'],
        query,
        'contains'
      );
      if (filteredSubOptions && filteredSubOptions.length) {
        filteredGroups.push({
          label: optgroup.label,
          value: optgroup.value,
          items: filteredSubOptions,
        });
      }
    }

    this.filteredGroups = filteredGroups;
  }
}
