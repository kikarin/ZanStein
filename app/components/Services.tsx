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
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            Layanan Kami
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-card p-6 hover-scale"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-primary bg-opacity-10 rounded-2xl">
                {service.icon}
              </div>
              
              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-secondary mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-light text-sm leading-relaxed">
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
