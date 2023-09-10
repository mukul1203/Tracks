import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocation } from "./useLocation";
import { updateUser } from "./useUsers";


const auth = getAuth();
const database = getDatabase();
//ReadWrite hook state
//Maintains a state: region of map to be focussed
//Depends on the various users being shown on map
export function useMapRegion(users) {
    const [region, setRegion] = useState({
        latitude:0,
        longitude:0,
        latitudeDelta: 10.0922,
        longitudeDelta: 10.0421
      });
    const [location, errorMsg] = useLocation({latitude:0, longitude:0});//TODO: remove this
    //TODO: calculate region to be a bounding box of users' positions
    //For now, just focus the region on position of the active user
    const {latitude=0, longitude=0} = users[auth.currentUser.uid] ? users[auth.currentUser.uid] : {latitude:0, longitude:0};
    useEffect(()=>{
        setRegion((current)=>({...current, latitude, longitude}));
    },[latitude, longitude]);

    //TODO: there is a conflict here.
    //User may setRegion forcibly by scrolling. We should maintain that region
    //but currently, it will automatically refocus on the user position due to above useEffect call.
    return [region, setRegion];
 };