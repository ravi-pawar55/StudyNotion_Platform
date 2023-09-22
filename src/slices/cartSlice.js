import {createSlice} from '@reduxjs/tooolkit';
import {toast} from 'react-hot-toast';

const initialState = {
     totalItem:localStorage.getItem('totalItem') ? JSON.parse(localStorage.getItem('totalItem')):0,
}

const cartSlice = createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{
        setTotalItems(state,value){
            state.cart = value.payload;
        }
        //add to cart
        //remove cart
        //reset cart
    }
})

export const {settotalItems}= cartSlice.actions;

export default cartSlice.reducer ;

