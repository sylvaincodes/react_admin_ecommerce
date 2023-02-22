import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Index = ({children}) => {

    return (
        <div id="layout-wrapper">
            <Header/>
            <Sidebar/>
            {children}
            <Footer/>
        </div>
    );

}

export default Index