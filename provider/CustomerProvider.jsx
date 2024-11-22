import {PropsWithChildren, createContext, useContext, useState, useEffect} from 'react';
import { getCustomer } from '~/utils/Firebase';
const CustomerContext = createContext({});

// customerLoginNumber
const customerContact = 8349755538;

export default function CustomerProvider ({children} : PropsWithChildren) {
    const [customer, setCustomer] = useState({});
    
    useEffect(()=>{
      getCustomer(customerContact, setCustomer)
    }, [customer])
    //console.log("customer", customer);
    return (
    <CustomerContext.Provider value ={{
      customerName: customer.name, 
      customerContact: customer.ContactNo, 
      customerAddress : customer.address,  
      customerCoordinates : customer.coordinates
      }}>
        {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => useContext(CustomerContext);