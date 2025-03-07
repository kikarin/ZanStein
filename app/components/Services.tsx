import { FaCode, FaMobileAlt, FaPalette, FaServer } from "react-icons/fa";

const services = [
  {
    title: "Website Development",
    icon: <FaCode className="text-4xl text-primary" />,
    description: "Membangun website cepat, responsif, dan SEO-friendly.",
  },
  {
    title: "Mobile App Development",
    icon: <FaMobileAlt className="text-4xl text-primary" />,
    description: "Membuat aplikasi mobile Android & iOS berkualitas tinggi.",
  },
  {
    title: "UI/UX Design",
    icon: <FaPalette className="text-4xl text-primary" />,
    description: "Merancang antarmuka pengguna yang menarik dan fungsional.",
  },
  {
    title: "Backend Development",
    icon: <FaServer className="text-4xl text-primary" />,
    description: "Membangun sistem backend yang scalable dan aman.",
  },
];

const Services = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4">
            Layanan Kami
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-card p-6 sm:p-8 hover-scale relative"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-primary bg-opacity-10 rounded-2xl">
                {service.icon}
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-light text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-primary opacity-0 hover:opacity-5 rounded-lg transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
