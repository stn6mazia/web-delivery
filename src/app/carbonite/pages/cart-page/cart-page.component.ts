import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { map } from 'rxjs/operators';
import { Address } from '../../shared/address';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  addAddressForm

  cartItems
  address: Address = new Address();

  subTotal
  deliveryPrice = 0

  userAddresses

  showCOmplements = false
  showCOmplementsId

  constructor(
    private router: Router,
    private userService: UsersService,
    private addressService: AddressService
  ) { }

  ngOnInit() {
    this.cartItems = JSON.parse(sessionStorage.getItem('cartItems'))
    this.getSubTotal()
    this.getUserAddresses()
  }

  getUserAddresses() {
    this.userService.getUsersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(users => {
      for (let i = 0; i < users.length; i++) {
        if (users[i].key === sessionStorage.getItem('userKey')) {
          if (users[i].address) {
            this.userAddresses = users[i].address
          } else {
            this.userAddresses = null
          }
        }
      }

    });
  }

  removeItem(key) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].cartItemId == key) {
        this.cartItems.splice(i, 1)
      }
    }


    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems))

    if (sessionStorage.getItem('cartItems') === '[]') {
      sessionStorage.removeItem('cartItems')
    }

    this.getSubTotal()
  }

  getSubTotal() {
    if (!sessionStorage.getItem('cartItems')) {

      this.subTotal = 0
    } else {

      let cart = JSON.parse(sessionStorage.getItem('cartItems'))
      const reducerPlus = (accumulator, currentValue) => accumulator + currentValue;



      let sum: any[] = []

      for (let i = 0; i < cart.length; i++) {
        sum.push(cart[i].price * cart[i].quantity)
      }
      this.subTotal = sum.reduce(reducerPlus)
    }
  }

  emptyCart() {
    sessionStorage.removeItem('cartItems')
    this.router.navigateByUrl('products')
  }

  changeitemQUantity(id, operator) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (id == this.cartItems[i].cartItemId) {
        if (operator === '+') {
          this.cartItems[i].quantity += 1
        } else {
          if (this.cartItems[i].quantity > 1) {
            this.cartItems[i].quantity -= 1
          } else {
            this.cartItems.splice(i, 1)
          }
        }
      }
    }

    sessionStorage.setItem('cartItems', JSON.stringify(this.cartItems))

    if (sessionStorage.getItem('cartItems') === '[]') {
      sessionStorage.removeItem('cartItems')
    }

    this.getSubTotal()
  }

  checkZip() {
    if (this.address.zip.length == 8) {
      this.addressService.getAddressByZip(this.address.zip).subscribe(
        res => {
          this.address.address = res.logradouro
          this.address.neightborhood = res.bairro
          this.address.city = res.localidade
          this.address.state = res.uf
        }
      )
    }
  }

  saveAddress() {
    let key = sessionStorage.getItem('userKey')
    this.userService.updateUser(
      key,
      {
        address: this.address
      }
    )
      .catch(err => console.log(err));
    this.addAddressForm = false
  }


}
