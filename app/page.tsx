import Welcome from "./components/Welcome";
import About from "./components/about";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import UpdateInfo from "./components/UpdateInfo";
import Footer from "./components/Footer";



export default function HomePage() {
  return (
    <div>

      <Welcome />
      <About />
      <Testimonials />
      <UpdateInfo />
      <Services />
      <Footer/>
    </div>
  );
}
