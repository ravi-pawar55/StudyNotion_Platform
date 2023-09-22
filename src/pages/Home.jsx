import { Link } from "react-router-dom";
import {FaArrowRight} from "react-icons/fa";
import HighLightText from "../components/core/HomePage/HighLightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";

const Home = () => {
    return (
        <div className=" group realtive mx-auto flex flex-col w-11/12 max-w-maxContent text-white items-center justify-between">
            
            {/*section1*/}

            <Link to={"/signup"}>
              <div className=" mt-16 p-1 mx-auto rounded-full bg-richblack-800 text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900">
                    <p>Become an Instructor</p>
                    <FaArrowRight/>
                </div>
             </div>

            </Link>

            <div className="text-center text-4xl mt-7 font-semibold">
                Empower Your Future with
                <HighLightText text={"Coding Skills"}/>
            </div>

            <div className="w-[90%] text-center font-bold text-lg mt-4">
                 Ravi Pawar
            </div>

            <div className="flex flex-row gap-7 mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Book a Demo
              </CTAButton>
            </div>

            <div className="shadow-blue-200 mx-3 my-12">
              <video muted loop auto>
                <source src={Banner} type="video/mp4"></source>
              </video>
            </div>

           {/*code section 1 */}
           <div>
               <CodeBlocks 
               position={"lg:flex-row"}
               heading={
                <div>
                  Unlock Your
                  <HighLightText text={"Coding Potentials"}/>
                   with your online courses
                </div>
               }
               subheading={" "}
               ctabtn1={
                {
                  text: "Try it Yourself",
                  linkto:"/signup",
                  active: true,
                }
               }

               ctabtn2={
                {
                  text: "Learn More",
                  linkto:"/login",
                  active: false,
                }
               }

               Codeblock={" "}
               codeclor={"yellow"}

                > 
               </CodeBlocks>
           </div>

           {/*code section 2 */}
           <div>
               <CodeBlocks 
               position={"lg:flex-row-reverse"}
               heading={
                <div>
                  Unlock Your
                  <HighLightText text={"Coding Potentials"}/>
                  with your online courses
                </div>
               }
               subheading={" "}
               ctabtn1={
                {
                  text: "Try it Yourself",
                  linkto:"/signup",
                  active: true,
                }
               }

               ctabtn2={
                {
                  text: "Learn More",
                  linkto:"/login",
                  active: false,
                }
               }

               Codeblock={" "}
               codeclor={"yellow"}

              >
                  
               </CodeBlocks>
           </div>



            {/*section2*/}

            <div className="bg-pure-greys-5 text-richblack-700">
              <div className="homepage_bg h-[310px]">
                <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto">
                    <div className="h-[150px]"></div>
                    <div className="flex flex-row gap-7 test-white">
                      <CTAButton active={true} linkto={"/signup"}>
                        <div className="flex items-center gap-3">
                            Explore Full Catalog
                            <FaArrowRight/>
                        </div>
                      </CTAButton>
                      <CTAButton active={false} linkto={"/login"}>
                        <div>
                           Learn More
                        </div>
                      </CTAButton>
                    </div>
                </div>
              </div>
              <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-7">
                  <div className="flex flex-row gap-5 mb-10 mt-[150px]">
                        <div className="text-4xl font-semibold gap-5">
                          Get the skills you need for a 
                          <HighLightText text={"Job that is in Demand"}/>
                        </div>
                        <div className="flex flex-col gap-10 w-[40%] items-start">
                      <div className="text-16xl">
                        The Modern
                      </div>
                  </div>
                  <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                  </CTAButton>
                  </div>

                  <TimeLineSection/>
              
                  <LearningLanguageSection/>
              </div>

            </div>

            {/*section3*/}

            {/*footer*/}

        </div>
    );
};

export default Home;