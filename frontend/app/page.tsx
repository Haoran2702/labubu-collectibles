import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import EmailSignupForm from "./EmailSignupForm";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Features />
      <Testimonials />
    
    {/* Email Signup Section */}
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stay in the Loop
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Get notified about new Labubu launches, exclusive offers, and collectible news.
        </p>
        <div className="max-w-md mx-auto">
          <EmailSignupForm />
        </div>
      </div>
    </section>
    </div>
  );
}
