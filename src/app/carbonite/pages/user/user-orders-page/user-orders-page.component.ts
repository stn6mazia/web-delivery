import { Component, OnInit } from '@angular/core';
import { ordersService } from 'src/app/carbonite/services/order.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-orders-page',
  templateUrl: './user-orders-page.component.html',
  styleUrls: ['./user-orders-page.component.scss']
})
export class UserOrdersPageComponent implements OnInit {

  ordersList
  detailOrder

  haveOrder = false
  detail = false

  constructor(
    private ordersService: ordersService
  ) { }

  ngOnInit() {
    this.getOrders()
  }

  getOrders() {
    this.ordersService.getOrdersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(p =>
          ({ key: p.payload.key, ...p.payload.val() })
        )
      )
    ).subscribe(orders => {
      if(orders.length > 0) {
        this.ordersList = orders
        this.haveOrder = true
      } else {
        this.haveOrder = false
      }
    });
  }

  showDetail(key) {

    for(let i = 0; i < this.ordersList.length; i++) {
      if(this.ordersList[i].key === key) {
        this.detailOrder = this.ordersList[i]
        this.detail = true
      }
    }

  }

}
