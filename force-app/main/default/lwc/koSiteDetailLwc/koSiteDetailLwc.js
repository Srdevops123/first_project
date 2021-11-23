import { LightningElement,wire,track,api } from 'lwc';
import Carousel_Men from '@salesforce/resourceUrl/MenCarousal';
import Carousel_Women from '@salesforce/resourceUrl/WomenCarousal';
import Carousel_Beauty from '@salesforce/resourceUrl/BeautyCarousal';
import Carousel_Kids from '@salesforce/resourceUrl/KidsCarousal';

export default class KoSiteDetailLwc extends LightningElement {
    carousel={
        carouselMen:Carousel_Men,
        carouselWomen:Carousel_Women,
        carouselBeauty:Carousel_Beauty,
        carouselKids:Carousel_Kids
    }
    
}