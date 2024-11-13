import {firestore} from "../firebaseConfig.js";
import {ToastAndroid} from 'react-native';
import { 
    addDoc, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc,
    query, 
    where, 
    setDoc, 
    deleteDoc 
} from 'firebase/firestore';

let vendorRef = collection(firestore, "vendors");
let customerRef = collection(firestore, "customer");
let postRef = collection(firestore, "vendors");
// let postRef = doc(firestore, "users","51usiD0xVo3ba8Nd539w");

// export const uploadVehicleInfo =(object)=>{
//     addDoc(postRef, object)
//     .then((res) => {
//         toast.success('Document has been uploaded.');
//     })
//     .catch((err) =>{
//         toast.error(err);
//     })
// }

export const getVehicleInfo = (setAllStatus) =>{
    onSnapshot(vendorRef, response =>{
        setAllStatus(response.docs.map((docs)=>{
            //console.log(docs.data)
            return {...docs.data(), id: docs.id}
        }))
        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // }));
    })
}

export const getCustomer = (setAllStatus) =>{
    onSnapshot(customerRef, response =>{
        setAllStatus(response.docs.map((docs)=>{
            return {...docs.data(), id: docs.id}
        }))
        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // }));
    })
}


export const updateVehicleInfo =(id, latitude, longitude)=>{
    let postToEdit = doc(vendorRef, id);
    updateDoc(postToEdit, {latitude: latitude, longitude: longitude})
    .then((res) => {
        ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
    })
    .catch((err) =>{
        ToastAndroid.show('Error', ToastAndroid.SHORT);
    })
}


export const getPosts = (ContactNo, setData) =>{
    let commentQuery = query(postRef, where('ContactNo', '==', ContactNo));
    
    
    onSnapshot(commentQuery, response =>{

            let comments = response.docs.map((docs)=>docs.data());
            // console.log(comments)
            console.log(comments)
            setData(comments[0]?.vegetables);


        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // }));
    })
}


export const getVendor = (ContactNo, setData) =>{
    let commentQuery = query(postRef, where('ContactNo', '==', ContactNo));
    onSnapshot(commentQuery, response =>{
            let data = response.docs.map((docs)=>docs.data());
            console.log(data)
            setData();
        // console.log(response.docs.map((docs)=>{
        //     return {...docs.data(), id: docs.id}
        // }));
    })
}

export const getComment=(postID, setComments)=>{
    try{
        let commentQuery = query(commentsRef, where('postID', '==', postID));
        onSnapshot(commentQuery, (response) =>{   
            let comments = response.docs.map((docs)=>docs.data());
            // console.log(comments)
            setComments(comments)
        })
    }catch(e){
        return e;
    }
}

