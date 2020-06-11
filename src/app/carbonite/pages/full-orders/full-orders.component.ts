import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ordersService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Order } from '../../shared/order';
import * as moment from 'moment'

@Component({
  selector: 'app-full-orders',
  templateUrl: './full-orders.component.html',
  styleUrls: ['./full-orders.component.scss']
})
export class FullOrdersComponent implements OnInit {

  orderType = 'Em andamento'

  ordersList
  detailOrder
  
  ShowDoneOrders = false

  activeOrders: any[] = []
  preparingOrders: any[] = []
  doneOrders: any[] = []
  payedOrders: any[] = []

  haveOrder = false
  detail = false

  draggable = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost 
    data: "myDragData",
    effectAllowed: "all",
    disable: false,
    handle: false
  };

  constructor(
    private ordersService: ordersService,
    private router: Router
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
      if (orders.length > 0) {
        for(let i = 0; i < orders.length; i++) {
          if(orders[i].status == 1) {
            this.activeOrders.push(orders[i])
          }
          if(orders[i].status == 2) {
            this.preparingOrders.push(orders[i])
          }
          if(orders[i].status == 3) {
            this.doneOrders.push(orders[i])
          }
          if(orders[i].status == 4) {
            this.payedOrders.push(orders[i])
          }
           
        }
        this.haveOrder = true
      } else {
        this.haveOrder = false
      }
    });
  }

  aproveOrder(key) {

    this.ordersService.updateOrder(key, {status: 2, updateDate: moment().format('DD-MM-YYYY HH:mm')})
    window.location.reload()
  }
  
  doneOrder(key, name, phone) {

    window.location.href = 'https://api.whatsapp.com/send?phone=55' + phone + '&text=Ol%C3%A1%20' + name + '%2C%20seu%20lanche%20ta%20pronto%2C%20por%20favor%2C%20venha%20buscar!'

    this.ordersService.updateOrder(key, {status: 3, updateDate: moment().format('DD-MM-YYYY HH:mm')})
    window.location.reload()
  } 

  payedOrder(key) {


    this.ordersService.updateOrder(key, {status: 4, payment: true , updateDate: moment().format('DD-MM-YYYY HH:mm')})
    window.location.reload()
  } 

  detailPage(key) {
    this.router.navigateByUrl('order/' + key)
    sessionStorage.setItem('orderDetailId', key)
  }

  logout() {
    sessionStorage.clear()
    window.location.reload()
  }

}
