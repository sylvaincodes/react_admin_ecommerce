import React , {  useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Index = ({children}) => {
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);

    return (
        <div id="layout-wrapper">
            <Header sidebar={sidebar} showSidebar={showSidebar}/>
            <Sidebar sidebar={sidebar} showSidebar={showSidebar}/>
            <div className="main-content">{children}</div>
            <Footer/>
        </div>
    );

}

export default Index