public class validatePINcode {
    @AuraEnabled
  public static boolean PINcode(String pincode) {
        HttpRequest req = new HttpRequest(); 
        req.setMethod('GET');
        req.setEndpoint('https://api.postalpincode.in/pincode/'+pincode);
       // req.setHeader('Content-Length', '-1');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug('BODY: '+res.getBody());
        System.debug('STATUS:'+res.getStatus());
        System.debug('STATUS_CODE:'+res.getStatusCode());
        if(res.getBody().contains('No records found')){
        return false;}
            else{
            return true;
            }        
        
        
    }
}