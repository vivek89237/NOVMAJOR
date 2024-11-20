import {PropsWithChildren, createContext, useContext, useState, useEffect} from 'react';

const customerContext = createContext({});

// customerLoginNumber
const customerContact = 8349755538;

export default function CustomerProvider ({children} : PropsWithChildren) {
    const [customer, setCustomer] = useState({});
    
    useEffect(()=>{
      getCustomer(customerContact, setCustomer)
    }, [customer])

    return (
    <ScooterContext.Provider value ={{
      customerName: customer.name, 
      customerContact: customer.phone, 
      customerAddress : customer.address,  
      customerCoordinates : customer.coordinates
      }}>
        {children}
    </ScooterContext.Provider>
  )
}

export const useScooter = () => useContext(customerContext);