import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShipStationService {
  constructor(public http: HttpClient) {
    console.log('Hello ShipStation Service');
  }

  createOrders(order): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = 'https://get-paper.herokuapp.com/ship-station/send-order';
      const body = order;
      this.http.post(url, body).subscribe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          console.log('Data ', data);
          resolve(data);
        },
        err => {
          console.log('Error ', err);
          reject(err);
        }
      );
    });
  }
}
