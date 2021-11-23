import { LightningElement,wire,api,track } from 'lwc';
import getProductsWithVarients from '@salesforce/apex/koSiteController.getProductsWithVarients';
import getProducts from '@salesforce/apex/koSiteController.getProducts';
import { NavigationMixin } from 'lightning/navigation';
import Carousel_Men from '@salesforce/resourceUrl/MenCarousal';
import Carousel_Women from '@salesforce/resourceUrl/WomenCarousal';
import Carousel_Beauty from '@salesforce/resourceUrl/BeautyCarousal';
import Carousel_Kids from '@salesforce/resourceUrl/KidsCarousal';
export default class KoSiteCategoryProductVariantsLwc extends NavigationMixin(LightningElement) {
    //carosel images
    carousel={
        carouselMen:Carousel_Men,
        carouselWomen:Carousel_Women,
        carouselBeauty:Carousel_Beauty,
        carouselKids:Carousel_Kids
    }
    @api recordId
    /*@wire (getProductsWithVarients,{selectedRecordId:'$recordId'})
    productsWithVarients;*/
     //Pagination
     /** Current page in the product list. */
   pageNumber = 1;
   /** The number of items on a page. */
   pageSize;
   /** The total number of items matching the selection. */
   totalItemCount = 0; 
    //products based on category
    @wire (getProducts,{category:'$recordId',pageNumber:'$pageNumber'})
    categoryProducts;
    //product details
    @track selectedRecordId
    ProductDetails(event){
        this.selectedRecordId = event.target.name;
        this[NavigationMixin.Navigate]({
           type: 'standard__recordPage',
           attributes: {
               recordId:this.selectedRecordId,
               objectApiName: 'Product2',
               actionName: 'view'
           } 
       });
    }
    //Pagination Handlers
handlePreviousPage() {
    this.pageNumber = this.pageNumber - 1;
}

handleNextPage() {
    this.pageNumber = this.pageNumber + 1;

}
}