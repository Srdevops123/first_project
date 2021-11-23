import { LightningElement, api, track, wire } from 'lwc';
import getCartProducts from '@salesforce/apex/koSiteController.getCartProducts';

import getTotalCartProductsAmount from '@salesforce/apex/koSiteController.getTotalCartProductsAmount';
import getCartCount from '@salesforce/apex/koSiteController.getCartCount';
import deletecart from '@salesforce/apex/koSiteController.deletecart';


import Kasmo_Logo from '@salesforce/resourceUrl/kasmologo';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import cartQuantityUpdate from '@salesforce/apex/koSiteController.cartQuantityUpdate';

import { createRecord } from 'lightning/uiRecordApi';

//REMOVE CART
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// //WISHLIST
import getWishlists from '@salesforce/apex/koSiteController.getWishlists';
// Address 
import createAddress from '@salesforce/apex/koSiteController.createAddress';
import getUserAddress from '@salesforce/apex/koSiteController.getUserAddress';
import getUserDefaultAddress from '@salesforce/apex/koSiteController.getUserDefaultAddress';
import updateUserDefaultAddress from '@salesforce/apex/koSiteController.updateUserDefaultAddress';

//order
import getAccount from '@salesforce/apex/orderController.getAccount';
import getAddress from '@salesforce/apex/orderController.getAddress';
import getOrders from '@salesforce/apex/orderController.getOrders';
import moveToOrder from '@salesforce/apex/orderController.moveToOrder';


function refreshPage() {
    location.reload();
}
export default class KoSiteCartListLwc extends NavigationMixin(LightningElement) {
    //Logo Url
    kasmologourl = Kasmo_Logo
    //user id
    totalAmount
    totalCartItems
    @wire(getCartProducts)
    cartproducts;
    @wire(getTotalCartProductsAmount)
    totalAmount;
    @wire(getCartCount)
    totalCartItems;
    //PROGRESS BAR
    @track currentStep
    goBackToStepOne() {
        this.currentStep = '1';
        this.template.querySelector('div.stepThree').classList.add('slds-hide');
        this.template.querySelector('div.stepTwo').classList.add('slds-hide');
        this.template
            .querySelector('div.stepOne')
            .classList.remove('slds-hide');
    }

    goToStepTwo() {
        this.currentStep = '2';
        this.template.querySelector('div.stepThree').classList.add('slds-hide');
        this.template.querySelector('div.stepOne').classList.add('slds-hide');
        this.template
            .querySelector('div.stepTwo')
            .classList.remove('slds-hide');
    }
    goToStepThree() {
        this.currentStep = '3';
        this.template.querySelector('div.stepOne').classList.add('slds-hide');
        this.template.querySelector('div.stepTwo').classList.add('slds-hide');
        this.template.querySelector('div.stepThree').classList.remove('slds-hide');
    }
    //Quantity

    @track quantity = 1;
    @track cartId;
    handleQtyChange(event) {
        this.quantity = event.target.value
        this.cartId = event.target.name
        // alert(event.target.name)
        cartQuantityUpdate({ CartId: this.cartId, Quantity: this.quantity })
            .then(result => {
                const event = new ShowToastEvent({
                    title: "Success!",
                    message: 'Quantity Updated',
                    variant: 'success',
                });
                this.dispatchEvent(event);
                refreshApex(this.totalAmount);
                refreshApex(this.totalAmount);


            })

            .catch(error => {
                this.error = error;
                console.log(this.error)
            });
    }

    connectedCallback() {
        refreshApex(this.cartproducts);
        refreshApex(this.totalCartItems);
        refreshApex(this.totalAmount);

    }

    //REMOVE CART
    @track error
    handleRemove(event) {
        this.cartId = event.target.name
        deleteRecord(this.cartId)
            .then(() => {
                const toastEvent = new ShowToastEvent({
                    title: 'Cart Deleted',
                    message: 'Cart removed successfully',
                    variant: 'success',
                })
                this.dispatchEvent(toastEvent);
                refreshApex(this.cartproducts);
                refreshApex(this.totalAmount);
                refreshApex(this.totalCartItems);
            })
            .catch(error => {
                window.console.log('Unable to delete record due to ' + error.body.message);
            });

    }
    //payment tabs methods

