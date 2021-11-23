trigger KoSiteContactEdit on Contact (after update ) {
    User u=[select id,firstName,lastName,email from User where Name=:UserInfo.getUserId()];
    for(Contact c:trigger.new){
        u.lastName=c.lastName;
        u.firstName=c.firstName;
        u.email=c.email;
    }
    update u;
}