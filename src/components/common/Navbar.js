import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo/Logo-Full-Light.png';
import{NavbarLinks} from '../../data/navbar-links'
import { useLocation } from 'react-router-dom';
import {AiOutlineShoppingCart} from 'react-icons/ai'

const Navbar = () =>{
    const {token} = useSeletor((state)=> state.auth);
    const {user} = useSeletor((state)=>state.profile);
    const {totalItems} = useSeletor((state)=>state.cart);
    const location = useLocation();
    const matchRoute = (route)=>{
        return matchPath({path:route},location.pathname);
    }

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-richblack-700' >
            <div className='flex w-11/12 max-w-maxContent items-center justify-center'>
                   <Link to='/'>
                    <img src={Logo} width={160} height={42} loading='lazy'/>
                   </Link>
                   <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                         NavbarLinks.map( (link,index) => (
                            <li key={index}>
                            {
                               link.title ==='Catlog'?(<div></div>):(
                                <Link to={link?.path}>
                                      <p className={`${matchRoutes(link?.path)?'text-yellow-25':'text-richblack-25'}`}>
                                        {link.title}
                                      </p>
                                </Link>
                               )
                            }
                            </li>
                         ))
                    </ul>
                   </nav>
                   <div className='flex gap-x-4 items-center'>
                      {
                        user && user?.accountType !== 'Intructor' && (
                            <Link to='/dashboard/cart' className='relative'>
                                 <AiOutlineShoppingCart></AiOutlineShoppingCart>
                                 {
                                    totalItems>0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                 }
                            </Link>
                        )
                      }
                   </div>
            </div>
        </div>
    )
}

export default Navbar;