    paymentTabHadler() {
        this.template.querySelector('span.choosePaymentBaseTab').classList.add('selectedpaymentTab')
    }
    //GO TO WISHLIST
    goToWishlist() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Wishlist_Product__c',
                actionName: 'list'
            },
        });
    }

    //ADD TO WISHLIST
    @track wishproducts;
    @track error;
    wishlistProductVariantId
    wishlistdetails(event) {
        this.cartId = event.target.dataset.id;
        this.wishlistProductVariantId = event.target.name
        getWishlists({ productId: this.wishlistProductVariantId })
            .then(result => {
                this.wishproducts = result;
                const event = new ShowToastEvent({
                    title: "Success!",
                    message: 'Added to Wishlist',
                    variant: 'success',
                });
                this.dispatchEvent(event);
                deleteRecord(this.cartId)
                    .then(() => {
                        const toastEvent = new ShowToastEvent({
                            title: 'Cart Product Removed',
                            message: 'Cart Product Removed  successfully',
                            variant: 'success',
                        })
                        this.dispatchEvent(toastEvent);
                        refreshApex(this.cartproducts);
                        refreshApex(this.totalAmount);
                        refreshApex(this.totalCartItems);
                    })
                    .catch(error => {
                        window.console.log('Unable To remove  cart product Due To ' + error.body.message);
                    });

            })
            .catch(error => {
                this.error = error;
            });

    }
    homeHandler() {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            },
        });
    }
    @track productvaraintId
    productDetails(event) {
        this.productvaraintId = event.target.name
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.productvaraintId,
                objectApiName: 'Product2',
                actionName: 'view'
            }
        });
    }
    //adding user address

    @track openAddessModel
    createAddressHandler() {
        this.openAddessModel = true;
    }
    addressModelHandler() {
        this.openAddessModel = false;
    }
    @track contactName
    nameHandler(event) {
        this.contactName = event.target.value
    }
    @track contactPhoneNumber
    phoneNumberHandler(event) {
        this.contactPhoneNumber = event.target.value
    }
    @track pinCode
    pincodeHandler(event) {
        this.pinCode = event.target.value
    }
    @track street
    streetHandler(event) {
        this.street = event.target.value
    }
    @track locality
    localityHandler(event) {
        this.locality = event.target.value
    }
    @track city
    cityHandler(event) {
        this.city = event.target.value
    }
    @track state
    stateHandler(event) {
        this.state = event.target.value
    }
    @track addressType
    addressTypeHandler(event) {
        this.addressType = event.target.name
    }
    addressInputTypeHandler(event){
        this.addressType=event.target.value
    }
    addAdressHandler() {
        if (this.pinCode && this.street && this.locality && this.city && this.state && this.addressType && this.contactPhoneNumber && this.contactName) {
            createAddress({
                PinCode: this.pinCode, Street: this.street,
                Locality: this.locality, City: this.city, State: this.state, AddressType: this.addressType, ContactName: this.contactName, ContactPhone: this.contactPhoneNumber
            })
                .then(() => {
                    const toastEvent = new ShowToastEvent({
                        title: 'Address Added',
                        message: 'Address Added successfully',
                        variant: 'success',
                    })
                    this.dispatchEvent(toastEvent);
                    this.openAddessModel = false;
                    refreshApex(this.getUserAddress);
                })
                .catch(error => {
                    window.console.log('Unable To Add Address Due To ' + error.body.message);
                });
        } else {
            const toastEvent = new ShowToastEvent({
                title: 'Please provide all Values',
                message: 'Address Not Added',
                variant: 'error',
            })
            this.dispatchEvent(toastEvent);
        }
    }
    //get user address information
    @wire(getUserAddress)
    getUserAddress;
    //delete user Address
    @track userAddressId
    deleteAddressHandler(event) {
        this.userAddressId = event.target.name
        deleteRecord(this.userAddressId)
            .then(() => {
                const toastEvent = new ShowToastEvent({
                    title: 'Address Deleted',
                    message: 'Address removed successfully',
                    variant: 'success',
                })
                this.dispatchEvent(toastEvent);
                refreshApex(this.getUserAddress);
            })
            .catch(error => {
                window.console.log('Unable to delete Address due to ' + error.body.message);
            });

    }
    //edit address
    @track openEditAddressModal
    @track editAddressId
    editAddressHandler(event) {
        this.editAddressId = event.target.name
        this.openEditAddressModal = true
    }
    addressEditModelHandler() {
        this.openEditAddressModal = false
    }
    addressUpdateHandler() {
        this.openEditAddressModal = false
        const toastEvent = new ShowToastEvent({
            title: 'Address Updated',
            message: 'Address Updated Successfully',
            variant: 'success',
        })
        this.dispatchEvent(toastEvent);
        return refreshPage();
    }
    //change Address
    @track openChangeAddressModal
    changeAddressModalHandler() {
        this.openChangeAddressModal = true
    }
    changeAddressModelCloseHandler() {
        this.openChangeAddressModal = false
    }
    //get user default address
    @track getUserDefaultAddress
    @wire(getUserDefaultAddress)
    getUserDefaultAddress;
    //adding default address
    @track defaultAddressId
    addDefaultAddressHandler(event) {
        this.defaultAddressId = event.target.name
        if (this.defaultAddressId) {
            updateUserDefaultAddress({ DefaultAddress: this.defaultAddressId })
                .then(() => {
                    const toastEvent = new ShowToastEvent({
                        title: 'Address Changed',
                        message: 'Address Changed successfully',
                        variant: 'success',
                    })
                    this.dispatchEvent(toastEvent);
                    refreshApex(this.getUserDefaultAddress);
                    //return refreshPage();
                })
                .catch(error => {
                    window.console.log('Unable to delete Address due to ' + error.body.message);
                });
        }

    }


    AccId;


    @wire(getAccount) getAcc({ data, error }) {
        if (data) {
            console.log(data[0].Id);
            this.AccId = data[0].Id;
        }
    }

    
    addressId;
    @wire(getAddress) getadd({ data, error }) {
        if (data) {
            this.addressId=data[0].Id;
            
           
        }
    }
    OrderId;
    orderclick = false;

    placeorder = false;
    onplaceorderclick(event) {
        let today = new Date().toISOString().slice(0, 10);
    


        moveToOrder().then(result => {
            console.log(result);
            if (result.length !== 0) {
                var fields = { 'StartDate__c': today, Status__c: 'Draft','Contact_Address__c':this.addressId };
                var objRecordInput = { 'apiName': 'MyOrder__c', fields };
                createRecord(objRecordInput).then(response => {
                    this.OrderId = response.id;
                    this.orderclick = true;
                    this.placeorder = true;
                }).catch(error => {

                    console.log('Error: ' + JSON.stringify(error));
                });

            }
            else{
                this.orderclick = false;

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Unable to place order..!Your Cart is Empty',
                        variant: 'error',
                    }),
                );
            }
        });
    }



    oncancelclick(event) {
        this.orderclick = false;
        console.log(this.OrderId);
        deleteRecord(this.OrderId);
        // deleteorder({ oId: this.OrderId });

    }
    ordersuccess = true;
    onplace(event) {
        this.orderclick = false;

        moveToOrder().then(result => {
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    let varId = result[i].Product_Variant__r.Id;
                    let price = result[i].Product_Variant__r.Price__c;
                    let Qty = result[i].Quantity__c;
                    let cartId = result[i].Id;
                    const fields = { 'Product_Variant__c': varId, 'MyOrder__c': this.OrderId, 'Quantity__c': Qty, 'UnitPrice__c': price };
                    var objRecordInput = { 'apiName': 'OrderItems__c', fields };
                    createRecord(objRecordInput).then(response => {
                        if (response) {
                            this.ordersuccess = true;
                            deletecart({ cart: cartId });
                            refreshApex(this.cartproducts);
                        }
                        else {
                            this.ordersuccess = false;
                        }
                    });
                    if (this.ordersuccess && this.placeorder) {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: ' Order Placed  Successfully: ',
                                variant: 'success',
                            }),
                        );
                    }
                    else {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error',
                                message: ' Order Not Placed: ',
                                variant: 'error',
                            }),
                        );
                    }

                }
            }
        });
    }

//continue shopping
goToHome(){
    this[NavigationMixin.Navigate]({
        type: 'standard__namedPage',
        attributes: {
            pageName: 'home'
        },
    });
}

}