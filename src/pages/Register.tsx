import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
