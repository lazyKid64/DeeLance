import secureImg from "../assets/secure.jpg";
import paymentImg from "../assets/payments.jpg";
import contractImg from "../assets/contracts.jpg";
import profileImg from "../assets/profiles.jpg";

export default function FeaturesSection() {
  const features = [
    {
      title: "SECURE FREELANCING",
      desc: "Encrypted communication and secure deals between freelancers and clients.",
      img: secureImg,
    },
    {
      title: "INSTANT PAYMENTS",
      desc: "Fast and transparent payout system with smooth transaction flow.",
      img: paymentImg,
    },
    {
      title: "SMART CONTRACTS",
      desc: "Work agreements protected with milestone-based and automated contracts.",
      img: contractImg,
    },
    {
      title: "TRUSTED PROFILES",
      desc: "Verified freelancer profiles with reviews, ratings, and secure identity layer.",
      img: profileImg,
    },
  ];

  return (
    <section className="deelance-features">
      <div className="container-fluid px-4 py-5">
        <h2 className="features-title">FEATURES</h2>

        <div className="row g-4 mt-4">
          {features.map((f, i) => (
            <div className="col-12 col-md-6 col-lg-6" key={i}>
              <div className="feature-card">
                {/* ✅ PNG IMAGE */}
                <div className="feature-img-box">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="feature-img"
                    draggable="false"
                  />
                </div>

                <h5 className="feature-heading">{f.title}</h5>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
